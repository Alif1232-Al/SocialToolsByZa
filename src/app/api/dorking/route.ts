import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

const PLATFORMS = [
  {
    name: "Instagram",
    url: (u: string) => `https://www.instagram.com/${u}/`,
    category: "Social Media",
    verifyContent: true,
    notFoundHints: [
      "page isn't available", "page not found", "sorry, this page",
      "link you followed may be broken", "doesn't exist", "this account",
    ],
  },
  {
    name: "TikTok",
    url: (u: string) => `https://www.tiktok.com/@${u}`,
    category: "Social Media",
    verifyContent: true,
    notFoundHints: [
      "couldn't find this account", "this account doesn't exist",
      "page not found", "no results", "this user",
    ],
  },
  {
    name: "Twitter / X",
    url: (u: string) => `https://twitter.com/${u}`,
    category: "Social Media",
    verifyContent: true,
    notFoundHints: [
      "this account doesn't exist", "page not found",
      "no results found", "doesn't exist",
    ],
  },
  {
    name: "Facebook",
    url: (u: string) => `https://www.facebook.com/${u}`,
    category: "Social Media",
    verifyContent: true,
    notFoundHints: [
      "page not found", "this page isn't available",
      "doesn't exist", "content not found",
    ],
  },
  {
    name: "LinkedIn",
    url: (u: string) => `https://www.linkedin.com/in/${u}`,
    category: "Professional",
    verifyContent: false,
  },
  {
    name: "Threads",
    url: (u: string) => `https://www.threads.net/@${u}`,
    category: "Social Media",
    verifyContent: true,
    notFoundHints: [
      "page not found", "sorry, this page isn't available",
      "doesn't exist", "no results",
    ],
  },
  {
    name: "YouTube",
    url: (u: string) => `https://www.youtube.com/@${u}`,
    category: "Streaming",
    verifyContent: true,
    notFoundHints: [
      "not found", "this channel does not exist",
      "doesn't have any videos", "no content",
    ],
  },
  {
    name: "GitHub",
    url: (u: string) => `https://github.com/${u}`,
    category: "Coding/Dev",
    verifyContent: false,
  },
  {
    name: "Snapchat",
    url: (u: string) => `https://www.snapchat.com/add/${u}`,
    category: "Social Media",
    verifyContent: true,
    notFoundHints: [
      "page not found", "couldn't find", "doesn't exist",
      "this content", "no results",
    ],
  },
  {
    name: "Reddit",
    url: (u: string) => `https://www.reddit.com/user/${u}`,
    category: "Social Media",
    verifyContent: true,
    notFoundHints: [
      "page not found", "this page does not exist",
      "sorry, nobody on reddit", "no one",
    ],
  },
  {
    name: "Pinterest",
    url: (u: string) => `https://www.pinterest.com/${u}`,
    category: "Social Media",
    verifyContent: true,
    notFoundHints: [
      "page not found", "doesn't exist",
      "no results", "couldn't find",
    ],
  },
  {
    name: "Telegram",
    url: (u: string) => `https://t.me/${u}`,
    category: "Messaging",
    verifyContent: true,
    notFoundHints: [
      "sorry, this page doesn't exist", "page not found",
      "doesn't exist",
    ],
  },
  {
    name: "Discord",
    url: (u: string) => `https://discord.com/users/${u}`,
    category: "Social Media",
    verifyContent: false,
  },
  {
    name: "Twitch",
    url: (u: string) => `https://www.twitch.tv/${u}`,
    category: "Streaming",
    verifyContent: true,
    notFoundHints: [
      "page not found", "sorry. we can't find that page",
      "doesn't exist", "no results",
    ],
  },
  {
    name: "Spotify",
    url: (u: string) => `https://open.spotify.com/user/${u}`,
    category: "Streaming",
    verifyContent: false,
  },
  {
    name: "Medium",
    url: (u: string) => `https://medium.com/@${u}`,
    category: "Coding/Dev",
    verifyContent: true,
    notFoundHints: [
      "page not found", "not found",
      "doesn't exist", "no results",
    ],
  },
  {
    name: "Behance",
    url: (u: string) => `https://www.behance.net/${u}`,
    category: "Professional",
    verifyContent: true,
    notFoundHints: [
      "page not found", "doesn't exist",
      "no results", "couldn't find",
    ],
  },
  {
    name: "Dribbble",
    url: (u: string) => `https://dribbble.com/${u}`,
    category: "Professional",
    verifyContent: false,
  },
  {
    name: "SoundCloud",
    url: (u: string) => `https://soundcloud.com/${u}`,
    category: "Streaming",
    verifyContent: true,
    notFoundHints: [
      "page not found", "not found",
      "doesn't exist", "no results",
    ],
  },
  {
    name: "Steam",
    url: (u: string) => `https://steamcommunity.com/id/${u}`,
    category: "Gaming",
    verifyContent: true,
    notFoundHints: [
      "page not found", "the specified profile could not be found",
      "no results", "doesn't exist",
    ],
  },
];

function sanitizeUsername(q: string): string {
  return q.replace(/[^a-zA-Z0-9_@-]/g, "").replace(/^@/, "").toLowerCase().slice(0, 50);
}

