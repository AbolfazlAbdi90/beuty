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
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminPanel() {
  // لیست کاربران با اطلاعات: userId، name و phone
  const [users, setUsers] = useState<
    { userId: string; name: string; phone: string }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");

  // گرفتن لیست کاربران از پیام‌ها
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((d) => d.data() as any);

      // ساخت Map برای ذخیره یکتا کاربران با آخرین name و phone ارسال شده
      const usersMap = new Map<string, { name: string; phone: string }>();

      allMessages.forEach((msg) => {
        if (msg.userId) {
          if (
            !usersMap.has(msg.userId) ||
            (msg.createdAt?.seconds ?? 0) >
              (usersMap.get(msg.userId)?.createdAt?.seconds ?? 0)
          ) {
            usersMap.set(msg.userId, {
              name: msg.name || "بدون نام",
              phone: msg.phone || "بدون شماره",
            });
          }
        }
      });

      const usersList = Array.from(usersMap.entries()).map(
        ([userId, data]) => ({
          userId,
          name: data.name,
          phone: data.phone,
        })
      );

      setUsers(usersList);
    });

    return unsubscribe;
  }, []);

  // دریافت پیام‌های کاربر انتخاب شده
  useEffect(() => {
    if (!selectedUserId) return;
    const q = query(
      collection(db, "messages"),
      where("userId", "==", selectedUserId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
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
    <div className="flex h-screen bg-gray-50">
      {/* بخش لیست کاربران */}
      <div className="w-1/4 border-r border-gray-300 overflow-y-auto p-6 bg-white shadow-md">
        <h2 className="font-extrabold text-xl mb-6 text-pink-600 border-b pb-2">
          کاربران
        </h2>
        <ul>
          {users.map(({ userId, name, phone }) => (
            <li
              key={userId}
              className={`cursor-pointer p-3 mb-2 rounded-lg transition-colors duration-200 flex flex-col ${
                userId === selectedUserId
                  ? "bg-pink-200 shadow-inner"
                  : "hover:bg-pink-100"
              }`}
              onClick={() => setSelectedUserId(userId)}
            >
              <p className="font-semibold text-gray-900 text-base">{name}</p>
              <p className="text-xs text-gray-500 mt-1">{phone}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* بخش نمایش پیام‌ها */}
      <div className="flex-1 flex flex-col bg-white shadow-md">
        <div className="flex-1 overflow-y-auto p-6 bg-pink-50 flex flex-col gap-3">
          {selectedUserId ? (
            messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-lg max-w-[60%] break-words shadow-sm ${
                  m.fromAdmin
                    ? "bg-pink-500 text-white self-end ml-auto"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {m.text && <p className="whitespace-pre-line">{m.text}</p>}
                {m.fileType === "audio" && (
                  <audio src={m.fileUrl} controls className="w-full mt-2 rounded" />
                )}
                <p className="text-xs text-gray-600 mt-2 text-left">
                  {m.fromAdmin ? "ادمین" : m.name} -{" "}
                  {m.createdAt?.toDate
                    ? m.createdAt.toDate().toLocaleString("fa-IR")
                    : new Date(m.createdAt).toLocaleString("fa-IR")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center mt-20 select-none text-lg">
              یک کاربر انتخاب کنید
            </p>
          )}
        </div>

        {/* ارسال پاسخ */}
        {selectedUserId && (
          <div className="p-5 border-t border-gray-300 flex gap-3 bg-white">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              placeholder="پاسخ خود را بنویسید"
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
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 rounded-lg shadow-md transition"
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
