import { Link } from "react-router-dom";

export default function BrandLink() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2"
      aria-label="StageBridge 메인으로 이동"
    >
      <span className="text-[30px] font-extrabold leading-none tracking-tight">
        <span className="text-sky-600">Stage</span>
        <span className="text-slate-900 dark:text-slate-100">Bridge</span>
      </span>
    </Link>
  );
}
