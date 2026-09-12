import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rootDir = process.cwd();
    let sourceDir = path.join(rootDir, "frames");
    if (!fs.existsSync(sourceDir)) {
      const parentSourceDir = path.join(rootDir, "..", "frames");
      if (fs.existsSync(parentSourceDir)) {
        sourceDir = parentSourceDir;
      }
    }

    const targetDir = path.join(rootDir, "public", "frames");

    // Ensure public/frames directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Sync files from root /frames into public/frames if sourceDir exists
    if (fs.existsSync(sourceDir)) {
      const sourceFiles = fs.readdirSync(sourceDir).filter((f) =>
        /\.(jpe?g|png|webp)$/i.test(f)
      );

      sourceFiles.forEach((file) => {
        const srcPath = path.join(sourceDir, file);
        const destPath = path.join(targetDir, file);
        if (!fs.existsSync(destPath)) {
          try {
            fs.copyFileSync(srcPath, destPath);
          } catch {}
        }
      });
    }

    // Prioritize active hero frame image if present
    const heroImage = "hero-wedding-sunset.jpg";
    if (fs.existsSync(path.join(targetDir, heroImage))) {
      return NextResponse.json({ frames: [`/frames/${heroImage}`] });
    }

    // Read all frame files from public/frames
    let frameFiles: string[] = [];
    if (fs.existsSync(targetDir)) {
      frameFiles = fs
        .readdirSync(targetDir)
        .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
    }

    // Sort numerically (e.g. ezgif-frame-001.jpg, ezgif-frame-002.jpg...)
    frameFiles.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    });

    const framePaths = frameFiles.map((f) => `/frames/${f}`);

    return NextResponse.json({ frames: framePaths });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
