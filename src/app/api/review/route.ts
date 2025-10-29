import { NextRequest, NextResponse } from "next/server";

interface Review {
  id: string;
  productId: number;
  userId: string;
  name: string;
  text: string;
  createdAt: string;
  likes: string[];
  replies: Review[];
}

// ذخیره‌سازی موقت (می‌تونی بعداً DB بزاری)
let reviews: Review[] = [];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");

  if (!productId) return NextResponse.json([], { status: 200 });

  const productReviews = reviews.filter(r => r.productId.toString() === productId);
  return NextResponse.json(productReviews);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, userId, name, text, parentId } = body;

    if (!productId || !userId || !name || !text)
      return NextResponse.json({ error: "فیلدها ناقص است" }, { status: 400 });

    const newReview: Review = {
      id: crypto.randomUUID(),
      productId,
      userId,
      name,
      text,
      createdAt: new Date().toISOString(),
      likes: [],
      replies: [],
    };

    if (parentId) {
      reviews = reviews.map(r =>
        r.id === parentId ? { ...r, replies: [newReview, ...r.replies] } : r
      );
    } else {
      reviews = [newReview, ...reviews];
    }

    return NextResponse.json(newReview, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطا در ثبت نظر" }, { status: 500 });
  }
}

// برای لایک و آنلایک
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, userId, parentId } = body;

    reviews = reviews.map(r => {
      if (parentId && r.id === parentId) {
        return {
          ...r,
          replies: r.replies.map(rep =>
            rep.id === id
              ? {
                  ...rep,
                  likes: rep.likes.includes(userId)
                    ? rep.likes.filter(u => u !== userId)
                    : [...rep.likes, userId],
                }
              : rep
          ),
        };
      } else if (!parentId && r.id === id) {
        return {
          ...r,
          likes: r.likes.includes(userId)
            ? r.likes.filter(u => u !== userId)
            : [...r.likes, userId],
        };
      }
      return r;
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطا در لایک" }, { status: 500 });
  }
}
