import connectDB from "@/src/database/db";
import Blog from "@/src/database/blogSchema";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    const body = await req.json();
    const { user, comment } = body;

    if (!user || !comment || typeof user != "string" || typeof comment != "string"){
        return NextResponse.json(
            { error: "Invalid body of comment" },
            { status: 400 }
        );
    }

    await connectDB();
    console.log("Connected DB:", Blog.db.name);
    console.log("Looking for slug:", slug);

    const allBlogs = await Blog.find({}, "slug title").lean();
    console.log("All blog slugs:", allBlogs);

	const newComment = {
        user,
        comment,
        time: new Date(),
    };

    const updatedBlog = await Blog.findOneAndUpdate(
        { slug: slug },
        { $push: { comments: newComment } },
        { new: true }
    );

    if (!updatedBlog) {
        return NextResponse.json(
            { error: "Blog not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(updatedBlog, { status: 200 });


}