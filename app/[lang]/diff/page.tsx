"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

type DiffOp =
  | { type: "equal"; a: string; b: string }
  | { type: "delete"; a: string }
  | { type: "insert"; b: string };

type DiffRow =
  | { kind: "equal"; a: string; b: string; leftNo: number; rightNo: number }
  | { kind: "delete"; a: string; leftNo: number }
  | { kind: "insert"; b: string; rightNo: number }
  | { kind: "replace"; a: string; b: string; leftNo: number; rightNo: number };

function buildLineDiff(aLines: string[], bLines: string[]): DiffOp[] {
  const n = aLines.length;
  const m = bLines.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0)
  );

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (aLines[i] === bLines[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;

  while (i < n && j < m) {
    if (aLines[i] === bLines[j]) {
      ops.push({ type: "equal", a: aLines[i], b: bLines[j] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "delete", a: aLines[i] });
      i++;
    } else {
      ops.push({ type: "insert", b: bLines[j] });
      j++;
    }
  }

  while (i < n) {
    ops.push({ type: "delete", a: aLines[i] });
    i++;
  }

  while (j < m) {
    ops.push({ type: "insert", b: bLines[j] });
    j++;
  }

  return ops;
}

function mergeOpsToRows(ops: DiffOp[]): DiffRow[] {
  const rows: DiffRow[] = [];
  let leftNo = 1;
  let rightNo = 1;

  for (let i = 0; i < ops.length; i++) {
    const current = ops[i];
    const next = ops[i + 1];

    if (current.type === "delete" && next?.type === "insert") {
      rows.push({
        kind: "replace",
        a: current.a,
        b: next.b,
        leftNo,
        rightNo,
      });
      leftNo++;
      rightNo++;
      i++;
      continue;
    }

    if (current.type === "insert" && next?.type === "delete") {
      rows.push({
        kind: "replace",
        a: next.a,
        b: current.b,
        leftNo,
        rightNo,
      });
      leftNo++;
      rightNo++;
      i++;
      continue;
    }

    if (current.type === "equal") {
      rows.push({
        kind: "equal",
        a: current.a,
        b: current.b,
        leftNo,
        rightNo,
      });
      leftNo++;
      rightNo++;
    } else if (current.type === "delete") {
      rows.push({
        kind: "delete",
        a: current.a,
        leftNo,
      });
      leftNo++;
    } else if (current.type === "insert") {
      rows.push({
        kind: "insert",
        b: current.b,
        rightNo,
      });
      rightNo++;
    }
  }

  return rows;
}

function getInlineParts(a: string, b: string) {
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) {
    start++;
  }

  let endA = a.length - 1;
  let endB = b.length - 1;

  while (endA >= start && endB >= start && a[endA] === b[endB]) {
    endA--;
    endB--;
  }

  return {
    prefixA: a.slice(0, start),
    changedA: a.slice(start, endA + 1),
    suffixA: a.slice(endA + 1),
    prefixB: b.slice(0, start),
    changedB: b.slice(start, endB + 1),
    suffixB: b.slice(endB + 1),
  };
}

function InlineDiff({
  a,
  b,
  mode,
}: {
  a: string;
  b: string;
  mode: "left" | "right";
}) {
  const parts = getInlineParts(a, b);

  if (mode === "left") {
    return (
      <>
        {parts.prefixA}
        {parts.changedA ? (
          <mark className="bg-red-200/70 text-red-900 rounded px-0.5">
            {parts.changedA}
          </mark>
        ) : null}
        {parts.suffixA}
      </>
    );
  }

  return (
    <>
      {parts.prefixB}
      {parts.changedB ? (
        <mark className="bg-green-200/70 text-green-900 rounded px-0.5">
          {parts.changedB}
        </mark>
      ) : null}
      {parts.suffixB}
    </>
  );
}

