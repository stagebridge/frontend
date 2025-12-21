import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  titleLabel: string;
  onClose: () => void;
  onSubmit: (payload: { title: string; content: string }) => void;
};

export default function WriteModal({ open, titleLabel, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setContent("");
  }, [open]);

  const disabled = title.trim().length === 0 || content.trim().length === 0;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-sm font-semibold text-gray-900">{titleLabel} 작성</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-50"
          >
            닫기
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 w-full rounded-xl border px-3 text-sm"
              placeholder="제목을 입력해 주세요."
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[140px] w-full rounded-xl border px-3 py-3 text-sm"
              placeholder="내용을 입력해 주세요."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border px-4 text-sm text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSubmit({ title, content })}
            className={[
              "h-10 rounded-xl px-4 text-sm font-semibold text-white",
              disabled ? "bg-gray-300" : "bg-black hover:bg-gray-900",
            ].join(" ")}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
