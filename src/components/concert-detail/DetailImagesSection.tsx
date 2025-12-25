type Props = {
  images?: string[];
};

export default function DetailImagesSection({ images = [] }: Props) {
  const validImages = images.filter((v) => typeof v === "string" && v.trim().length > 0);

  // ✅ 여기 수치만 조절하시면 됩니다.
  // - 너무 작아져서 "세로 막대"처럼 보이는 것을 방지하려고,
  //   가로 최소 폭도 함께 둡니다.
  const MAX_WIDTH_PX = 840;   // 이미지 최대 폭
  const MIN_WIDTH_PX = 420;   // 이미지 최소 폭(너무 얇아지는 것 방지)

  if (validImages.length === 0) return null;

  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold text-neutral-900">상세 이미지</h3>

      <div className="mt-4 space-y-10">
        {validImages.map((src, idx) => (
          <div key={`${src}-${idx}`} className="flex justify-center">
            <img
              src={src}
              alt={`상세 이미지 ${idx + 1}`}
              loading="lazy"
              className="h-auto object-contain"
              style={{
                width: "100%",
                maxWidth: `${MAX_WIDTH_PX}px`,
                minWidth: `${MIN_WIDTH_PX}px`,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
