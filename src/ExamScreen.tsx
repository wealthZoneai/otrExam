import React, { useState, useEffect, useCallback, useRef, type RefObject } from "react";
import Webcam from "react-webcam";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import ExamVerificationModal from "./components/ExamVerificationModal";
import type { ConductExamResponse, ExamQuestion } from "./types/exam";
import { SubmitExam } from "./services/apiHelpers";

const BASE_API_URL = "http://localhost:8068";
const MAX_WARNINGS = 3;
const EXAM_DURATION_SECONDS = 45 * 60;

type WebcamRef = RefObject<Webcam | null>;
type LogViolation = (type: string, message: string) => void;

interface Violation {
    type: string;
    message: string;
    timestamp: string;
}

// --- TIMER ---
function useTimer(isSubmitted: boolean, handleSubmit: () => void) {
    const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);

    useEffect(() => {
        if (isSubmitted || timeLeft <= 0) {
            if (timeLeft <= 0 && !isSubmitted) {
                handleSubmit();
                toast.success("Time's up! Auto-submitted.");
            }
            return;
        }
        const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [isSubmitted, timeLeft, handleSubmit]);

    const m = Math.floor(timeLeft / 60)
        .toString()
        .padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// --- FACE DETECTOR ---
const FaceDetector: React.FC<{ webcamRef: WebcamRef; logViolation: LogViolation }> = ({
    webcamRef,
    logViolation,
}) => {
    const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
    const [faceCount, setFaceCount] = useState(0);
    const [status, setStatus] = useState("Loading AI Model...");

    useEffect(() => {
        const loadModel = async () => {
            await tf.setBackend("webgl");
            const loaded = await blazeface.load();
            setModel(loaded);
            setStatus("Face Detection Active.");
        };
        loadModel();
    }, []);

    const detectFaces = useCallback(async () => {
        const video = webcamRef.current?.video;
        if (video && video.readyState === 4 && model) {
            const predictions = await model.estimateFaces(video, false);
            setFaceCount(predictions.length);

            if (predictions.length === 0) {
                logViolation("Face Missing", "No face detected.");
                toast.error("🔴 Face not visible!");
            } else if (predictions.length > 1) {
                logViolation("Multiple Faces", "Detected multiple faces.");
                toast.error("🚨 Multiple faces detected!");
            }
        }
    }, [model, webcamRef, logViolation]);

    useEffect(() => {
        let interval: number | undefined;
        if (model) interval = window.setInterval(() => detectFaces(), 1000);
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [model, detectFaces]);

    return (
        <div className="text-center text-xs mt-2">
            <p className={`font-semibold ${status.includes("Active") ? "text-green-600" : "text-yellow-600"}`}>
                {status}
            </p>
            <p className="text-gray-500">Faces: {faceCount}</p>
        </div>
    );
};

// --- MAIN ---
const ExamScreen = () => {
    const [examData, setExamData] = useState<ConductExamResponse | null>(null);
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [violations, setViolations] = useState<Violation[]>([]);
    const [warningCount, setWarningCount] = useState(0);
    const webcamRef = useRef<Webcam>(null);

    const handleExamStart = (data: ConductExamResponse) => {
        const formatted = data.questions.map((q: any) => ({
            ...q,
            answer: null,
        }));
        setExamData(data);
        setQuestions(formatted.sort(() => Math.random() - 0.5));
    };

    const handleSubmit = useCallback(async () => {
        if (isSubmitted || !examData) return;
        setIsSubmitted(true);
        toast.loading("Submitting answers...");

        try {
            const answersMap: Record<string, string> = {};
            questions.forEach((q) => {
                if (q.answer) {
                    answersMap[q.id] = q.answer;
                }
            });

            // ✅ Send API request
            await SubmitExam({
                examRollNo: examData.examRollNo,
                answers: answersMap,
            });

            toast.dismiss();
            toast.success("✅ Exam Submitted Successfully!");
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to submit exam!");
            console.error("Submit exam error:", err);
        }
    }, [examData, isSubmitted, questions]);





    const formattedTime = useTimer(isSubmitted, handleSubmit);

    const logViolation: LogViolation = useCallback(
        (type, msg) => {
            if (isSubmitted || warningCount >= MAX_WARNINGS) return;
            const v = { type, message: msg, timestamp: new Date().toLocaleTimeString() };
            setViolations((p) => [...p, v]);
            setWarningCount((prev) => {
                const newCount = prev + 1;
                if (newCount >= MAX_WARNINGS) {
                    toast.error("🚨 Too many violations! Exam auto-submitted.");
                    handleSubmit();
                }
                return newCount;
            });
        },
        [isSubmitted, warningCount, handleSubmit]
    );

    useEffect(() => {
        document.documentElement.requestFullscreen().catch(() => { });
        const handleFullScreen = () => {
            if (!document.fullscreenElement) {
                logViolation("Fullscreen Exit", "Exited fullscreen mode.");
                document.documentElement.requestFullscreen().catch(() => { });
            }
        };
        document.addEventListener("fullscreenchange", handleFullScreen);
        return () => document.removeEventListener("fullscreenchange", handleFullScreen);
    }, [logViolation]);

    const handleAnswerSelect = (value: string) => {
        if (isSubmitted) return;
        const updated = questions.map((q, i) =>
            i === currentIndex ? { ...q, answer: value } : q
        );
        setQuestions(updated);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
    };

    if (!examData) {
        return (
            <>
                <Toaster />
                <ExamVerificationModal onExamStart={handleExamStart} />
            </>
        );
    }

    const q = questions[currentIndex];

    if (isSubmitted) {
        const attempted = questions.filter((q) => q.answer).length;
        const unattempted = questions.length - attempted;
        return (
            <div className="flex items-center justify-center h-screen bg-green-50">
                <Toaster />
                <div className="p-8 bg-white rounded-lg shadow-lg text-center border-t-8 border-green-500">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">✅ Exam Submitted</h2>
                    <p className="text-gray-700 mb-4">
                        {examData.candidateName} ({examData.examRollNo})
                    </p>
                    <p>Attempted: {attempted}</p>
                    <p>Unattempted: {unattempted}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Toaster />
            <div className="w-80 bg-gray-100 p-4 border-r flex flex-col">
                <div className="p-3 bg-white rounded shadow mb-4">
                    <h3 className="font-semibold">Student Info</h3>
                    <p>Name: {examData.candidateName}</p>
                    <p>Roll No: {examData.examRollNo}</p>
                </div>

                <div className="bg-white p-3 rounded shadow flex flex-col items-center mb-4">
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        height={200}
                        width={260}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        className="border-2 border-red-500 rounded"
                    />
                    <FaceDetector webcamRef={webcamRef} logViolation={logViolation} />
                </div>

                <div className="bg-red-100 border border-red-500 rounded p-2 text-xs">
                    <strong>Violations:</strong> {warningCount}/{MAX_WARNINGS}
                    {violations.slice(-3).map((v, i) => (
                        <p key={i}>[{v.timestamp}] {v.type}</p>
                    ))}
                </div>

                <div className="mt-auto bg-white p-4 rounded shadow text-center">
                    <p className="text-xl font-bold text-blue-700 mb-2">⏱ {formattedTime}</p>
                    <button
                        onClick={() =>
                            window.confirm("Submit exam?") && handleSubmit()
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                    >
                        Submit
                    </button>
                </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    Question {currentIndex + 1} / {questions.length}
                </h2>
                <p className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded mb-4">
                    {q.questionText}
                </p>
                {["A", "B", "C", "D"].map((opt) => {
                    const optionText = q[`option${opt as "A" | "B" | "C" | "D"}`];
                    return (
                        <div
                            key={opt}
                            onClick={() => handleAnswerSelect(opt)}
                            className={`p-3 mb-2 rounded border cursor-pointer ${q.answer === opt
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:bg-blue-50"
                                }`}
                        >
                            <strong>{opt}.</strong> {optionText}
                        </div>
                    );
                })}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={
                            currentIndex === questions.length - 1
                                ? () => window.confirm("Finish Exam?") && handleSubmit()
                                : handleNext
                        }
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        {currentIndex === questions.length - 1 ? "Finish" : "Next →"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamScreen;
