import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shufflelab.io";

  return [
    { url: `${base}`, lastModified: new Date() },
    { url: `${base}/en`, lastModified: new Date() },
    { url: `${base}/zh`, lastModified: new Date() },
    { url: `${base}/en/word-counter`, lastModified: new Date() },
    { url: `${base}/zh/word-counter`, lastModified: new Date() },
    { url: `${base}/en/json-formatter`, lastModified: new Date() },
    { url: `${base}/zh/json-formatter`, lastModified: new Date() },
    { url: `${base}/en/currency-converter`, lastModified: new Date() },
    { url: `${base}/zh/currency-converter`, lastModified: new Date() },
    { url: `${base}/en/excuse-generator`, lastModified: new Date() },
    { url: `${base}/zh/excuse-generator`, lastModified: new Date() },
  ];
}