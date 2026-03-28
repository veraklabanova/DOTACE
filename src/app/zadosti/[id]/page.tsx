"use client";

import { use, useState } from "react";
import Link from "next/link";
import { applications, auditLog } from "@/data/mock-data";
import {
  STATE_LABELS,
  STATE_TRANSITIONS,
  ApplicationState,
} from "@/lib/types";
import StateBadge from "@/components/StateBadge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

const WORKFLOW_STEPS: ApplicationState[] = [
  "NOVA",
  "FORMALNI_KONTROLA",
  "DOPLNENI",
  "VECNE_HODNOCENI",
  "PRIPRAVENO_K_ROZHODNUTI",
  "SCHVALENO",
  "ARCHIVOVANO",
];

function WorkflowStepper({ currentState }: { currentState: ApplicationState }) {
  const stepsToShow =
    currentState === "ZAMITNUTO"
      ? [...WORKFLOW_STEPS.slice(0, -1), "ZAMITNUTO" as ApplicationState]
      : WORKFLOW_STEPS;

  const currentIdx = stepsToShow.indexOf(currentState);

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {stepsToShow.map((step, i) => {
        const isPast = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isRejected = step === "ZAMITNUTO";
        return (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                isCurrent
                  ? isRejected
                    ? "bg-red-100 text-red-800 ring-2 ring-red-300"
                    : "bg-blue-100 text-blue-800 ring-2 ring-blue-300"
                  : isPast
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {isPast && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {STATE_LABELS[step]}
            </div>
            {i < stepsToShow.length - 1 && (
              <svg
                className={`w-4 h-4 mx-0.5 ${
                  i < currentIdx ? "text-green-400" : "text-slate-300"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ZadostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const app = applications.find((a) => a.id === id);
  const [showTransition, setShowTransition] = useState(false);

  if (!app) {
    return (
      <div className="p-8">
        <p className="text-slate-500">\u017d\u00e1dost {id} nebyla nalezena.</p>
        <Link href="/zadosti" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          &larr; Zp\u011bt na seznam
        </Link>
      </div>
    );
  }

  const possibleTransitions = STATE_TRANSITIONS[app.state];
  const relatedAudit = auditLog.filter((e) => e.entityId === app.id);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <Link
          href="/zadosti"
          className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Zp\u011bt na seznam
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{app.title}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {app.id} &middot; JID: {app.jid}
            </p>
          </div>
          <StateBadge state={app.state} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Pr\u016fb\u011bh workflow
        </h2>
        <WorkflowStepper currentState={app.state} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            \u017dadatel
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">N\u00e1zev</dt>
              <dd className="font-medium text-right">{app.subject.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">I\u010cO</dt>
              <dd className="font-mono">{app.subject.ico}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Adresa</dt>
              <dd className="text-right max-w-[250px]">{app.subject.address}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Pr\u00e1vn\u00ed forma</dt>
              <dd>{app.subject.legalForm}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-slate-500">ARES ov\u011b\u0159en\u00ed</dt>
              <dd>
                {app.subject.aresVerified ? (
                  <span className="inline-flex items-center gap-1 text-green-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ov\u011b\u0159eno
                  </span>
                ) : (
                  <span className="text-red-600">Neov\u011b\u0159eno</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Detaily \u017e\u00e1dosti
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Dota\u010dn\u00ed program</dt>
              <dd className="font-medium text-right">{app.programName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Po\u017eadovan\u00e1 \u010d\u00e1stka</dt>
              <dd className="font-bold">{formatCurrency(app.requestedAmount)}</dd>
            </div>
            {app.approvedAmount !== null && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Schv\u00e1len\u00e1 \u010d\u00e1stka</dt>
                <dd className="font-bold text-green-600">
                  {formatCurrency(app.approvedAmount)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-slate-500">Referent</dt>
              <dd>{app.referent}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Vytvo\u0159eno</dt>
              <dd>{formatDate(app.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Posledn\u00ed zm\u011bna</dt>
              <dd>{formatDate(app.updatedAt)}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-slate-500">SLA lh\u016fta</dt>
              <dd>
                {app.slaPaused ? (
                  <span className="text-orange-500 font-medium">
                    Pozastaveno (Dopln\u011bn\u00ed)
                  </span>
                ) : ["SCHVALENO", "ZAMITNUTO", "ARCHIVOVANO"].includes(
                    app.state
                  ) ? (
                  <span className="text-slate-400">Ukon\u010deno</span>
                ) : (
                  <span
                    className={`font-medium ${
                      app.slaRemainingDays <= 5
                        ? "text-red-600"
                        : app.slaRemainingDays <= 14
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {app.slaRemainingDays} dn\u00ed do {formatDate(app.deadline)}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {app.notes && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Pozn\u00e1mky
          </h2>
          <p className="text-sm text-slate-700">{app.notes}</p>
        </div>
      )}

      {possibleTransitions.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Akce
          </h2>
          {!showTransition ? (
            <button
              onClick={() => setShowTransition(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Zm\u011bnit stav \u017e\u00e1dosti
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Mo\u017en\u00e9 p\u0159echody z aktu\u00e1ln\u00edho stavu{" "}
                <strong>{STATE_LABELS[app.state]}</strong>:
              </p>
              <div className="flex flex-wrap gap-2">
                {possibleTransitions.map((target) => (
                  <button
                    key={target}
                    onClick={() => {
                      alert(
                        `[PROTOTYP] P\u0159echod: ${STATE_LABELS[app.state]} \u2192 ${STATE_LABELS[target]}\n\nV produk\u010dn\u00ed verzi bude zalogov\u00e1no do auditn\u00edho logu s hash-chainem.`
                      );
                      setShowTransition(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      target === "ZAMITNUTO"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : target === "SCHVALENO"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    \u2192 {STATE_LABELS[target]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowTransition(false)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Zru\u0161it
              </button>
            </div>
          )}
        </div>
      )}

      {relatedAudit.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Historie zm\u011bn
          </h2>
          <div className="space-y-3">
            {relatedAudit.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 text-sm border-l-2 border-slate-200 pl-3"
              >
                <div className="flex-1">
                  <p className="font-medium">{entry.action}</p>
                  <p className="text-slate-500">{entry.detail}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDateTime(entry.timestamp)} &middot; {entry.user}
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-300 shrink-0">
                  #{entry.hashChain}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
