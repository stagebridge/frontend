type Props = {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export default function FilterChipV2({ active = false, onClick, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
        "border",
        active
          ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-50 dark:text-slate-900 dark:border-slate-50"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-neutral-900 dark:text-slate-200 dark:border-neutral-800 dark:hover:bg-neutral-800",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
