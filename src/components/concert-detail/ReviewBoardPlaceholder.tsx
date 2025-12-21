type Props = {
  title: string;
};

export default function ReviewBoardPlaceholder({ title }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <button
          type="button"
          className="h-9 rounded-xl bg-black px-4 text-sm font-semibold text-white"
        >
          작성하기
        </button>
      </div>

      <div className="mt-6 rounded-xl border bg-gray-50 p-5 text-sm text-gray-600">
        게시판 UI는 다음 단계에서 연결합니다. (목록, 상세, 작성 폼, 정렬, 페이지네이션)
      </div>
    </div>
  );
}
