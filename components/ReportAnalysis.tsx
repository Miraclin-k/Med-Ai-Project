import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Patient, PatientRecord, RecordType, Report } from '../types';
import { geminiService } from '../services/geminiService';
import { LiveServerMessage, Modality, Blob } from '@google/genai';
import MicrophoneIcon from './icons/MicrophoneIcon';

interface ReportAnalysisProps {
  patient: Patient;
  addPatientRecord: (patientId: string, record: PatientRecord) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

// Helper functions for audio processing
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

const ValueChart: React.FC<{ data: NonNullable<Report['analysis']['extractedValues']> }> = ({ data }) => {
    if (!data || data.length === 0) return null;

    const getBarColor = (value: number, range: [number, number]) => {
        if (value < range[0] || value > range[1]) return 'fill-red-500';
        return 'fill-blue-500';
    };

    return (
        <div className="p-4 bg-gray-100 rounded-md">
            <h4 className="font-semibold text-lg mb-4">Extracted Values</h4>
            <div className="space-y-4">
                {data.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                            <span className="text-sm font-bold text-gray-800">{item.value} {item.unit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className={`h-4 rounded-full ${getBarColor(item.value, item.range)}`}
                                style={{ width: `${Math.min(100, (item.value / (item.range[1] * 1.2)) * 100)}%` }} // Simple scaling
                            ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Normal Range: {item.range[0]} - {item.range[1]} {item.unit}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const ReportAnalysis: React.FC<ReportAnalysisProps> = ({ patient, addPatientRecord }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Omit<Report, 'type' | 'fileName' | 'fileType' | 'doctorNotes'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState<string>('Analyze this medical image for abnormalities.');
  
  // State for voice dictation
  const [isDictating, setIsDictating] = useState(false);
  const [dictationText, setDictationText] = useState('');
  const [dictationStatus, setDictationStatus] = useState('Ready to dictate notes.');
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Reset everything on new file selection
      setFile(selectedFile);
      setAnalysisResult(null);
      setError(null);
      setDictationText('');
      setDictationStatus('Ready to dictate notes.');

      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let response;
      if (file.type.startsWith('image/')) {
        const base64Image = await fileToBase64(file);
        response = await geminiService.analyzeMedicalImage(base64Image, file.type, imagePrompt);
      } else if (file.type === 'text/plain' || file.type === 'application/pdf' || file.type.includes('csv')) { // Assuming PDF can be read as text
        const textContent = await file.text();
        response = await geminiService.analyzeMedicalText(textContent);
      } else {
        throw new Error('Unsupported file type. Please upload an image, PDF, or text file.');
      }
      
      const resultText = response.text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(resultText);

      const newAnalysisResult = { 
        analysis: result, 
        ...(file.type.startsWith('image/') && { imageUrl: filePreview! })
      };
      setAnalysisResult(newAnalysisResult);

    } catch (err) {
      console.error(err);
      setError('Failed to analyze the report. Please ensure the file is valid and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopDictation = useCallback(() => {
    if (isDictating) {
        setIsDictating(false);
        setDictationStatus('Stopping...');

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
        setDictationStatus('Dictation stopped. Ready to start again.');
    }
  }, [isDictating]);

  const startDictation = async () => {
    if (isDictating) return;
    setIsDictating(true);
    setDictationStatus('Initializing...');
    setDictationText('');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        
        const live = geminiService.getLiveConnection();
        sessionPromiseRef.current = live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    setDictationStatus('Microphone active. Start speaking.');
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
                        setDictationText(prev => prev + text);
                    }
                },
                onerror: (e: ErrorEvent) => {
                    console.error('Gemini Live Error:', e);
                    setDictationStatus(`Error: ${e.message}. Please try again.`);
                    stopDictation();
                },
                onclose: (e: CloseEvent) => {
                    setDictationStatus('Connection closed.');
                    stopDictation();
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
            },
        });
    } catch (error) {
        console.error("Failed to start dictation:", error);
        setDictationStatus(`Error: Could not access microphone. Please check permissions.`);
        setIsDictating(false);
    }
  };

  const handleSaveRecord = () => {
    if (!file || !analysisResult) return;

    const newRecord: PatientRecord = {
        id: `rec-${Date.now()}`,
        date: new Date().toISOString(),
        type: file.type.startsWith('image/') ? RecordType.ImagingReport : RecordType.LabReport,
        fileName: file.name,
        fileType: file.type,
        ...analysisResult,
        doctorNotes: dictationText,
    };
    // Fix: Changed patient.id to patient.uid to match the Patient type.
    addPatientRecord(patient.uid, newRecord);
    
    // Reset component state
    setFile(null);
    setFilePreview(null);
    setAnalysisResult(null);
    setDictationText('');
    setImagePrompt('Analyze this medical image for abnormalities.');
    alert('Report and notes saved successfully!');
  };

  useEffect(() => {
    return () => {
        stopDictation();
    };
  }, [stopDictation]);

  return (
    <div className="space-y-6">
       <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-r-lg">
        <p className="font-semibold">Medical Report & Image Analysis</p>
        <p className="text-sm">Upload a report for AI analysis, then dictate your own notes to create a comprehensive record.</p>
      </div>
      
      {!analysisResult && (
        <div className="flex flex-col sm:flex-row items-end gap-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700">1. Upload File (Image, PDF, TXT)</label>
                <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.png,.jpg,.jpeg"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>
            <button 
                onClick={handleAnalyze} 
                disabled={!file || isLoading}
                className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Analyzing...' : '2. Analyze'}
            </button>
        </div>
      )}

      {file && file.type.startsWith('image/') && !analysisResult && (
        <div className="p-4 border rounded-lg bg-gray-50">
            <label className="block text-sm font-medium text-gray-700">Image Analysis Prompt</label>
            <input 
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
      )}

      {error && <p className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</p>}
      
      {isLoading && <div className="p-4 text-center col-span-full">Analyzing report, this may take a moment...</div>}

      {analysisResult && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">AI Analysis Results for: {file?.name}</h3>
                    <div>
                      <h4 className="font-semibold text-lg">Summary</h4>
                      <p className="mt-1 p-3 bg-gray-100 rounded-md">{analysisResult.analysis.summary}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Key Findings</h4>
                      <ul className="mt-1 p-3 bg-gray-100 rounded-md list-disc list-inside space-y-1">
                        {analysisResult.analysis.keyFindings.map((finding, i) => <li key={i}>{finding}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Recommendations</h4>
                      <p className="mt-1 p-3 bg-gray-100 rounded-md">{analysisResult.analysis.recommendations}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {filePreview && (
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Image Preview:</h4>
                        <img src={filePreview} alt="Preview" className="rounded-lg border max-w-full h-auto" />
                      </div>
                    )}
                    {analysisResult.analysis.extractedValues && (
                        <ValueChart data={analysisResult.analysis.extractedValues} />
                    )}
                </div>
            </div>

            <div className="space-y-4 p-4 border-t mt-6">
                <h3 className="text-xl font-bold">3. Doctor's Notes (Optional)</h3>
                <div className="flex items-center gap-4">
                     <button
                        onClick={isDictating ? stopDictation : startDictation}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 ${isDictating ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        <MicrophoneIcon className="w-6 h-6" />
                        <span>{isDictating ? 'Stop Dictation' : 'Start Dictation'}</span>
                    </button>
                    <p className="text-gray-600">{dictationStatus}</p>
                </div>
                 <textarea
                    value={dictationText}
                    onChange={(e) => setDictationText(e.target.value)}
                    placeholder="Dictate notes or type them here..."
                    className="w-full h-40 p-4 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleSaveRecord}
                        className="px-8 py-3 bg-green-600 text-white font-bold text-lg rounded-md hover:bg-green-700 transition-colors"
                    >
                        Save Record to Patient History
                    </button>
                    <button
                        onClick={() => setAnalysisResult(null)}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold"
                    >
                        Analyze Another Report
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ReportAnalysis;