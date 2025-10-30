import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

// خواندن کاربران
const readUsers = async (): Promise<User[]> => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
};

// نوشتن کاربران
const writeUsers = async (users: User[]) => {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf8");
};

export async function POST(req: Request) {
  try {
    const { name, phone, email } = await req.json();
    if (!name || !phone || !email) return new Response(JSON.stringify({ error: "تمام فیلدها الزامی‌اند" }), { status: 400 });

    const users = await readUsers();
    const id = Date.now().toString();
    const newUser: User = { id, name, phone, email };

    users.push(newUser);
    await writeUsers(users);

    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "خطا در ثبت اطلاعات" }), { status: 500 });
  }
}
