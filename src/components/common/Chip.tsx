type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean };
export default function Chip({ active, className = "", ...rest }: Props) {
  return (
    <button
      {...rest}
      className={[
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
          : "text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:border-neutral-700 dark:hover:bg-white/10",
        className,
      ].join(" ")}
    />
  );
}
