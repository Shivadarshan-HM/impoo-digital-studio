/**
 * convert-frames-to-webp.mjs
 * 
 * Converts 1920×1080 PNG frames → 1280×720 WebP at quality 75.
 * Input:  public/selected_video_frames_24fps_png/frame_NNNN.png  (240 files)
 * Output: public/frames-webp/frame_NNNN.webp
 *
 * Usage: node scripts/convert-frames-to-webp.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const INPUT_DIR = path.join(ROOT, "public", "selected_video_frames_24fps_png");
const OUTPUT_DIR = path.join(ROOT, "public", "frames-webp");
const WIDTH = 1280;
const HEIGHT = 720;
const QUALITY = 75;
const CONCURRENCY = 8;

async function main() {
  // Dynamic import so we resolve sharp from next's dependency tree
  const sharp = (await import("sharp")).default;

  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ Input directory not found: ${INPUT_DIR}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(INPUT_DIR)
    .filter((f) => /\.(png|jpe?g)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    });

  console.log(`📁 Input:  ${INPUT_DIR}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`🖼  Frames: ${files.length}`);
  console.log(`📐 Target: ${WIDTH}×${HEIGHT} WebP @ Q${QUALITY}`);
  console.log(`⚡ Concurrency: ${CONCURRENCY}\n`);

  let totalInputBytes = 0;
  let totalOutputBytes = 0;
  let processed = 0;

  // Process in batches
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (file) => {
        const inputPath = path.join(INPUT_DIR, file);
        const baseName = path.parse(file).name;
        const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`);

        const inputStat = fs.statSync(inputPath);
        totalInputBytes += inputStat.size;

        await sharp(inputPath)
          .resize(WIDTH, HEIGHT, { fit: "cover" })
          .webp({ quality: QUALITY })
          .toFile(outputPath);

        const outputStat = fs.statSync(outputPath);
        totalOutputBytes += outputStat.size;
        processed++;

        const reduction = ((1 - outputStat.size / inputStat.size) * 100).toFixed(1);
        process.stdout.write(
          `\r  [${processed}/${files.length}] ${file} → ${baseName}.webp  (${(inputStat.size / 1024).toFixed(0)} KB → ${(outputStat.size / 1024).toFixed(0)} KB, -${reduction}%)`
        );
      })
    );
  }

  console.log("\n");
  console.log("═══════════════════════════════════════════");
  console.log("  CONVERSION COMPLETE");
  console.log("═══════════════════════════════════════════");
  console.log(`  Frames converted: ${processed}`);
  console.log(`  Total input:      ${(totalInputBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Total output:     ${(totalOutputBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Reduction:        ${((1 - totalOutputBytes / totalInputBytes) * 100).toFixed(1)}%`);
  console.log(`  Avg frame size:   ${(totalOutputBytes / processed / 1024).toFixed(1)} KB`);
  console.log("═══════════════════════════════════════════");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
