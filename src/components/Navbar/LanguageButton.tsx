// src/components/Navbar/LanguageButton.tsx
import { useRef, useState } from "react";
import LanguageModal from "./LanguageModal";

export default function LanguageButton() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-label="언어 설정"
        className="rounded-full p-2 text-xl leading-none transition hover:bg-black/5 dark:hover:bg-white/10"
        onClick={() => setOpen((v) => !v)}
      >
        🌐
      </button>

      {open && (
        <LanguageModal anchorRef={anchorRef} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
