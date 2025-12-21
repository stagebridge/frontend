type Props = {
  images: string[];
};

export default function DetailImagesSection({ images }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900">상세 정보 이미지</h2>

      {images.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">상세 이미지가 준비 중입니다.</p>
      ) : (
        <div className="mt-5 space-y-6">
          {images.map((url, idx) => (
            <img
              key={`${url}-${idx}`}
              src={url}
              alt={`공연 상세 이미지 ${idx + 1}`}
              className="w-full rounded-xl"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
}
