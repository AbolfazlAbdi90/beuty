"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { MessageCircle } from "lucide-react";
import ChatBox from "./ChatBox";

export default function ChatButton() {
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("chatUserId");
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, "messages"),
      where("userId", "==", userId),
      where("fromAdmin", "==", true),
      where("seen", "==", false)
    );
    const unsub = onSnapshot(q, (snap) => {
      setHasNew(!snap.empty);
    });
    return unsub;
  }, [userId]);

  return (
    <>
      {open && (
        <ChatBox onClose={() => setOpen(false)} setHasNewMessage={setHasNew} />
      )}
      <button
        onClick={() => {
          setOpen(!open);
          setHasNew(false);
        }}
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full shadow-lg z-50"
        aria-label="باز کردن چت"
      >
        <MessageCircle size={28} />
        {hasNew && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            1
          </span>
        )}
      </button>
    </>
  );
}
