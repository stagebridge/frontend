export type DetailTabKey = "info" | "reviews" | "expectations" | "qa";

type Props = {
  active: DetailTabKey;
  onChange: (next: DetailTabKey) => void;
  counts?: { reviews?: number; expectations?: number; qa?: number };
};

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-1 pb-3 text-sm font-medium transition-colors",
        active ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-gray-800",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function DetailTabs({ active, onChange, counts }: Props) {
  const reviews = counts?.reviews;
  const expectations = counts?.expectations;
  const qa = counts?.qa;

  return (
    <div className="flex flex-wrap items-end gap-6">
      <TabButton active={active === "info"} label="공연정보" onClick={() => onChange("info")} />
      <TabButton
        active={active === "reviews"}
        label={`관람후기${typeof reviews === "number" ? `(${reviews})` : ""}`}
        onClick={() => onChange("reviews")}
      />
      <TabButton
        active={active === "expectations"}
        label={`기대평${typeof expectations === "number" ? `(${expectations})` : ""}`}
        onClick={() => onChange("expectations")}
      />
      <TabButton
        active={active === "qa"}
        label={`Q&A${typeof qa === "number" ? `(${qa})` : ""}`}
        onClick={() => onChange("qa")}
      />
    </div>
  );
}
