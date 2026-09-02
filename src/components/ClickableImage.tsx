"use client";

import { useState } from "react";

export default function ClickableImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
        className={`cursor-zoom-in ${className ?? ""}`}
      />
      {open && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
