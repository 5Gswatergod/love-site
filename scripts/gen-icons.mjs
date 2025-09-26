// scripts/gen-icons.mjs
import sharp from "sharp";
import fs from "node:fs/promises";

const SRC = "public/assets/img/purple-cat.png";
const OUT = "public";

const sizesPng = [16, 32, 48, 64, 180, 192, 256, 384, 512];

await fs.mkdir(`${OUT}/icons`, { recursive: true });

for (const s of sizesPng) {
  await sharp(SRC)
    .resize(s, s, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(`${OUT}/icons/icon-${s}.png`);
  console.log(`✓ icon-${s}.png`);
}

// 產生 favicon.ico（多尺寸）
await sharp(SRC)
  .resize(256, 256, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer()
  .then((buf) =>
    sharp({
      create: {
        width: 256,
        height: 256,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: buf }])
      .toFormat("ico", { sizes: [16, 32, 48] })
      .toFile(`${OUT}/favicon.ico`)
  );

console.log("✓ favicon.ico");

// 產生 maskable（Android 圓形/自適應）
await sharp(SRC)
  .resize(512, 512, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(`${OUT}/icons/maskable-512.png`);

console.log("✓ maskable-512.png");
console.log("Done.");
