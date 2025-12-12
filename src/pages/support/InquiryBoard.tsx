import { useState } from "react";
import SectionCard from "../mypage/SectionCard";

type Inquiry = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  status: "접수" | "답변완료";
};

export default function InquiryBoard() {
  const [items, setItems] = useState<Inquiry[]>([
    {
      id: "q1",
      title: "예매 좌석 변경 관련",
      content: "좌석 변경이 가능한지 궁금합니다.",
      createdAt: "2025-11-02 14:12",
      status: "답변완료",
    },
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = () => {
    if (!title.trim() || !content.trim()) return;
    const now = new Date();
    setItems((prev) => [
      {
        id: `q${prev.length + 1}`,
        title: title.trim(),
        content: content.trim(),
        createdAt: now.toISOString().slice(0, 16).replace("T", " "),
        status: "접수",
      },
      ...prev,
    ]);
    setTitle("");
    setContent("");
  };

  return (
    <div className="space-y-6">
      <SectionCard id="inquiry-form" title="문의 등록">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-neutral-600">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
              placeholder="예: 결제 오류 문의"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-600">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
              placeholder="상세 내용을 입력해 주세요."
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={submit}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
            >
              제출
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard id="inquiry-list" title="내 문의 목록">
        <ul className="divide-y dark:divide-neutral-800">
          {items.map((q) => (
            <li key={q.id} className="py-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{q.title}</p>
                  <p className="text-xs text-neutral-500">{q.createdAt}</p>
                </div>
                <span className="rounded-full border px-3 py-1 text-xs dark:border-neutral-700">
                  {q.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                {q.content}
              </p>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
