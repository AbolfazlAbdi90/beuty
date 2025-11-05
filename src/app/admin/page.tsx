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
  id: string;
  userId: string;
  text?: string;
  fromAdmin?: boolean;
  createdAt?: any;
  name?: string;
  phone?: string;
  fileType?: string;
  fileUrl?: string;
};

type UserType = {
  userId: string;
  name: string;
  phone: string;
};

export default function AdminPanel() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [reply, setReply] = useState("");

  // دریافت لیست کاربران (بر اساس آخرین پیام هر کاربر)
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersMap = new Map<
        string,
        { name: string; phone: string; createdAt: any }
      >();

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as MessageType;
        if (!data.userId) return;

        // اگر این کاربر در مپ نیست یا این پیام جدیدتر است، اطلاعات را ذخیره کن
        if (
          !usersMap.has(data.userId) ||
          (data.createdAt?.seconds ?? 0) >
            (usersMap.get(data.userId)?.createdAt?.seconds ?? 0)
        ) {
          usersMap.set(data.userId, {
            name: data.name || "بدون نام",
            phone: data.phone || "بدون شماره",
            createdAt: data.createdAt,
          });
        }
      });

      const usersList: UserType[] = Array.from(usersMap.entries()).map(
        ([userId, { name, phone }]) => ({
          userId,
          name,
          phone,
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
        id: doc.id,
        ...(doc.data() as MessageType),
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

  // تبدیل timestamp به تاریخ خوانا
  const formatDate = (createdAt: any) => {
    if (!createdAt) return "";
    if (createdAt.toDate) return createdAt.toDate().toLocaleString("fa-IR");
    if (createdAt.seconds) return new Date(createdAt.seconds * 1000).toLocaleString("fa-IR");
    return new Date(createdAt).toLocaleString("fa-IR");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* لیست کاربران */}
      <div className="w-1/4 border-r overflow-y-auto p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-6 text-pink-600">کاربران</h2>
        <ul>
          {users.length === 0 && (
            <li className="text-gray-400">کاربری یافت نشد</li>
          )}
          {users.map(({ userId, name, phone }) => (
            <li
              key={userId}
              onClick={() => setSelectedUserId(userId)}
              className={`cursor-pointer p-3 mb-2 rounded-md transition-colors ${
                userId === selectedUserId
                  ? "bg-pink-400 text-white"
                  : "hover:bg-pink-100"
              }`}
            >
              <p className="font-semibold truncate">{name}</p>
              <p className="text-xs text-pink-700 truncate">{phone}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* بخش پیام‌ها */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 bg-pink-50 flex flex-col gap-4">
          {!selectedUserId && (
            <p className="text-gray-500 mt-10 text-center">یک کاربر انتخاب کنید</p>
          )}

          {selectedUserId && messages.length === 0 && (
            <p className="text-gray-500 mt-10 text-center">پیامی برای این کاربر وجود ندارد</p>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-lg max-w-[60%] shadow-sm ${
                m.fromAdmin
                  ? "bg-pink-500 text-white self-end ml-auto"
                  : "bg-white text-gray-800"
              }`}
            >
              {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}
              {m.fileType === "audio" && (
                <audio src={m.fileUrl} controls className="w-full mt-2" />
              )}
              <p className="text-xs mt-2 opacity-70">
                {m.fromAdmin ? "ادمین" : m.name} - {formatDate(m.createdAt)}
              </p>
            </div>
          ))}
        </div>

        {/* فرم ارسال پاسخ */}
        {selectedUserId && (
          <div className="p-6 border-t bg-white flex gap-3">
            <input
              type="text"
              placeholder="پاسخ خود را بنویسید"
              className="flex-1 p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
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
              onClick={handleSendReply}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 rounded-lg transition-colors"
            >
              ارسال
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
