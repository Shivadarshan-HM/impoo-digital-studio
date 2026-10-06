import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rootDir = process.cwd();
    const targetDir = path.join(rootDir, "public", "selected_video_frames_24fps_png");

    // Read all frame files from public/selected_video_frames_24fps_png
    let frameFiles: string[] = [];
    if (fs.existsSync(targetDir)) {
      frameFiles = fs
        .readdirSync(targetDir)
        .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
    }

    // Sort numerically (e.g. frame_0001.png, frame_0002.png...)
    frameFiles.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    });

    let framePaths = frameFiles.map((f) => `/selected_video_frames_24fps_png/${f}`);

    // Fallback if no frames found
    if (framePaths.length === 0) {
      const fallbackDir = path.join(rootDir, "public", "frames");
      if (fs.existsSync(fallbackDir)) {
        const fallbackFiles = fs.readdirSync(fallbackDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
        fallbackFiles.sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
          const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
          return numA - numB;
        });
        framePaths = fallbackFiles.map((f) => `/frames/${f}`);
      }
    }

    return NextResponse.json({ frames: framePaths });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
