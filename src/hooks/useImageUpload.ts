"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface UploadedImage {
  id: string;
  url: string;
  file: File;
}

export function useImageUpload() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const objectUrls = useRef<string[]>([]);

  const addImages = useCallback((files: FileList | File[]) => {
    const newImages: UploadedImage[] = [];
    const newUrls: string[] = [];

    Array.from(files).forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const url = URL.createObjectURL(file);
      newUrls.push(url);
      newImages.push({ id, url, file });
    });

    objectUrls.current.push(...newUrls);
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        objectUrls.current = objectUrls.current.filter((u) => u !== target.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current = [];
    setImages([]);
  }, []);

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return { images, addImages, removeImage, clearAll };
}
