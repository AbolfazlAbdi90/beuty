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
  // لیست کاربران با اطلاعات: userId، name و phone
  const [users, setUsers] = useState<
    { userId: string; name: string; phone: string }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [reply, setReply] = useState("");

  // گرفتن لیست کاربران از پیام‌ها
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({
        ...(doc.data() as MessageType),
        id: doc.id,
      }));

      // ساخت Map برای ذخیره یکتا کاربران با آخرین name و phone ارسال شده
      const usersMap = new Map<string, { name: string; phone: string; createdAt?: any }>();

      allMessages.forEach((msg) => {
        if (msg.userId) {
          // اگر کاربر جدید بود یا اطلاعات جدیدتر داشت، بروز رسانی کن
          if (
            !usersMap.has(msg.userId) ||
            (msg.createdAt?.seconds ?? 0) >
              (usersMap.get(msg.userId)?.createdAt?.seconds ?? 0)
          ) {
            usersMap.set(msg.userId, {
              name: msg.name || "بدون نام",
              phone: msg.phone || "بدون شماره",
              createdAt: msg.createdAt,
            });
          }
        }
      });

      // تبدیل Map به آرایه
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
    <div className="flex h-screen">
      {/* بخش لیست کاربران */}
      <div className="w-1/4 border-r overflow-y-auto p-4">
        <h2 className="font-bold mb-4">کاربران</h2>
        <ul>
          {users.map(({ userId, name, phone }) => (
            <li
              key={userId}
              className={`cursor-pointer p-2 rounded ${
                userId === selectedUserId ? "bg-pink-300" : "hover:bg-pink-100"
              }`}
              onClick={() => setSelectedUserId(userId)}
            >
              <p className="font-semibold">{name}</p>
              <p className="text-xs text-gray-600">{phone}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* بخش نمایش پیام‌ها */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 bg-pink-50 flex flex-col gap-2">
          {selectedUserId ? (
            messages.map((m) => (
              <div
                key={m.id}
                className={`p-2 rounded max-w-[60%] ${
                  m.fromAdmin
                    ? "bg-pink-400 text-white self-end ml-auto"
                    : "bg-white text-gray-800"
                }`}
              >
                {m.text && <p>{m.text}</p>}
                {m.fileType === "audio" && (
                  <audio src={m.fileUrl} controls className="w-full mt-1" />
                )}
                <p className="text-xs text-gray-600 mt-1">
                  {m.fromAdmin ? "ادمین" : m.name} -{" "}
                  {m.createdAt?.toDate
                    ? m.createdAt.toDate().toLocaleString("fa-IR")
                    : new Date(m.createdAt).toLocaleString("fa-IR")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">یک کاربر انتخاب کنید</p>
          )}
        </div>

        {/* ارسال پاسخ */}
        {selectedUserId && (
          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
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
              className="bg-pink-500 text-white px-4 rounded"
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
