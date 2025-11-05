"use client";
import { useState, useRef } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface VoiceRecorderProps {
  userId: string;
  name: string;
  phone: string;
  onSend: (message: any) => void;
}

export default function VoiceRecorder({ userId, name, phone, onSend }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    setAudioChunks([]);

    mediaRecorder.ondataavailable = (e) => {
      setAudioChunks((prev) => [...prev, e.data]);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const fileRef = ref(storage, `uploads/${userId}/${Date.now()}.webm`);
      await uploadBytes(fileRef, audioBlob);
      const url = await getDownloadURL(fileRef);

      const newMessage = {
        userId,
        name,
        phone,
        fileUrl: url,
        fileType: "audio",
        fromAdmin: false,
        seen: false,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "messages"), {
        ...newMessage,
        createdAt: serverTimestamp(),
      });

      onSend({ id: docRef.id, ...newMessage });
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`p-2 rounded-full ${recording ? "bg-red-600" : "bg-green-600"} text-white`}
      >
        {recording ? "توقف ضبط" : "ضبط صدا"}
      </button>
    </div>
  );
}
