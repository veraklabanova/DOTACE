"use client";

import { useState } from "react";
import { auditLog } from "@/data/mock-data";
import { formatDateTime } from "@/lib/utils";

export default function AuditPage() {
  const [filter, setFilter] = useState("");

  const filtered = auditLog.filter((entry) => {
    if (!filter) return true;
    const search = filter.toLowerCase();
    return (
      entry.action.toLowerCase().includes(search) ||
      entry.user.toLowerCase().includes(search) ||
      entry.entityId.toLowerCase().includes(search) ||
      entry.detail.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Auditn\u00ed log</h1>
        <p className="text-slate-500 text-sm mt-1">
          Nep\u0159episovateln\u00fd z\u00e1znam v\u0161ech operac\u00ed s hash-chain integritou
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Filtrovat z\u00e1znamy (akce, u\u017eivatel, \u010d\u00edslo \u017e\u00e1dosti)..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-500">
                \u010cas
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">
                U\u017eivatel
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">
                Akce
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">
                Entita
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">
                Detail
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">
                Hash
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((entry, i) => (
              <tr
                key={entry.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                  {formatDateTime(entry.timestamp)}
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {entry.user}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      entry.action.includes("SCHV")
                        ? "bg-green-100 text-green-700"
                        : entry.action.includes("ZM\u011aNA")
                        ? "bg-blue-100 text-blue-700"
                        : entry.action.includes("VYTVO")
                        ? "bg-purple-100 text-purple-700"
                        : entry.action.includes("POZASTAV")
                        ? "bg-orange-100 text-orange-700"
                        : entry.action.includes("ARCHIV")
                        ? "bg-gray-100 text-gray-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  <span className="text-slate-400">{entry.entityType}/</span>
                  {entry.entityId}
                </td>
                <td className="px-4 py-3 text-slate-600 max-w-[300px] truncate">
                  {entry.detail}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-slate-900">
                      {entry.hashChain}
                    </span>
                    <span className="font-mono text-xs text-slate-300">
                      prev: {entry.previousHash}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <strong>Integrita hash-chainu</strong>
          </div>
          V\u0161echny z\u00e1znamy jsou konzistentn\u00ed. \u017d\u00e1dn\u00e9 naru\u0161en\u00ed integrity
          nebylo detekováno.
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <strong>Hash-chain princip</strong>
          </div>
          Ka\u017ed\u00fd z\u00e1znam obsahuje hash p\u0159edchoz\u00edho z\u00e1znamu. Jak\u00fdkoliv
          neopr\u00e1vn\u011bn\u00fd z\u00e1sah do datab\u00e1ze zp\u016fsob\u00ed nevalidn\u00ed \u0159et\u011bz a spust\u00ed alarm.
        </div>
      </div>
    </div>
  );
}
