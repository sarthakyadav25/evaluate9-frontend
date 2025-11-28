"use client";

import { useEffect, useRef, useState } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";

export function useFaceDetection(
    webcamRef: React.RefObject<Webcam | null>, 
    onViolation: (type: "NO_FACE" | "MULTIPLE_FACES") => void,
    isActive: boolean
) {
    const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 1. Load Model Once
    useEffect(() => {
        const loadModel = async () => {
            await tf.ready();
            const loadedModel = await blazeface.load();
            setModel(loadedModel);
            console.log("Creating Proctoring Model...");
        };
        loadModel();
    }, []);

    // 2. Detection Loop
    useEffect(() => {
        if (!isActive || !model || !webcamRef.current || !webcamRef.current.video) return;

        const detect = async () => {
            const video = webcamRef.current?.video;
            if (video && video.readyState === 4) {
                // Estimate faces (returnTensors: false)
                const predictions = await model.estimateFaces(video, false);

                if (predictions.length === 0) {
                    onViolation("NO_FACE");
                } else if (predictions.length > 1) {
                    onViolation("MULTIPLE_FACES");
                }
            }
        };

        // Check every 3 seconds to balance performance/security
        intervalRef.current = setInterval(detect, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, model, webcamRef, onViolation]);
}