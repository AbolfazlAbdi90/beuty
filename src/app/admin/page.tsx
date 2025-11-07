"use client";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type MessageType = {
  id?: string;
  userId: string;
  name: string;
  phone: string;
  text?: string;
  fromAdmin?: boolean;
  seen?: boolean;
  createdAt?: any;
  fileType?: string;
  fileUrl?: string;
};

export default function AdminPanel() {
  const [users, setUsers] = useState<
    { userId: string; name: string; phone: string; unseenCount: number }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [reply, setReply] = useState("");

  // گرفتن لیست کاربران و نوتیف‌ها
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({
        ...(doc.data() as MessageType),
        id: doc.id,
      }));

      const usersMap = new Map<
        string,
        { name: string; phone: string; unseenCount: number; createdAt?: any }
      >();

      allMessages.forEach((msg) => {
        if (msg.userId) {
          const prev = usersMap.get(msg.userId);
          const unseen = msg.fromAdmin ? 0 : msg.seen ? 0 : 1;
          usersMap.set(msg.userId, {
            name: msg.name || prev?.name || "بدون نام",
            phone: msg.phone || prev?.phone || "بدون شماره",
            createdAt: msg.createdAt,
            unseenCount: (prev?.unseenCount || 0) + unseen,
          });
        }
      });

      const usersList = Array.from(usersMap.entries()).map(([userId, data]) => ({
        userId,
        name: data.name,
        phone: data.phone,
        unseenCount: data.unseenCount,
      }));

      setUsers(usersList);
    });

    return unsubscribe;
  }, []);

  // وقتی کاربر انتخاب می‌شود → پیام‌ها دیده می‌شوند
  useEffect(() => {
    if (!selectedUserId) return;

    const markSeen = async () => {
      const q = query(
        collection(db, "messages"),
        where("userId", "==", selectedUserId),
        where("fromAdmin", "==", false),
        where("seen", "==", false)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(async (d) => {
        await updateDoc(doc(db, "messages", d.id), { seen: true });
      });
    };

    markSeen();
  }, [selectedUserId]);

  // دریافت پیام‌های کاربر انتخاب شده
  useEffect(() => {
    if (!selectedUserId) return;
    const q = query(
      collection(db, "messages"),
      where("userId", "==", selectedUserId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: MessageType[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as MessageType),
        id: doc.id,
      }));
      setMessages(msgs);
    });

    return unsubscribe;
  }, [selectedUserId]);

  // ارسال پاسخ ادمین
  const handleSendReply = async () => {
    if (!selectedUserId || !reply.trim()) return;

    await addDoc(collection(db, "messages"), {
      userId: selectedUserId,
      text: reply,
      fromAdmin: true,
      seen: false,
      createdAt: serverTimestamp(),
      name: "ادمین",
      phone: "0000000000",
    });

    setReply("");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-pink-50 to-white">
      {/* لیست کاربران */}
      <div className="md:w-1/4 w-full border-r bg-white p-4 shadow-md overflow-y-auto">
        <h2 className="font-bold text-lg mb-4 text-pink-600 text-center md:text-right">
          کاربران
        </h2>
        <ul className="space-y-2">
          {users.map(({ userId, name, phone, unseenCount }) => (
            <li
              key={userId}
              className={`relative cursor-pointer p-3 rounded-xl border transition-all flex justify-between items-center ${
                userId === selectedUserId
                  ? "bg-pink-200 border-pink-400"
                  : "hover:bg-pink-100"
              }`}
              onClick={() => setSelectedUserId(userId)}
            >
              <div>
                <p className="font-semibold text-gray-800">{name}</p>
                <p className="text-xs text-gray-500">{phone}</p>
              </div>
              {unseenCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unseenCount}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* بخش پیام‌ها */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-pink-50 to-pink-100 flex flex-col gap-3 rounded-t-xl">
          {selectedUserId ? (
            messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-2xl shadow-sm max-w-[80%] sm:max-w-[70%] md:max-w-[60%] break-words ${
                  m.fromAdmin
                    ? "bg-pink-500 text-white self-end ml-auto"
                    : "bg-white text-gray-800"
                }`}
              >
                {m.text && <p className="leading-relaxed">{m.text}</p>}
                {m.fileType === "audio" && (
                  <audio src={m.fileUrl} controls className="w-full mt-2" />
                )}
                <p className="text-xs text-gray-200 md:text-gray-600 mt-1">
                  {m.fromAdmin ? "ادمین" : m.name} -{" "}
                  {m.createdAt?.toDate
                    ? m.createdAt.toDate().toLocaleString("fa-IR")
                    : new Date(m.createdAt).toLocaleString("fa-IR")}
                </p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>👈 یک کاربر را برای مشاهده پیام‌ها انتخاب کنید</p>
            </div>
          )}
        </div>

        {/* ارسال پیام */}
        {selectedUserId && (
          <div className="p-3 md:p-4 border-t bg-white flex flex-col sm:flex-row gap-2 items-center">
            <input
              type="text"
              className="flex-1 p-2 sm:p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-pink-400 outline-none"
              placeholder="پاسخ خود را بنویسید..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
            />
            <button
              className="bg-pink-500 hover:bg-pink-600 transition text-white px-6 py-2 rounded-xl font-medium shadow-md w-full sm:w-auto"
              onClick={handleSendReply}
            >
              ارسال
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
