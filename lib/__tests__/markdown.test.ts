import fs from "fs";
import path from "path";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { markdownToHtml } from "../markdown";

const TEST_SLUG = "test-inline-image";
const TEST_IMAGE_DIR = path.join(
  process.cwd(),
  "public/images/posts",
  TEST_SLUG
);
const TEST_IMAGE_PATH = path.join(TEST_IMAGE_DIR, "pixel.png");
const ONE_BY_ONE_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

describe("markdownToHtml image optimization", () => {
  beforeAll(() => {
    fs.mkdirSync(TEST_IMAGE_DIR, { recursive: true });
    fs.writeFileSync(
      TEST_IMAGE_PATH,
      Buffer.from(ONE_BY_ONE_PNG_BASE64, "base64")
    );
  });

  afterAll(() => {
    fs.rmSync(TEST_IMAGE_DIR, { recursive: true, force: true });
  });

  it("applies lazy loading, dimensions and slug-aware paths to inline images", async () => {
    const html = await markdownToHtml("![Pixel](./pixel.png)", {
      slug: TEST_SLUG,
    });

    expect(html).toContain(`/images/posts/${TEST_SLUG}/pixel.png`);
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
    expect(html).toContain('width="1"');
    expect(html).toContain('height="1"');
  });
});
