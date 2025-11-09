import React, { useState } from "react";
import toast from "react-hot-toast";
import { CreateExam } from "../services/apiHelpers";
import type { ConductExamResponse } from "../types/exam";
import axios  from "axios";


interface Props {
  onExamStart: (examData: ConductExamResponse) => void;
}

const ExamVerificationModal: React.FC<Props> = ({ onExamStart }) => {
  const [candidateName, setCandidateName] = useState("");
  const [examRollNo, setExamRollNo] = useState("");
  const [loading, setLoading] = useState(false);

//   const handleStartExam = async () => {
//     if (!candidateName || !examRollNo) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       toast.loading("Verifying student details...");

//       // ✅ Call your API helper
//       const res = await CreateExam(candidateName, examRollNo);
       
//         toast.success("Verification successful! Exam is starting...");
//         toast.dismiss();

//       onExamStart(res.data);
//     } catch (err) {
//       toast.dismiss();
//     //   toast.error()
//      if(err === 'You have already completed the exam. Multiple attempts are not allowed'){
//             toast.error('You have already completed the exam. Multiple attempts are not allowed')
//         }else{
//             toast.error("Invalid details or server error!");
//         }
//     } finally {
//       setLoading(false);
//     }
//   };




const handleStartExam = async () => {
  if (!candidateName || !examRollNo) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);
    toast.loading("Verifying student details...");

    // ✅ Call API
    const res = await CreateExam(candidateName, examRollNo);

    // ✅ Handle “already completed” response
    if (
      res?.data?.message &&
      res.data.message.includes("already completed the exam")
    ) {
      toast.dismiss();
      toast.error("❌ You have already completed the exam. Multiple attempts are not allowed.");
      setLoading(false);
      return;
    }

    // ✅ Success flow
    toast.dismiss();
    toast.success("Verification successful! Exam is starting...");
    onExamStart(res.data);

  } catch (error: unknown) {
    toast.dismiss();

    // ✅ Handle AxiosError safely
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid details or server error!";

      if (message.includes("already completed the exam")) {
        toast.error("❌ You have already completed the exam. Multiple attempts are not allowed.");
      } else {
        toast.error(message);
      }
    } else {
      // Non-Axios error fallback
      toast.error("Unexpected error occurred!");
    }

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Student Verification
        </h2>

        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          className="border p-2 w-full rounded mb-3"
        />
        <input
          type="text"
          placeholder="Exam Roll Number"
          value={examRollNo}
          onChange={(e) => setExamRollNo(e.target.value)}
          className="border p-2 w-full rounded mb-4"
        />

        <button
          disabled={loading}
          onClick={handleStartExam}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded font-semibold"
        >
          {loading ? "Verifying..." : "Start Exam"}
        </button>
      </div>
    </div>
  );
};

export default ExamVerificationModal;