function sanitizeName(q: string): string {
  return q.replace(/[^a-zA-Z0-9\s'-]/g, "").trim().slice(0, 100);
}

async function checkPlatform(p: typeof PLATFORMS[number], username: string) {
  const profileUrl = p.url(username);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);

  try {
    const res = await fetch(profileUrl, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    clearTimeout(timer);

    if (res.status === 429) {
      return { name: p.name, url: profileUrl, category: p.category, status: "rate_limited" };
    }

    const isSuccess = res.status >= 200 && res.status < 400;
    if (!isSuccess) {
      return { name: p.name, url: profileUrl, category: p.category, status: "not_found" };
    }

    if (p.verifyContent && p.notFoundHints) {
      const text = await res.text();
      const lower = text.toLowerCase();

      const isNotFound = p.notFoundHints.some((hint) => {
        const idx = lower.indexOf(hint.toLowerCase());
        if (idx === -1) return false;
        const before = lower.slice(Math.max(0, idx - 20), idx);
        const after = lower.slice(idx + hint.length, idx + hint.length + 20);
        const prefixOk = !before || /[\s<>,"'([{]/.test(before.slice(-1));
        const suffixOk = !after || /[\s<>,"')\]}.,!?]/.test(after[0]);
        return prefixOk && suffixOk;
      });

      if (isNotFound) {
        return { name: p.name, url: profileUrl, category: p.category, status: "not_found" };
      }

      const isDefinitelyFound =
        lower.includes("follow") ||
        lower.includes("follower") ||
        lower.includes("following") ||
        lower.includes("profile") ||
        lower.includes("joined") ||
        lower.includes("member since") ||
        lower.includes("reputation") ||
        lower.includes("subscriber") ||
        lower.includes("video") ||
        lower.includes("post") ||
        lower.includes("bio") ||
        lower.includes("about") ||
        (p.name === "GitHub" && (lower.includes("repository") || lower.includes("contribution")));

      if (isDefinitelyFound) {
        return { name: p.name, url: profileUrl, category: p.category, status: "found" };
      }

      const noPositiveSignal = !isNotFound &&
        (lower.includes("login") || lower.includes("sign up") || lower.includes("create your account") || lower.includes("get started") || lower.includes("homepage"));

      if (noPositiveSignal) {
        return { name: p.name, url: profileUrl, category: p.category, status: "not_found" };
      }

      return { name: p.name, url: profileUrl, category: p.category, status: "found" };
    }

    return { name: p.name, url: profileUrl, category: p.category, status: "found" };
  } catch {
    clearTimeout(timer);
    return { name: p.name, url: profileUrl, category: p.category, status: "error" };
  }
}

async function googleDork(query: string, apiKey: string) {
  if (!apiKey) return [];
  try {
    const res = await fetch(
      `https://serpapi.com/search?q=${encodeURIComponent(query)}&api_key=${apiKey}&num=10`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.organic_results || []).map((r: any) => ({
      title: r.title || "",
      link: r.link || "",
      snippet: r.snippet || "",
    }));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { q, type } = await req.json();
    if (!q || typeof q !== "string" || !q.trim()) {
      return NextResponse.json({ error: "Masukkan kata kunci" }, { status: 400 });
    }

    const query = q.trim();

    if (type === "dork") {
      const dorkResults = await googleDork(query, process.env.SERPAPI_API_KEY || "");
      return NextResponse.json({ query, type: "dork", results: dorkResults });
    }

    if (!query.includes(" ") && query.length < 50) {
      const username = sanitizeUsername(query);
      if (!username) {
        return NextResponse.json({ error: "Username tidak valid" }, { status: 400 });
      }

      const settled = await Promise.allSettled(
        PLATFORMS.map((p) => checkPlatform(p, username))
      );

      const results: { name: string; url: string; category: string; status: string }[] = [];
      for (const r of settled) {
        if (r.status === "fulfilled") results.push(r.value);
      }

      const categories = Array.from(new Set(results.map((r) => r.category)));
      const grouped: Record<string, typeof results> = {};
      for (const cat of categories) {
        grouped[cat] = results.filter((r) => r.category === cat);
      }

      return NextResponse.json({
        query,
        username,
        type: "username",
        categories,
        grouped,
        results,
        stats: {
          total: results.length,
          found: results.filter((r) => r.status === "found").length,
          not_found: results.filter((r) => r.status === "not_found").length,
          error: results.filter((r) => r.status === "error").length,
          rate_limited: results.filter((r) => r.status === "rate_limited").length,
        },
      });
    }

    const name = sanitizeName(query);
    const settled = await Promise.allSettled(
      PLATFORMS.map((p) => checkPlatform(p, sanitizeUsername(name.replace(/\s+/g, ""))))
    );

    const results: { name: string; url: string; category: string; status: string }[] = [];
    for (const r of settled) {
      if (r.status === "fulfilled") results.push(r.value);
    }

    const dorkResults = await googleDork(
      `"${name}" site:linkedin.com/in OR site:instagram.com OR site:twitter.com`,
      process.env.SERPAPI_API_KEY || ""
    );

    return NextResponse.json({
      query,
      name,
      type: "name",
      results,
      nameSearchResults: dorkResults,
      stats: {
        total: results.length,
        found: results.filter((r) => r.status === "found").length,
        not_found: results.filter((r) => r.status === "not_found").length,
        error: results.filter((r) => r.status === "error").length,
        rate_limited: results.filter((r) => r.status === "rate_limited").length,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memproses permintaan";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
