// src/components/exam/FaceDetector.tsx
import React, { useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import toast from "react-hot-toast";

interface Props {
  webcamRef: React.RefObject<Webcam | null>;
  onViolation: (type: string, msg: string) => void;
}

const FaceDetector: React.FC<Props> = ({ webcamRef, onViolation }) => {
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const [status, setStatus] = useState("Loading AI Model...");
  const [faces, setFaces] = useState(0);

  useEffect(() => {
    const load = async () => {
      await tf.setBackend("webgl");
      const loaded = await blazeface.load();
      setModel(loaded);
      setStatus("Face Detection Active");
    };
    load();
  }, []);

  const detect = useCallback(async () => {
    const video = webcamRef.current?.video;
    if (!video || video.readyState !== 4 || !model) return;

    const predictions = await model.estimateFaces(video, false);
    setFaces(predictions.length);

    if (predictions.length === 0) {
      onViolation("Face Missing", "Face not detected.");
      toast.error("🔴 Face Not Visible!");
    } else if (predictions.length > 1) {
      onViolation("Multiple Faces", `${predictions.length} faces detected.`);
      toast.error("🚨 Multiple Faces Detected!");
    }
  }, [model, webcamRef, onViolation]);

  useEffect(() => {
    const i = model ? setInterval(detect, 1000) : null;
    return () => {
      if (i) clearInterval(i);
    };
  }, [model, detect]);

  return (
    <div className="text-center mt-2 text-[10px]">
      <p className="font-semibold text-green-600">{status}</p>
      <p className="text-gray-500">Detected Faces: {faces}</p>
    </div>
  );
};

export default FaceDetector;
