// src/components/exam/Sidebar.tsx
import React from "react";
import Webcam from "react-webcam";
import FaceDetector from "./FaceDetector";
import Timer from "./Timer";
import type { Violation } from "../types/exam";

interface Props {
  activeSet: string;
  onSetChange: (s: string) => void;
  webcamRef: React.RefObject<Webcam | null>;
  violations: Violation[];
  warningCount: number;
  maxWarnings: number;
  onTimeout: () => void;
  isSubmitted: boolean;
  onSubmit: () => void;
  showSubmit: boolean;
  onViolation: (type: string, msg: string) => void;
}

const Sidebar: React.FC<Props> = ({
  activeSet,
  onSetChange,
  webcamRef,
  violations,
  warningCount,
  maxWarnings,
  onTimeout,
  isSubmitted,
  onSubmit,
  showSubmit,
  onViolation,
}) => (
  <aside className="w-80 bg-gray-100 border-r flex flex-col p-4 space-y-4">
    {/* Set Buttons */}
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2 text-sm">Set: {activeSet}</h3>
      <div className="flex flex-wrap gap-2">
        {["A", "B", "C", "D"].map((s) => (
          <button
            key={s}
            onClick={() => onSetChange(s)}
            className={`px-3 py-1 rounded text-sm ${
              activeSet === s ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>

    {/* Proctoring */}
    <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
      <h4 className="text-red-600 font-semibold text-sm mb-2">Live Proctoring</h4>
      <Webcam
        ref={webcamRef}
        audio={false}
        height={200}
        width={280}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
        className="rounded-md border-2 border-red-500"
      />
      <FaceDetector webcamRef={webcamRef} onViolation={onViolation} />
      <p className="text-[10px] text-red-500 mt-2 text-center">
        DO NOT EXIT THE FRAME
      </p>
    </div>

    {/* Violations */}
    <div className="p-3 bg-red-100 border border-red-500 rounded-lg text-xs">
      <h4 className="font-bold text-red-700 mb-1">
        Violations: {warningCount}/{maxWarnings}
      </h4>
      <div className="space-y-1 max-h-20 overflow-y-auto">
        {violations.slice(-5).map((v, i) => (
          <p key={i} className="text-red-600 truncate" title={v.message}>
            [{v.timestamp}] {v.type}
          </p>
        ))}
      </div>
    </div>

    {/* Timer + Submit */}
    <div className="mt-auto bg-white p-4 rounded-lg shadow text-center">
      <Timer isSubmitted={isSubmitted} onTimeout={onTimeout} />
      {showSubmit && (
        <button
          onClick={onSubmit}
          className="mt-4 w-full py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 text-sm"
        >
          Submit Answers
        </button>
      )}
    </div>
  </aside>
);

export default Sidebar;
