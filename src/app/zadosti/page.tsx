"use client";

import { useState } from "react";
import Link from "next/link";
import { applications } from "@/data/mock-data";
import { ApplicationState, STATE_LABELS } from "@/lib/types";
import StateBadge from "@/components/StateBadge";
import { formatCurrency } from "@/lib/utils";

const ALL_STATES: ApplicationState[] = [
  "NOVA",
  "FORMALNI_KONTROLA",
  "DOPLNENI",
  "VECNE_HODNOCENI",
  "PRIPRAVENO_K_ROZHODNUTI",
  "SCHVALENO",
  "ZAMITNUTO",
  "ARCHIVOVANO",
];

export default function ZadostiPage() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<ApplicationState | "">("");
  const [referentFilter, setReferentFilter] = useState("");

  const referents = [...new Set(applications.map((a) => a.referent))];

  const filtered = applications.filter((app) => {
    if (
      search &&
      !app.title.toLowerCase().includes(search.toLowerCase()) &&
      !app.id.toLowerCase().includes(search.toLowerCase()) &&
      !app.subject.name.toLowerCase().includes(search.toLowerCase()) &&
      !app.subject.ico.includes(search)
    )
      return false;
    if (stateFilter && app.state !== stateFilter) return false;
    if (referentFilter && app.referent !== referentFilter) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{"Žádosti o dotaci"}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {"Celkem"} {applications.length} {"žádostí"}
          </p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          {"+ Nová žádost"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 mb-6 p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Hledat (číslo, název, IČO, subjekt)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
          <select
            value={stateFilter}
            onChange={(e) =>
              setStateFilter(e.target.value as ApplicationState | "")
            }
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="">{"Všechny stavy"}</option>
            {ALL_STATES.map((s) => (
              <option key={s} value={s}>
                {STATE_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            value={referentFilter}
            onChange={(e) => setReferentFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="">{"Všichni referenti"}</option>
            {referents.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-500">{"Číslo"}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">{"Název"}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">{"Žadatel"}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">{"Program"}</th>
              <th className="text-right px-4 py-3 font-medium text-slate-500">{"Částka"}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">{"Stav"}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">{"SLA"}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">{"Referent"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/zadosti/${app.id}`}
                    className="font-medium text-slate-900 hover:text-blue-600"
                  >
                    {app.id}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/zadosti/${app.id}`}
                    className="hover:text-blue-600"
                  >
                    {app.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {app.subject.name}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {app.programName}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatCurrency(app.requestedAmount)}
                </td>
                <td className="px-4 py-3">
                  <StateBadge state={app.state} />
                </td>
                <td className="px-4 py-3">
                  {app.slaPaused ? (
                    <span className="text-orange-500 text-xs font-medium">
                      {"Pozastaveno"}
                    </span>
                  ) : ["SCHVALENO", "ZAMITNUTO", "ARCHIVOVANO"].includes(
                      app.state
                    ) ? (
                    <span className="text-slate-400 text-xs">{"\u2014"}</span>
                  ) : (
                    <span
                      className={`text-xs font-medium ${
                        app.slaRemainingDays <= 5
                          ? "text-red-600"
                          : app.slaRemainingDays <= 14
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {app.slaRemainingDays} {"dní"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {app.referent}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  {"Žádné žádosti neodpovídají zvoleným filtrům."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
