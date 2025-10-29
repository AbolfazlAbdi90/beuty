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

// ذخیره موقت
let reviews: Review[] = [];

// GET نظرات
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  const productReviews = reviews.filter(r => r.productId === Number(productId));
  return NextResponse.json(productReviews);
}

// POST ثبت نظر یا پاسخ
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, userId, name, text, parentId } = body;

    if (!productId || !userId || !name || !text) {
      return NextResponse.json({ error: "فیلدها ناقص است" }, { status: 400 });
    }

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
    return NextResponse.json({ error: "خطا در ثبت نظر" }, { status: 500 });
  }
}

// DELETE حذف (فقط صاحب نظر)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { reviewId, userId, parentId } = body;

    const target = parentId
      ? reviews.find(r => r.id === parentId)?.replies.find(rep => rep.id === reviewId)
      : reviews.find(r => r.id === reviewId);

    if (!target || target.userId !== userId) {
      return NextResponse.json({ error: "شما اجازه حذف این نظر را ندارید" }, { status: 403 });
    }

    if (parentId) {
      reviews = reviews.map(r =>
        r.id === parentId
          ? { ...r, replies: r.replies.filter(rep => rep.id !== reviewId) }
          : r
      );
    } else {
      reviews = reviews.filter(r => r.id !== reviewId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}

// POST لایک / آنلایک
export async function POST_LIKE(req: NextRequest) {
  try {
    const body = await req.json();
    const { reviewId, userId, parentId } = body;

    let target: Review | undefined;
    if (parentId) {
      const parent = reviews.find(r => r.id === parentId);
      target = parent?.replies.find(rep => rep.id === reviewId);
    } else {
      target = reviews.find(r => r.id === reviewId);
    }

    if (!target) return NextResponse.json({ error: "کامنت پیدا نشد" }, { status: 404 });

    if (target.likes.includes(userId)) {
      target.likes = target.likes.filter(u => u !== userId);
    } else {
      target.likes.push(userId);
    }

    return NextResponse.json(target);
  } catch (err) {
    return NextResponse.json({ error: "خطا در لایک" }, { status: 500 });
  }
}
