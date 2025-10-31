export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum RecordType {
    VoiceNote = 'VOICE_NOTE',
    LabReport = 'LAB_REPORT',
    ImagingReport = 'IMAGING_REPORT',
    Diagnosis = 'DIAGNOSIS_SUGGESTION'
}

export interface VoiceNote {
    type: RecordType.VoiceNote;
    transcription: {
        chiefComplaint: string;
        history: string;
        examination: string;
        impression: string;
    },
    summary?: string;
}

export interface Report {
    type: RecordType.LabReport | RecordType.ImagingReport;
    fileName: string;
    fileType: string;
    analysis: {
        summary: string;
        keyFindings: string[];
        recommendations: string;
        // Added for chart visualization
        extractedValues?: { label: string; value: number; unit: string; range: [number, number] }[];
    };
    imageUrl?: string; // For imaging reports
    doctorNotes?: string;
}

export interface Diagnosis {
    type: RecordType.Diagnosis;
    symptoms: string;
    potentialDiagnoses: {
        condition: string;
        confidence: number; // 0 to 1
        rationale: string;
    }[];
    criticalAlert?: string;
}

export type PatientRecord = {
    id: string;
    date: string;
} & (VoiceNote | Report | Diagnosis);

export interface Patient {
  uid: string;
  name: string;
  age: number;
  gender: Gender;
  contact: string;
  email?: string;
  password?: string;
  medicalHistory: string;
  allergies: string;
  insurance?: string;
  records: PatientRecord[];
  department?: Department;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export enum Department {
    Cardiology = 'Cardiology',
    Neurology = 'Neurology',
    Orthopedics = 'Orthopedics',
    Pediatrics = 'Pediatrics',
    Dermatology = 'Dermatology',
    General = 'General Physician'
}

export interface Doctor {
  uid: string;
  name: string;
  email?: string;
  password?: string;
  specialization: Department;
  experience: number; // in years
  photoUrl: string;
  hospital: string;
  availability: {
    // Key is day of week (e.g., "Monday"), value is array of time slots
    [day: string]: string[];
  };
}

// Fix: Add UserRole type for use in other components.
export type UserRole = 'doctor' | 'patient';
export type UserProfile = (Doctor & { role: 'doctor' }) | (Patient & { role: 'patient' });