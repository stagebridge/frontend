import { useState } from "react";
import LanguageModal from "./LanguageModal";

export default function LanguageButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-label="언어 설정" onClick={() => setOpen(true)}>🌐</button>
      {open && <LanguageModal onClose={() => setOpen(false)} />}
    </>
  );
}
