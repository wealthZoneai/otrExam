// src/components/exam/ExamScreen.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import toast, { Toaster } from "react-hot-toast";
// import { fetchExamData, submitExamAnswers } from "./api";
import type { Question, Submission, Violation } from "../types/exam";
import { Sidebar } from "lucide-react";


const MAX_WARNINGS = 3;

const ExamScreens: React.FC<{ rollNumber: string; otrId: string }> = ({
  rollNumber,
  otrId,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeSet, setActiveSet] = useState("A");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [warnings, setWarnings] = useState(0);
  const webcamRef = useRef<Webcam | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // const data = await fetchExamData(rollNumber, otrId);
        // // shuffle questions for random order
        // const shuffled = data.questions.sort(() => 0.5 - Math.random());
        // setQuestions(shuffled);
        // setActiveSet(data.setName);
        // toast.success(`Exam Started (Set ${data.setName})`);
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    load();
  }, [rollNumber, otrId]);

  const logViolation = useCallback(
    (type: string, msg: string) => {
      if (isSubmitted || warnings >= MAX_WARNINGS) return;
      const v = { type, message: msg, timestamp: new Date().toLocaleTimeString() };
      setViolations((prev) => [...prev, v]);

      setWarnings((w) => {
        const newCount = w + 1;
        if (newCount >= MAX_WARNINGS) {
          toast.error("🚨 Exam terminated!");
          handleSubmit();
        } else toast.error(`${type}: ${msg}`);
        return newCount;
      });
    },
    [warnings, isSubmitted]
  );

  const handleAnswer = (qId: string, opt: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        rollNumber,
        otrId,
        submissions: Object.entries(answers).map(([qId, ans]) => ({
          questionId: qId,
          userAnswer: ans,
        })),
      };
      // await submitExamAnswers(payload);
      // setIsSubmitted(true);
      // toast.success("✅ Exam Submitted!");
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [answers, rollNumber, otrId]);

  const filtered = questions.filter((q) => q.setName === activeSet);

  return (
    <div className="flex w-screen h-screen bg-gray-50 overflow-hidden">
      <Toaster />
      <Sidebar
        activeSet={activeSet}
        onSetChange={setActiveSet}
        webcamRef={webcamRef}
        violations={violations}
        warningCount={warnings}
        maxWarnings={MAX_WARNINGS}
        onTimeout={handleSubmit}
        isSubmitted={isSubmitted}
        onSubmit={handleSubmit}
        showSubmit={filtered.length > 0}
        onViolation={logViolation}
      />
      <main className="flex-1 overflow-y-auto p-6">
        {/* {filtered.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            selected={answers[q.id] || null}
            onSelect={(opt) => handleAnswer(q.id, opt)}
            isDisabled={isSubmitted}
          />
        ))} */}
      </main>
    </div>
  );
};

export default ExamScreens;
