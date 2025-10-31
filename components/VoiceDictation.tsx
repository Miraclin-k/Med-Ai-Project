import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Patient, PatientRecord, RecordType } from '../types';
import { geminiService } from '../services/geminiService';
// Fix: Removed non-exported type 'LiveSession' from the import.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import MicrophoneIcon from './icons/MicrophoneIcon';

interface VoiceDictationProps {
  patient: Patient;
  addPatientRecord: (patientId: string, record: PatientRecord) => void;
}

// Helper functions for audio processing (must be defined at the module level)
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}


const VoiceDictation: React.FC<VoiceDictationProps> = ({ patient, addPatientRecord }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [status, setStatus] = useState('Idle. Press Start to begin dictation.');
    // Fix: Using Promise<any> as LiveSession type is not exported from the SDK.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    
    const stopRecording = useCallback(() => {
        if (isRecording) {
            setIsRecording(false);
            setStatus('Stopping...');
    
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }
            if(scriptProcessorRef.current) {
                scriptProcessorRef.current.disconnect();
                scriptProcessorRef.current = null;
            }
            if(mediaStreamSourceRef.current) {
                mediaStreamSourceRef.current.disconnect();
                mediaStreamSourceRef.current = null;
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().then(() => {
                    audioContextRef.current = null;
                });
            }
            if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then(session => session.close());
                sessionPromiseRef.current = null;
            }
            setStatus('Recording stopped. Ready to start new session.');
        }
    }, [isRecording]);


    const startRecording = async () => {
        if (isRecording) return;
        setIsRecording(true);
        setStatus('Initializing...');
        setTranscription('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            
            const live = geminiService.getLiveConnection();
            sessionPromiseRef.current = live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('Microphone active. Start speaking.');
                        const source = audioContextRef.current!.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;
                        
                        const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = processor;
                        
                        processor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        source.connect(processor);
                        processor.connect(audioContextRef.current!.destination);
                    },
                    onmessage: (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            setTranscription(prev => prev + text);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Gemini Live Error:', e);
                        setStatus(`Error: ${e.message}. Please try again.`);
                        stopRecording();
                    },
                    onclose: (e: CloseEvent) => {
                        setStatus('Connection closed.');
                        stopRecording();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                },
            });

        } catch (error) {
            console.error("Failed to start recording:", error);
            setStatus(`Error: Could not access microphone. Please check permissions.`);
            setIsRecording(false);
        }
    };

    const handleSaveNote = () => {
        // Simple parsing for demonstration
        const sections = { chiefComplaint: '', history: '', examination: '', impression: ''};
        const lines = transcription.split('\n');
        // This is a placeholder logic. A real implementation would use a more robust NLP model to segment the text.
        sections.chiefComplaint = lines.slice(0, Math.ceil(lines.length * 0.25)).join('\n');
        sections.history = lines.slice(Math.ceil(lines.length * 0.25), Math.ceil(lines.length * 0.5)).join('\n');
        sections.examination = lines.slice(Math.ceil(lines.length * 0.5), Math.ceil(lines.length * 0.75)).join('\n');
        sections.impression = lines.slice(Math.ceil(lines.length * 0.75)).join('\n');
        
        const newRecord: PatientRecord = {
            id: `rec-${Date.now()}`,
            date: new Date().toISOString(),
            type: RecordType.VoiceNote,
            transcription: sections
        };
        // Fix: Changed patient.id to patient.uid to match the Patient type.
        addPatientRecord(patient.uid, newRecord);
        setTranscription('');
        alert('Note saved to patient record.');
    };

    useEffect(() => {
        return () => {
            stopRecording();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-r-lg">
                <p className="font-semibold">Doctor Dictation</p>
                <p className="text-sm">Use your microphone to dictate clinical notes. The AI will transcribe your voice in real-time. Please speak clearly.</p>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    <MicrophoneIcon className="w-6 h-6" />
                    <span>{isRecording ? 'Stop Dictation' : 'Start Dictation'}</span>
                </button>
                <p className="text-gray-600">{status}</p>
            </div>

            <div className="w-full">
                <h4 className="font-semibold mb-2">Live Transcription:</h4>
                <textarea
                    value={transcription}
                    readOnly
                    placeholder="Transcription will appear here..."
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            {transcription && !isRecording && (
                <button
                    onClick={handleSaveNote}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
                >
                    Save Note to Patient Record
                </button>
            )}
        </div>
    );
};

export default VoiceDictation;