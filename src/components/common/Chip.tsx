// src/components/common/Chip.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = {
  active?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export default function Chip({ active = false, children, className = "", ...rest }: Props) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition";

  const normal =
    "border-neutral-300 text-neutral-700 hover:bg-black/5 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-white/10";

  const selected =
    "border-black bg-black text-white hover:opacity-90 dark:border-white dark:bg-white dark:text-black";

  return (
    <button
      type="button"
      className={`${base} ${active ? selected : normal} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
