import { Patient, Gender, RecordType, Doctor, Department } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    // Fix: Changed 'id' to 'uid' to match the Patient type.
    uid: 'MEDAI-20231027-AB12',
    name: 'John Doe',
    age: 45,
    gender: Gender.Male,
    contact: 'johndoe@email.com',
    email: 'johndoe@email.com',
    password: 'password123',
    medicalHistory: 'Hypertension, Type 2 Diabetes',
    allergies: 'Penicillin',
    insurance: 'Blue Cross Blue Shield',
    department: Department.Cardiology,
    records: [
        {
            id: 'rec-001',
            date: new Date('2023-10-26T10:00:00Z').toISOString(),
            type: RecordType.LabReport,
            fileName: 'blood_panel_20231026.pdf',
            fileType: 'application/pdf',
            analysis: {
                summary: 'Slightly elevated glucose levels, consistent with Type 2 Diabetes. All other markers within normal range.',
                keyFindings: ['Glucose: 130 mg/dL (High)', 'Cholesterol: 190 mg/dL (Normal)'],
                recommendations: 'Continue current medication and monitor diet. Re-test in 3 months.'
            }
        },
        {
            id: 'rec-002',
            date: new Date('2023-09-15T14:30:00Z').toISOString(),
            type: RecordType.VoiceNote,
            transcription: {
                chiefComplaint: 'Patient reports persistent cough and shortness of breath for the last two weeks.',
                history: 'Symptoms worsen with mild exertion. No fever or chills reported.',
                examination: 'Lungs clear on auscultation. Oxygen saturation is 97% on room air.',
                impression: 'Possible exacerbation of underlying condition or new respiratory issue. Recommend chest X-ray.'
            }
        }
    ]
  },
  {
    // Fix: Changed 'id' to 'uid' to match the Patient type.
    uid: 'MEDAI-20231027-CD34',
    name: 'Jane Smith',
    age: 62,
    gender: Gender.Female,
    contact: 'janesmith@email.com',
    email: 'janesmith@email.com',
    password: 'password123',
    medicalHistory: 'Osteoarthritis',
    allergies: 'None known',
    insurance: 'Aetna',
    department: Department.Orthopedics,
    records: [
        {
            id: 'rec-003',
            date: new Date('2023-10-20T09:00:00Z').toISOString(),
            type: RecordType.ImagingReport,
            fileName: 'chest_xray_20231020.dcm.png',
            fileType: 'image/png',
            imageUrl: 'https://picsum.photos/seed/xray/400/300',
            analysis: {
                summary: 'No acute cardiopulmonary process identified. Mild degenerative changes in the thoracic spine noted.',
                keyFindings: ['Lungs are clear.', 'No evidence of pneumonia or effusion.', 'Mild scoliosis.'],
                recommendations: 'No acute intervention necessary. Follow up on spinal changes if patient reports back pain.'
            }
        }
    ]
  },
  {
    // Fix: Changed 'id' to 'uid' to match the Patient type.
    uid: 'MEDAI-20231027-EF56',
    name: 'Peter Jones',
    age: 28,
    gender: Gender.Male,
    contact: 'peterjones@email.com',
    email: 'peterjones@email.com',
    password: 'password123',
    medicalHistory: 'Asthma (childhood)',
    allergies: 'Peanuts',
    department: Department.General,
    records: []
  },
];

