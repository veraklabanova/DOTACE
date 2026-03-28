import { ApplicationState, STATE_LABELS, STATE_COLORS } from "@/lib/types";

export default function StateBadge({ state }: { state: ApplicationState }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATE_COLORS[state]}`}
    >
      {STATE_LABELS[state]}
    </span>
  );
}
