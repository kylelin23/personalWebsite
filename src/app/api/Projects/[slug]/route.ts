import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/database/db";
import projectSchema from "@/src/database/projectSchema";

type IParams = {
  slug: string;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<IParams> },
) {
  await connectDB();
  const { slug } = await context.params;

  try {
    const project = await projectSchema.findOne({ slug }).orFail();
    return NextResponse.json(project);
  } catch (err) {
    return NextResponse.json("Project not found.", { status: 404 });
  }
}
