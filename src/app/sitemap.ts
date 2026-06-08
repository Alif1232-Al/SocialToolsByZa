import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://social-tools-by-za.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/features`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/showcase`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/jurnal`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/markdown`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/linktree`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/photobox`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
