import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "reviews.json");

export interface Review {
  id: string;
  productId: number;
  userId: string;
  name: string;
  text: string;
  parentId: string | null;
  createdAt: string;
  likes: string[];
  replies: Review[];
}

// خواندن نظرات
const readReviews = async (): Promise<Review[]> => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
};

// نوشتن نظرات
const writeReviews = async (reviews: Review[]): Promise<void> => {
  await fs.writeFile(filePath, JSON.stringify(reviews, null, 2), "utf8");
};

// حذف بازگشتی
const deleteRecursive = (reviews: Review[], id: string): Review[] => {
  return reviews
    .filter(r => r.id !== id)
    .map(r => ({
      ...r,
      replies: r.replies ? deleteRecursive(r.replies, id) : [],
    }));
};

// لایک بازگشتی
const likeRecursive = (reviews: Review[], id: string, userId: string): Review[] => {
  return reviews.map(r => {
    if (r.id === id) {
      if (!r.likes.includes(userId)) r.likes.push(userId);
      else r.likes = r.likes.filter(u => u !== userId);
    }
    return { ...r, replies: r.replies ? likeRecursive(r.replies, id, userId) : [] };
  });
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  const reviews = await readReviews();
  const filtered = productId
    ? reviews.filter(r => r.productId.toString() === productId)
    : reviews;
  return new Response(JSON.stringify(filtered), { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { productId, userId, name, text, parentId } = await req.json();
    if (!productId || !userId || !name || !text) {
      return new Response(JSON.stringify({ error: "تمام فیلدها الزامی‌اند." }), { status: 400 });
    }

    const reviews = await readReviews();

    const newReview: Review = {
      id: Date.now().toString(),
      productId,
      userId,
      name,
      text,
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
      likes: [],
      replies: [],
    };

    if (parentId) {
      const addReply = (arr: Review[]): Review[] =>
        arr.map(r => {
          if (r.id === parentId) {
            return { ...r, replies: [newReview, ...r.replies] };
          }
          return { ...r, replies: addReply(r.replies || []) };
        });
      await writeReviews(addReply(reviews));
    } else {
      reviews.push(newReview);
      await writeReviews(reviews);
    }

    return new Response(JSON.stringify(newReview), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "خطا در ثبت نظر" }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "شناسه لازم است" }), { status: 400 });

  try {
    const reviews = await readReviews();
    const newReviews = deleteRecursive(reviews, id);
    await writeReviews(newReviews);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "خطا در حذف نظر" }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, userId } = await req.json();
    if (!id || !userId) return new Response(JSON.stringify({ error: "شناسه و userId لازم است" }), { status: 400 });

    const reviews = await readReviews();
    const newReviews = likeRecursive(reviews, id, userId);
    await writeReviews(newReviews);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "خطا در لایک" }), { status: 500 });
  }
}