export default function DiffPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [rows, setRows] = useState<DiffRow[]>([]);

  function handleCompare() {
    const aLines = textA.split("\n");
    const bLines = textB.split("\n");
    const ops = buildLineDiff(aLines, bLines);
    const merged = mergeOpsToRows(ops);
    setRows(merged);
  }

  function handleClear() {
    setTextA("");
    setTextB("");
    setRows([]);
  }

  const hasRealDiff =
    rows.length > 0 && rows.some((r) => r.kind !== "equal");

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/${lang}`} className="text-sm text-zinc-500">
            ← {dict.common.backToHome}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link
              href="/en/diff"
              className={`px-3 py-1 rounded-md ${
                lang === "en" ? "bg-black text-white" : "border"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/diff"
              className={`px-3 py-1 rounded-md ${
                lang === "zh" ? "bg-black text-white" : "border"
              }`}
            >
              中文
            </Link>
          </div>
        </div>

        <header className="mb-8">
          <p className="text-sm text-zinc-500 mb-2">Shuffle Lab</p >
          <h1 className="text-4xl font-bold">{dict.diffTool.title}</h1>
          <p className="text-zinc-600 mt-2">{dict.diffTool.subtitle}</p >
        </header>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <div>
            <label className="block mb-2 text-sm text-zinc-500">
              {dict.diffTool.inputA}
            </label>
            <textarea
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder={dict.diffTool.inputA}
              className="min-h-[300px] w-full rounded-2xl border border-zinc-200 p-4 font-mono text-sm outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-500">
              {dict.diffTool.inputB}
            </label>
            <textarea
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder={dict.diffTool.inputB}
              className="min-h-[300px] w-full rounded-2xl border border-zinc-200 p-4 font-mono text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={handleCompare}
            className="bg-black text-white px-5 py-2 rounded-xl"
          >
            {dict.diffTool.compare}
          </button>

          <button
            onClick={handleClear}
            className="border px-5 py-2 rounded-xl"
          >
            {dict.diffTool.clear}
          </button>
        </div>

        <div>
          <p className="text-sm text-zinc-500 mb-3">{dict.diffTool.result}</p >

          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            {!rows.length ? (
              <div className="p-4 text-sm text-zinc-400">
                {dict.diffTool.noDiff}
              </div>
            ) : !hasRealDiff ? (
              <div className="p-4 text-sm text-zinc-400">
                {dict.diffTool.noDiff}
              </div>
            ) : (
              <div className="grid grid-cols-2">
                <div className="border-r border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-500">
                  {dict.diffTool.inputA}
                </div>
                <div className="bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-500">
                  {dict.diffTool.inputB}
                </div>

                {rows.map((row, index) => {
                  if (row.kind === "equal") {
                    return (
                      <div key={index} className="contents">
                        <div className="border-t border-zinc-100 px-4 py-2 font-mono text-sm text-zinc-500 flex gap-3">
                          <span className="w-8 shrink-0 text-zinc-400">
                            {row.leftNo}
                          </span>
                          <span className="whitespace-pre-wrap break-words">
                            {row.a || " "}
                          </span>
                        </div>
                        <div className="border-t border-zinc-100 px-4 py-2 font-mono text-sm text-zinc-500 flex gap-3">
                          <span className="w-8 shrink-0 text-zinc-400">
                            {row.rightNo}
                          </span>
                          <span className="whitespace-pre-wrap break-words">
                            {row.b || " "}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  if (row.kind === "delete") {
                    return (
                      <div key={index} className="contents">
                        <div className="border-t border-zinc-100 bg-red-50 px-4 py-2 font-mono text-sm flex gap-3">
                          <span className="w-8 shrink-0 text-red-400">
                            {row.leftNo}
                          </span>
                          <span className="whitespace-pre-wrap break-words text-red-900">
                            {row.a || " "}
                          </span>
                        </div>
                        <div className="border-t border-zinc-100 px-4 py-2" />
                      </div>
                    );
                  }

                  if (row.kind === "insert") {
                    return (
                      <div key={index} className="contents">
                        <div className="border-t border-zinc-100 px-4 py-2" />
                        <div className="border-t border-zinc-100 bg-green-50 px-4 py-2 font-mono text-sm flex gap-3">
                          <span className="w-8 shrink-0 text-green-500">
                            {row.rightNo}
                          </span>
                          <span className="whitespace-pre-wrap break-words text-green-900">
                            {row.b || " "}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={index} className="contents">
                      <div className="border-t border-zinc-100 bg-red-50 px-4 py-2 font-mono text-sm flex gap-3">
                        <span className="w-8 shrink-0 text-red-400">
                          {row.leftNo}
                        </span>
                        <span className="whitespace-pre-wrap break-words text-red-900">
                          <InlineDiff a={row.a} b={row.b} mode="left" />
                        </span>
                      </div>
                      <div className="border-t border-zinc-100 bg-green-50 px-4 py-2 font-mono text-sm flex gap-3">
                        <span className="w-8 shrink-0 text-green-500">
                          {row.rightNo}
                        </span>
                        <span className="whitespace-pre-wrap break-words text-green-900">
                          <InlineDiff a={row.a} b={row.b} mode="right" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}