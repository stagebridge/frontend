type Props = {
  period: string;
  venue: string;
  genre: string;
  price: string;
  runtime: string;
  age: string;
  timeGuide: string;
  cast: string;
  crew: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 py-2 text-sm">
      <div className="text-gray-500">{label}</div>
      <div className="text-gray-900">{value}</div>
    </div>
  );
}

export default function DetailInfoTable({
  period,
  venue,
  genre,
  price,
  runtime,
  age,
  timeGuide,
  cast,
  crew,
}: Props) {
  return (
    <div className="divide-y">
      <Row label="기간" value={period} />
      <Row label="지역" value="-" />
      <Row label="장르" value={genre} />
      <Row label="가격" value={price} />
      <Row label="러닝타임" value={runtime} />
      <Row label="관람연령" value={age} />
      <Row label="상영시간대" value={timeGuide} />
      <Row label="출연진" value={cast} />
      <Row label="제작진" value={crew} />
    </div>
  );
}
