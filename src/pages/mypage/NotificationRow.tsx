import { ReactNode } from "react";

export default function NotificationRow({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc?: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between rounded-lg border p-4 dark:border-neutral-800">
      <div className="pr-4">
        <div className="font-medium">{title}</div>
        {desc && <p className="mt-1 text-sm text-neutral-500">{desc}</p>}
      </div>
      <input
        type="checkbox"
        className="mt-1 h-5 w-5"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
