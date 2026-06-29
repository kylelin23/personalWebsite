import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/database/db";
import blogSchema from "@/src/database/blogSchema";

type IParams = {
  params: {
    slug: string;
  };
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  await connectDB();

  try {
    const blog = await blogSchema.findOne({ slug }).orFail();
    console.log("API blog:", JSON.stringify(blog, null, 2));
    return NextResponse.json(blog);
  } catch (err) {
    return NextResponse.json("Blog not found.", { status: 404 });
  }
}
