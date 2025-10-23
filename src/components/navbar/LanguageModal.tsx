type Props = { onClose: () => void };

export default function LanguageModal({ onClose }: Props) {
  const setLang = (code: "ko" | "ja" | "en") => {
    localStorage.setItem("sb_lang", code);
    document.documentElement.lang = code;
    onClose();
  };
  return (
    <div role="dialog" aria-modal="true">
      <h2>언어 설정</h2>
      <ul>
        <li><button onClick={() => setLang("ko")}>한국어</button></li>
        <li><button onClick={() => setLang("ja")}>日本語</button></li>
        <li><button onClick={() => setLang("en")}>English</button></li>
      </ul>
      <button onClick={onClose}>닫기</button>
    </div>
  );
}
