import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  
  if (!segments || segments.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", ...segments);
  
  if (!existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const fileBuffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    const contentType: Record<string, string> = {
      ".webp": "image/webp",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
    };
    
    const ct = contentType[ext] || "application/octet-stream";
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": ct,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Error reading file", { status: 500 });
  }
}
