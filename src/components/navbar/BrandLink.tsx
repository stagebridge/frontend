import { Link } from "react-router-dom";

export default function BrandLink() {
  return (
    <Link
      to="/"
      className="text-xl font-semibold tracking-tight
                 text-slate-900 hover:opacity-80
                 dark:text-slate-100"
      aria-label="StageBridge 메인으로 이동"
    >
      StageBridge
    </Link>
  );
}
