import fs from "fs";
import path from "path";
import { visit } from "unist-util-visit";
import type { Element } from "hast";
import type { Plugin } from "unified";
import imageSize from "image-size";

const DEFAULT_POST_IMAGE_BASE = "/images/posts";
const PUBLIC_DIR = path.join(process.cwd(), "public");

type RehypeOptimizeImagesOptions = {
  slug?: string;
  postImageBasePath?: string;
};

function isExternalSrc(src: string) {
  return /^(https?:)?\/\//i.test(src) || src.startsWith("data:");
}

function normalizeSrc(
  rawSrc: string,
  slug?: string,
  basePath: string = DEFAULT_POST_IMAGE_BASE
) {
  if (!rawSrc) return rawSrc;
  if (isExternalSrc(rawSrc) || rawSrc.startsWith("/")) {
    return rawSrc;
  }
  if (!slug) return rawSrc;

  const cleaned = rawSrc.replace(/^\.\//, "");
  const joined = path.posix.join(basePath, slug, cleaned);
  return joined.startsWith("/") ? joined : `/${joined}`;
}

function getDimensionsForSrc(src: string) {
  if (!src || isExternalSrc(src) || src.includes("?")) return null;
  if (!src.startsWith("/")) return null;

  const normalizedPath = src.replace(/^\/+/, "");
  const filePath = path.join(PUBLIC_DIR, normalizedPath);
  if (!fs.existsSync(filePath)) return null;

  try {
    const buffer = fs.readFileSync(filePath);
    const { width, height } = imageSize(buffer);
    if (width && height) {
      return { width, height };
    }
  } catch (error) {
    console.warn(`No se pudo leer dimensiones de la imagen: ${src}`, error);
  }

  return null;
}

export const rehypeOptimizeImages: Plugin<[RehypeOptimizeImagesOptions?]> = (
  options = {}
) => {
  const { slug, postImageBasePath = DEFAULT_POST_IMAGE_BASE } = options;

  return (tree) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return;

      node.properties ||= {};
      const props = node.properties;
      const rawSrc = (props.src as string) || "";

      if (!rawSrc) return;

      const normalizedSrc = normalizeSrc(rawSrc, slug, postImageBasePath);
      props.src = normalizedSrc;

      if (!props.loading) props.loading = "lazy";
      if (!props.decoding) props.decoding = "async";

      if (!props.width || !props.height) {
        const dimensions = getDimensionsForSrc(normalizedSrc);
        if (dimensions) {
          if (!props.width) props.width = dimensions.width;
          if (!props.height) props.height = dimensions.height;
        }
      }

      node.properties = props;
    });
  };
};
