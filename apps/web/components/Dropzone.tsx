"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";

interface DropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
  label?: string;
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 16V4m0 0L7 9m5-5 5 5M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Dropzone({
  onFile,
  accept = "image/*,.heic,.heif",
  label = "Upload Your Image",
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      // Browsers report HEIC/HEIF files with an empty or inconsistent MIME
      // type (unlike JPEG/PNG/WebP/AVIF), so fall back to the extension.
      const looksLikeImage =
        file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
      if (looksLikeImage) onFile(file);
    },
    [onFile]
  );

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`dashed-pill bg-surface flex w-full flex-col items-center justify-center gap-3 p-3 transition-colors sm:flex-row sm:gap-4 sm:py-3 sm:pr-8 sm:pl-3 ${
        isDragging ? "border-primary bg-primary/5" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="bg-primary text-primary-ink flex items-center gap-2 rounded-full px-6 py-3 font-medium whitespace-nowrap"
      >
        <UploadIcon />
        {label}
      </button>
      <span className="text-ink-muted text-sm">or</span>
      <span className="text-ink text-sm font-medium">Drag and Drop</span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        aria-label={label}
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}
