import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shufflelab.io";

  const routes = [
    "",
    "/word-counter",
    "/json-formatter",
    "/timestamp-converter",
    "/currency-converter",
    "/excuse-generator",
    "/scpi-simulator",
    "/base64",
	"/modbus-crc",
	"/uuid",
	"/jwt",
	"/jwt",
	"/modbus-frame",
  ];

  const langs = ["en", "zh"];

  const pages = routes.flatMap((route) =>
    langs.map((lang) => ({
      url: `${base}/${lang}${route}`,
      lastModified: new Date(),
    }))
  );

  return pages;
}