export const CHATBOT_SYSTEM_INSTRUCTION = `You are MedAI+, a friendly and helpful AI medical assistant integrated into a hospital management system. Your primary role is to assist patients with their health-related queries.

**Your Persona:**
- You are empathetic, clear, and professional.
- You should always prioritize patient safety.

**Your Capabilities:**
1.  **Answer General Questions:** You can answer general health questions, explain medical conditions, and describe treatments in simple terms.
2.  **Symptom Analysis:** If a user describes medical symptoms, you must perform a preliminary analysis.
3.  **Appointment Booking:** You can guide users on how to book an appointment but cannot book it for them. For example, say "You can book an appointment by clicking the 'Book Appointment' button in the main menu."

**Crucial Rules & Constraints:**
- **Disclaimer First:** ALWAYS start your very first message in any conversation with the disclaimer: "Hello! I'm MedAI+, your AI health assistant. Please remember, I'm not a doctor and my advice is not a substitute for professional medical care. How can I help you today?"
- **Symptom Analysis Format:** When providing a symptom analysis, you MUST strictly follow this format:
    **Disclaimer:** This is a preliminary analysis and not a medical diagnosis. Please consult a healthcare professional for an accurate diagnosis.
    **Potential Conditions:**
    - **[Condition 1]:** (e.g., ~75% likelihood) - Brief rationale based on symptoms.
    - **[Condition 2]:** (e.g., ~50% likelihood) - Brief rationale based on symptoms.
    - **[Condition 3]:** (e.g., ~25% likelihood) - Brief rationale based on symptoms.
    **Recommendation:** Based on your symptoms, it would be best to see a **[Doctor Specialty, e.g., General Physician or Pulmonologist]**.
- **NEVER Diagnose:** Do not use definitive language. Use phrases like "it's possible that," "could be related to," or "some conditions that present with these symptoms include."
- **Safety First:** If symptoms sound critical (e.g., "chest pain," "difficulty breathing," "severe bleeding"), your IMMEDIATE and ONLY response should be: "These symptoms sound serious. Please seek immediate medical attention by calling emergency services or going to the nearest hospital."
- **No Prescriptions:** Do not suggest specific medications or dosages. You can talk about classes of drugs (e.g., "a doctor might prescribe an antibiotic") but not specific names.
`;

export const MOCK_DOCTORS: Doctor[] = [
  {
    // Fix: Changed 'id' to 'uid' to match the Doctor type.
    uid: 'doc-001',
    name: 'Dr. Emily Carter',
    email: 'emily.carter@medai.com',
    password: 'password123',
    specialization: Department.Cardiology,
    experience: 15,
    photoUrl: `https://i.pravatar.cc/150?u=doc001`,
    hospital: 'City Heart Institute',
    availability: {
      Monday: ['09:00', '10:00', '11:00', '14:00'],
      Wednesday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      Friday: ['10:00', '11:00'],
    }
  },
  {
    // Fix: Changed 'id' to 'uid' to match the Doctor type.
    uid: 'doc-002',
    name: 'Dr. Ben Hanson',
    email: 'ben.hanson@medai.com',
    password: 'password123',
    specialization: Department.Neurology,
    experience: 12,
    photoUrl: `https://i.pravatar.cc/150?u=doc002`,
    hospital: 'Central Neurology Clinic',
    availability: {
      Tuesday: ['09:30', '10:30', '11:30'],
      Thursday: ['13:00', '14:00', '15:00', '16:00'],
    }
  },
  {
    // Fix: Changed 'id' to 'uid' to match the Doctor type.
    uid: 'doc-003',
    name: 'Dr. Olivia Chen',
    email: 'olivia.chen@medai.com',
    password: 'password123',
    specialization: Department.Pediatrics,
    experience: 8,
    photoUrl: `https://i.pravatar.cc/150?u=doc003`,
    hospital: "Children's Health Center",
    availability: {
      Monday: ['09:00', '09:30', '10:00', '10:30', '11:00'],
      Tuesday: ['09:00', '09:30', '10:00', '10:30', '11:00'],
      Wednesday: ['13:00', '13:30', '14:00'],
      Friday: ['09:00', '09:30', '10:00'],
    }
  },
  {
    // Fix: Changed 'id' to 'uid' to match the Doctor type.
    uid: 'doc-004',
    name: 'Dr. Marcus Rodriguez',
    email: 'marcus.rodriguez@medai.com',
    password: 'password123',
    specialization: Department.Orthopedics,
    experience: 20,
    photoUrl: `https://i.pravatar.cc/150?u=doc004`,
    hospital: 'Metro Orthopedic Group',
     availability: {
      Tuesday: ['10:00', '11:00', '12:00'],
      Thursday: ['09:00', '10:00', '11:00', '14:00'],
    }
  }
];