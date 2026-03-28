import { budgetPrograms } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function RozpocetPage() {
  const totalAllocation = budgetPrograms.reduce(
    (s, b) => s + b.totalAllocation,
    0
  );
  const totalApproved = budgetPrograms.reduce((s, b) => s + b.approved, 0);
  const totalReserved = budgetPrograms.reduce((s, b) => s + b.reserved, 0);
  const totalRemaining = budgetPrograms.reduce((s, b) => s + b.remaining, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{"Rozpočet dotačních programů"}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {"Přehled alokací a čerpání pro rok 2025"}
          </p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          {"Import XLSX"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">{"Celková alokace"}</p>
          <p className="text-2xl font-bold mt-1">
            {formatCurrency(totalAllocation)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">{"Schváleno"}</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {formatCurrency(totalApproved)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">{"Rezervováno"}</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">
            {formatCurrency(totalReserved)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">{"Zbývá"}</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">
            {formatCurrency(totalRemaining)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-500">{"Dotační program"}</th>
              <th className="text-right px-4 py-3 font-medium text-slate-500">{"Alokace"}</th>
              <th className="text-right px-4 py-3 font-medium text-slate-500">{"Schváleno"}</th>
              <th className="text-right px-4 py-3 font-medium text-slate-500">{"Rezervováno"}</th>
              <th className="text-right px-4 py-3 font-medium text-slate-500">{"Zbývá"}</th>
              <th className="text-center px-4 py-3 font-medium text-slate-500">{"Žádostí"}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">{"Čerpání"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {budgetPrograms.map((bp) => {
              const usedPct =
                ((bp.approved + bp.reserved) / bp.totalAllocation) * 100;
              const approvedPct =
                (bp.approved / bp.totalAllocation) * 100;

              return (
                <tr key={bp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium">{bp.name}</p>
                    <p className="text-xs text-slate-400">{bp.id}</p>
                  </td>
                  <td className="px-4 py-4 text-right font-medium">
                    {formatCurrency(bp.totalAllocation)}
                  </td>
                  <td className="px-4 py-4 text-right text-green-600 font-medium">
                    {formatCurrency(bp.approved)}
                  </td>
                  <td className="px-4 py-4 text-right text-yellow-600 font-medium">
                    {formatCurrency(bp.reserved)}
                  </td>
                  <td className="px-4 py-4 text-right text-blue-600 font-medium">
                    {formatCurrency(bp.remaining)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {bp.applicationsCount}
                  </td>
                  <td className="px-4 py-4 min-w-[150px]">
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full flex">
                        <div
                          className="bg-green-500 h-full"
                          style={{ width: `${approvedPct}%` }}
                        />
                        <div
                          className="bg-yellow-400 h-full"
                          style={{
                            width: `${usedPct - approvedPct}%`,
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {usedPct.toFixed(0)}{"% využito"}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
              <td className="px-4 py-3">{"Celkem"}</td>
              <td className="px-4 py-3 text-right">
                {formatCurrency(totalAllocation)}
              </td>
              <td className="px-4 py-3 text-right text-green-600">
                {formatCurrency(totalApproved)}
              </td>
              <td className="px-4 py-3 text-right text-yellow-600">
                {formatCurrency(totalReserved)}
              </td>
              <td className="px-4 py-3 text-right text-blue-600">
                {formatCurrency(totalRemaining)}
              </td>
              <td className="px-4 py-3 text-center">
                {budgetPrograms.reduce(
                  (s, b) => s + b.applicationsCount,
                  0
                )}
              </td>
              <td className="px-4 py-3">
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full flex">
                    <div
                      className="bg-green-500 h-full"
                      style={{
                        width: `${
                          (totalApproved / totalAllocation) * 100
                        }%`,
                      }}
                    />
                    <div
                      className="bg-yellow-400 h-full"
                      style={{
                        width: `${
                          (totalReserved / totalAllocation) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>{"Ochrana rozpočtu:"}</strong> {"Systém automaticky blokuje schválení žádosti, pokud by požadovaná částka překročila zbývající alokaci dotačního programu (princip čtyř očí)."}
      </div>
    </div>
  );
}
