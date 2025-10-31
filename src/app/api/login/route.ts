import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = "beautyland";

interface User {
  id?: string;
  name: string;
  phone: string;
  email: string;
}

export async function POST(req: Request) {
  try {
    const { name, phone, email } = await req.json();

    // ✅ اعتبارسنجی داده‌ها
    if (!name || !phone || !email)
      return new Response(JSON.stringify({ error: "تمام فیلدها الزامی‌اند" }), { status: 400 });

    if (!/^09\d{9}$/.test(phone))
      return new Response(JSON.stringify({ error: "شماره موبایل معتبر نیست" }), { status: 400 });

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      return new Response(JSON.stringify({ error: "ایمیل معتبر نیست" }), { status: 400 });

    await client.connect();
    const db = client.db(dbName);
    const users = db.collection<User>("users");

    // ✅ بررسی کاربر تکراری
    const existing = await users.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify(existing), { status: 200 });
    }

    const newUser: User = { name, phone, email };
    const result = await users.insertOne(newUser);

    return new Response(JSON.stringify({ ...newUser, id: result.insertedId }), { status: 200 });
  } catch (err) {
    console.error("❌ خطا در API:", err);
    return new Response(JSON.stringify({ error: "خطا در ثبت اطلاعات" }), { status: 500 });
  } finally {
    await client.close();
  }
}
