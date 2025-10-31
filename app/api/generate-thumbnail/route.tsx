import { db } from "@/configs/db";
import { AIThumbnailTable } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/** Helper to convert a File to base64 */
const getFileBufferData = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    buffer: buffer.toString("base64"),
  };
};

/** POST: Generate a new thumbnail via Inngest */
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "User not authenticated or missing email" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const refImage = formData.get("refImage") as File | null;
    const faceImage = formData.get("faceImage") as File | null;
    const userInput = formData.get("userInput");

    const inputData = {
      userInput,
      refImage: refImage ? await getFileBufferData(refImage) : null,
      faceImage: faceImage ? await getFileBufferData(faceImage) : null,
      userEmail: user.primaryEmailAddress.emailAddress,
    };

    // Trigger Inngest function
    const result = await inngest.send({
      name: "ai/generate-thumbnail",
      data: inputData,
    });

    return NextResponse.json({ runId: result.ids[0] || null });
  } catch (error: any) {
    console.error("Error in /api/generate-thumbnail POST:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}

/** GET: Fetch existing thumbnails for the current user */
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "User not authenticated or missing email" },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const result = await db
      .select()
      .from(AIThumbnailTable)
      .where(eq(AIThumbnailTable.userEmail, userEmail)) // ✅ TypeScript-safe
      .orderBy(desc(AIThumbnailTable.id));

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/generate-thumbnail GET:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch thumbnails" },
      { status: 500 }
    );
  }
}
