"use client";
import { useCallback, useState } from "react";
import { Image, FileImage, Loader2 } from "lucide-react";
import ComicPanel from "./ComicPanel";
import { useImageUpload } from "@/hooks/useImageUpload";
import toast from "react-hot-toast";

export default function PictureToPdf() {
  const { images, addImages, removeImage } = useImageUpload();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addImages(e.target.files);
      }
    },
    [addImages]
  );

  const handleGenerate = useCallback(async () => {
    if (images.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF("p", "mm", "a4");
      const pw = pdf.internal.pageSize.getWidth() - 20;
      const ph = pdf.internal.pageSize.getHeight() - 20;

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        const img = new window.Image();
        img.src = images[i].url;
        await img.decode();
        const ratio = Math.min(pw / img.naturalWidth, ph / img.naturalHeight);
        const w = img.naturalWidth * ratio;
        const h = img.naturalHeight * ratio;
        const x = (pw + 20 - w) / 2;
        const y = (ph + 20 - h) / 2;
        const fmt = images[i].file.type === "image/png" ? "PNG" : "JPEG";
        pdf.addImage(img, fmt, x, y, w, h);
      }
      pdf.save("converted.pdf");
      toast.success("PDF berhasil dibuat!");
    } catch {
      setError("Gagal membuat PDF. Coba dengan gambar lebih kecil.");
      toast.error("Gagal membuat PDF");
    } finally {
      setLoading(false);
    }
  }, [images]);

  return (
    <ComicPanel bgColor="bg-pink-500" badge="ZIP!" badgeColor="bg-yellow-400 text-black">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2 text-white">
        <Image className="w-6 h-6" />
        Picture to PDF
      </h3>
      <p className="font-body text-body-md text-white/80 mb-4">
        Konversi gambar JPG/PNG ke PDF A4. Multi-file support!
      </p>
      <div className="bg-white border-4 border-black p-3">
        <label className="cursor-pointer font-body font-bold uppercase flex items-center justify-between border-b-2 border-black pb-2 mb-3">
          Select Multi-Files <FileImage className="w-5 h-5" />
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </label>
        <div className="grid grid-cols-3 gap-2 min-h-[80px]">
          {images.map((img) => (
            <div key={img.id} className="aspect-square bg-gray-100 border-2 border-black overflow-hidden relative group">
              <img src={img.url} alt={`Preview ${img.id}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-0.5 right-0.5 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white"
              >
                x
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-3 flex items-center justify-center py-4 text-gray-400 font-body font-bold text-xs uppercase">
              No images selected yet
            </div>
          )}
        </div>
      </div>
      {error && <p className="mt-2 bg-red-100 border-2 border-red-500 text-red-700 p-2 font-body font-bold text-xs">{error}</p>}
      <button onClick={handleGenerate} disabled={loading || images.length === 0} className="comic-btn bg-yellow-400 text-black w-full mt-3 text-center disabled:opacity-50">
        {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />GENERATING...</span> : "GENERATE PDF!"}
      </button>
    </ComicPanel>
  );
}
