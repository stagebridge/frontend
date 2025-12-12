type Item = { id: string; title: string; body: string; date?: string };

export default function SupportInbox({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.id} className="rounded-lg border dark:border-neutral-800">
          <details className="group">
            <summary className="cursor-pointer list-none px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{it.title}</span>
                <span className="text-xs text-neutral-500">{it.date}</span>
              </div>
            </summary>
            <div className="border-t px-4 py-3 text-sm dark:border-neutral-800">
              {it.body}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
