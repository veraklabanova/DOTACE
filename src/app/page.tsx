import { dashboardStats, applications, budgetPrograms } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";
import StateBadge from "@/components/StateBadge";
import Link from "next/link";
import { STATE_LABELS, ApplicationState } from "@/lib/types";

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const stateCounts: Partial<Record<ApplicationState, number>> = {};
  for (const app of applications) {
    stateCounts[app.state] = (stateCounts[app.state] || 0) + 1;
  }

  const urgentApps = applications
    .filter(
      (a) =>
        a.slaRemainingDays <= 5 &&
        !a.slaPaused &&
        !["SCHVALENO", "ZAMITNUTO", "ARCHIVOVANO"].includes(a.state)
    )
    .sort((a, b) => a.slaRemainingDays - b.slaRemainingDays);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{"Přehled"}</h1>
        <p className="text-slate-500 text-sm mt-1">
          {"Dashboard dotačního systému krajského úřadu"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Celkem žádostí"
          value={String(dashboardStats.totalApplications)}
          sub={`${dashboardStats.pendingReview} rozpracovaných`}
          color="text-slate-900"
        />
        <StatCard
          label="Schváleno"
          value={String(dashboardStats.approved)}
          sub={formatCurrency(dashboardStats.totalApproved)}
          color="text-green-600"
        />
        <StatCard
          label="Zamítnuto"
          value={String(dashboardStats.rejected)}
          color="text-red-600"
        />
        <StatCard
          label="Prům. doba zpracování"
          value={`${dashboardStats.avgProcessingDays} dní`}
          sub={`${dashboardStats.slaBreaches} překročení SLA`}
          color="text-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold mb-4">{"Požadované vs. schválené prostředky"}</h2>
          <div className="space-y-3">
            {budgetPrograms.map((bp) => {
              const usedPct =
                ((bp.approved + bp.reserved) / bp.totalAllocation) * 100;
              const approvedPct =
                (bp.approved / bp.totalAllocation) * 100;
              return (
                <div key={bp.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium truncate mr-2">{bp.name}</span>
                    <span className="text-slate-500 shrink-0">
                      {formatCurrency(bp.approved + bp.reserved)} /{" "}
                      {formatCurrency(bp.totalAllocation)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="h-full flex">
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: `${approvedPct}%` }}
                      />
                      <div
                        className="bg-yellow-400 h-full"
                        style={{ width: `${usedPct - approvedPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500 inline-block" />
              {"Schváleno"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-yellow-400 inline-block" />
              {"Rezervováno"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold mb-4">{"Žádosti dle stavu"}</h2>
          <div className="space-y-2">
            {(Object.entries(stateCounts) as [ApplicationState, number][]).map(
              ([state, count]) => (
                <div
                  key={state}
                  className="flex items-center justify-between text-sm"
                >
                  <StateBadge state={state} />
                  <span className="font-semibold">{count}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {urgentApps.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {"Blížící se lhůty"}
          </h2>
          <div className="divide-y divide-slate-100">
            {urgentApps.map((app) => (
              <Link
                key={app.id}
                href={`/zadosti/${app.id}`}
                className="flex items-center justify-between py-3 hover:bg-slate-50 -mx-2 px-2 rounded transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{app.title}</p>
                  <p className="text-xs text-slate-500">
                    {app.id} &middot; {app.subject.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-red-600">
                    {app.slaRemainingDays} {"dní"}
                  </span>
                  <p className="text-xs text-slate-400">{STATE_LABELS[app.state]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
