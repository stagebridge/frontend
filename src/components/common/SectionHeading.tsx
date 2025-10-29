type Props = { title: string; right?: React.ReactNode; className?: string };
export default function SectionHeading({ title, right, className }: Props) {
  return (
    <div className={`mb-4 flex items-end justify-between ${className ?? ""}`}>
      <h2 className="relative inline-block text-[22px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
        <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-transparent opacity-70" />
      </h2>
      {right}
    </div>
  );
}
