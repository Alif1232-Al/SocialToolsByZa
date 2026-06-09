import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, Header as DocHeader, Footer as DocFooter } from "docx";
import { verifySession } from "@/lib/auth";

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf"];

function formatTimestamp(): string {
  const d = new Date();
  return `Converted by SocialToolsByZa on ${d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const doc = await loadingTask.promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(" ");
    pages.push(text);
  }
  await doc.destroy();
  return pages.join("\n\n");
}

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File PDF diperlukan" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File terlalu besar. Maksimal 15MB" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Hanya file PDF yang didukung" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json({ error: "File PDF kosong" }, { status: 400 });
    }

    const text = await extractTextFromPdf(buffer);

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Tidak dapat mengekstrak teks dari PDF. Mungkin file ini berisi gambar atau terproteksi." }, { status: 422 });
    }

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const doc = new Document({
      sections: [
        {
          properties: {},
          headers: {
            default: new DocHeader({
              children: [new Paragraph({ children: [new TextRun({ text: "SocialToolsByZa - PDF to Word Converter", bold: true, size: 16 })] })],
            }),
          },
          footers: {
            default: new DocFooter({
              children: [new Paragraph({ children: [new TextRun({ text: formatTimestamp(), italics: true, size: 14 })] })],
            }),
          },
          children: lines.map(
            (line) => new Paragraph({
              spacing: { after: 120, line: 276 },
              children: [new TextRun({ text: line, size: 22 })],
            })
          ),
        },
      ],
    });

    const docxBuffer = await Packer.toBuffer(doc);

    return new NextResponse(new Uint8Array(docxBuffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.pdf$/i, "")}.docx"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal mengonversi file PDF";
    console.error("PDF to Word error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
