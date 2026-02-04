type Props = {
  title: string;
  description?: string;
  rightSlot?: React.ReactNode;
};

export default function SectionHeaderV2({ title, description, rightSlot }: Props) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
        ) : null}
      </div>

      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
}
