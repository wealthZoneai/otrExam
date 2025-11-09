// src/components/exam/types.ts

// ✅ Each exam question
export interface Question {
  id: string;
  questionText: string;
  options: string[]; // Option A, B, C, D etc.
  correctAnswer: string;
  setName: string; // "A", "B", "C", or "D"
  answer?: string | null;
}

// ✅ When a student submits an answer
export interface Submission {
  id?: string;
  questionId: string;
  userAnswer: string;
  isGraded?: boolean;
  aiFeedback?: string;
  isCorrect?: boolean;
  setName?: string;
}

// ✅ Any violation detected by AI proctoring
export interface Violation {
  type: string;         // "Face Missing" | "Multiple Faces" etc.
  message: string;
  timestamp: string;    // local time string
}

// ✅ Props for the main Exam component
export interface ExamScreenProps {
  rollNumber: string;
  otrId: string;
}

// ✅ API Response type when exam starts
export interface ExamStartResponse {
  studentName: string;
  setName: "A" | "B" | "C" | "D";
  questions: Question[];
}

// ✅ Payload type for exam submission API
export interface ExamSubmitPayload {
  rollNumber: string;
  otrId: string;
  submissions: {
    questionId: string;
    userAnswer: string;
  }[];
}

// ✅ Timer props
export interface TimerProps {
  isSubmitted: boolean;
  onTimeout: () => void;
}

// ✅ Webcam reference type (used by FaceDetector)
export type WebcamRef = React.RefObject<Webcam | null>;


export interface ConductExamResponse {
  candidateName: string;
  examRollNo: string;
  setName: string;
  paperName: string | null;
  paperId: number;
  questions: ExamQuestion[];
}

export interface ExamQuestion {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer?: string | null; // user answer (frontend only)
}

export interface ExamQuestion {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer?: string | null;
}

export interface ConductExamResponse {
  candidateName: string;
  examRollNo: string;
  setName: string;
  paperName: string | null;
  paperId: number;
  questions: ExamQuestion[];
}

export interface ExamQuestion {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer?: string | null;
}

export interface ConductExamResponse {
  candidateName: string;
  examRollNo: string;
  setName: string;
  paperName: string | null;
  paperId: number;
  questions: ExamQuestion[];
}


