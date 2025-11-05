"use client";
import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase";

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { X, Paperclip } from "lucide-react";
import VoiceRecorder from "./VoiceRecorder";

interface ChatBoxProps {
  onClose: () => void;
  setHasNewMessage?: (v: boolean) => void;
}

export default function ChatBox({ onClose }: ChatBoxProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // بارگذاری userId و پیام‌ها از localStorage در شروع
  useEffect(() => {
    const storedId = localStorage.getItem("chatUserId");
    if (storedId) setUserId(storedId);

    const savedMessages = localStorage.getItem("chatMessages_" + storedId);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // ذخیره پیام‌ها در localStorage هر بار که تغییر کنند
  useEffect(() => {
    if (userId) {
      localStorage.setItem("chatMessages_" + userId, JSON.stringify(messages));
    }
  }, [messages, userId]);

  // دریافت پیام‌ها از Firebase و بروز رسانی state و localStorage
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "messages"),
      where("userId", "==", userId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [userId]);

  // علامت گذاری پیام‌های خوانده نشده از ادمین به عنوان دیده شده
  useEffect(() => {
    const markSeen = async () => {
      if (!userId) return;
      const q = query(
        collection(db, "messages"),
        where("userId", "==", userId),
        where("fromAdmin", "==", true),
        where("seen", "==", false)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(async (d) => {
        await updateDoc(doc(db, "messages", d.id), { seen: true });
      });
    };
    markSeen();
  }, [userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handleSend = async () => {
    if (!userId) return;

    // ارسال پیام متنی
    if (message.trim()) {
      const newMessage = {
        userId,
        name,
        phone,
        text: message,
        fromAdmin: false,
        seen: false,
        createdAt: new Date(),
      };

      // ابتدا پیام به state اضافه میشه برای تجربه بهتر کاربری
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      // سپس به Firebase اضافه میشه
      await addDoc(collection(db, "messages"), {
        ...newMessage,
        createdAt: serverTimestamp(),
      });
    }

    // ارسال فایل (عکس، ویدئو، صوت)
    if (selectedFile) {
      // آپلود فایل به Firebase Storage
      const fileRef = ref(
        storage,
        `uploads/${userId}/${Date.now()}_${selectedFile.name}`
      );
      await uploadBytes(fileRef, selectedFile);
      const url = await getDownloadURL(fileRef);

      let fileType = "file";
      if (selectedFile.type.startsWith("image")) fileType = "image";
      else if (selectedFile.type.startsWith("video")) fileType = "video";
      else if (selectedFile.type.startsWith("audio")) fileType = "audio";

      const newFileMessage = {
        userId,
        name,
        phone,
        fileUrl: url,
        fileType,
        fromAdmin: false,
        seen: false,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, newFileMessage]);

      await addDoc(collection(db, "messages"), {
        ...newFileMessage,
        createdAt: serverTimestamp(),
      });

      setSelectedFile(null);
      setPreviewUrl("");
    }
  };

  const handleStart = () => {
    if (name && phone) {
      const id = `${phone}_${Date.now()}`;
      localStorage.setItem("chatUserId", id);
      setUserId(id);
    }
  };

  // ضبط و ارسال ویس از کامپوننت VoiceRecorder که خودش آپلود و ارسال میکنه
  // فقط اینجا onSend رو میتونی مدیریت کنی یا پیام جدید رو پس از ارسال به state اضافه کنی

  // فرمت نمایش تاریخ و ساعت
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    let date: Date;
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      return "";
    }

    return date.toLocaleString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!userId) {
    return (
      <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-2xl shadow-lg flex flex-col z-50">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-pink-600 font-semibold">شروع گفتگو</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="flex flex-col p-4 gap-3">
          <input
            type="text"
            placeholder="نام شما"
            className="border rounded-lg p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="شماره تلفن"
            className="border rounded-lg p-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg"
            onClick={handleStart}
          >
            شروع گفتگو
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden z-50">
      <div className="flex justify-between items-center bg-pink-500 text-white p-3">
        <div className="flex items-center gap-2">
          <img
            src="/avatar.jpg"
            alt="avatar"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <div>
            <p className="font-semibold">ابوالفضل عبدی</p>
            <p className="text-xs text-pink-100">پاسخگوی سوالات شما</p>
          </div>
        </div>
        <button onClick={onClose}>
          <X />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-pink-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[75%] ${
              m.fromAdmin
                ? "bg-pink-400 text-white self-end ml-auto"
                : "bg-white text-gray-800"
            }`}
          >
            {m.text && <p>{m.text}</p>}
            {m.fileType === "image" && (
              <img src={m.fileUrl} alt="" className="rounded-lg mt-2" />
            )}
            {m.fileType === "video" && (
              <video src={m.fileUrl} controls className="rounded-lg mt-2" />
            )}
            {m.fileType === "audio" && (
              <audio src={m.fileUrl} controls className="mt-2 w-full" />
            )}
            <p className="text-xs text-gray-500 mt-1 text-left">
              {formatDate(m.createdAt)}
            </p>
          </div>
        ))}

 <VoiceRecorder userId={userId} name={name} phone={phone} onSend={(msg) => setMessages((prev) => [...prev, msg])} />


        {selectedFile && (
          <div className="p-2 rounded-lg max-w-[75%] bg-gray-200 text-gray-800">
            <p className="mb-2 font-semibold">پیش‌نمایش فایل انتخاب شده:</p>
            {previewUrl ? (
              selectedFile.type.startsWith("image") ? (
                <img src={previewUrl} alt="preview" className="rounded-lg" />
              ) : selectedFile.type.startsWith("video") ? (
                <video src={previewUrl} controls className="rounded-lg max-h-48" />
              ) : (
                <p>{selectedFile.name}</p>
              )
            ) : (
              <p>{selectedFile.name}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 p-2 border-t">
        <label
          htmlFor="fileInput"
          className="cursor-pointer p-1 rounded-full hover:bg-pink-100"
        >
          <Paperclip />
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*,audio/*"
          />
        </label>

        <input
          type="text"
          placeholder="پیام خود را بنویسید"
          className="flex-1 border rounded-lg p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg"
          onClick={handleSend}
          disabled={!message && !selectedFile}
        >
          ارسال
        </button>
      </div>
    </div>
  );
}
