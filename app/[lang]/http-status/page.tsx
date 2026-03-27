"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

const STATUS_MAP: Record<
  number,
  { title: string; descEn: string; descZh: string }
> = {
  200: {
    title: "OK",
    descEn: "Request succeeded",
    descZh: "请求成功，服务器已返回所请求的数据",
  },
  301: {
    title: "Moved Permanently",
    descEn: "Resource moved to a new URL",
    descZh: "资源已永久移动到新的地址",
  },
  400: {
    title: "Bad Request",
    descEn: "Invalid request syntax",
    descZh: "请求格式错误，服务器无法理解",
  },
  401: {
    title: "Unauthorized",
    descEn: "Authentication required",
    descZh: "需要身份验证，未授权访问",
  },
  403: {
    title: "Forbidden",
    descEn: "Access denied",
    descZh: "服务器拒绝访问该资源",
  },
  404: {
    title: "Not Found",
    descEn: "Resource not found",
    descZh: "资源未找到，可能是 URL 错误或资源不存在",
  },
  418: {
    title: "I'm a teapot",
    descEn: "Server refuses to brew coffee",
    descZh: "服务器拒绝煮咖啡（彩蛋状态码）",
  },
  500: {
    title: "Internal Server Error",
    descEn: "Server encountered an error",
    descZh: "服务器内部错误，处理请求时发生异常",
  },
  502: {
    title: "Bad Gateway",
    descEn: "Invalid response from upstream server",
    descZh: "网关或代理服务器收到无效响应",
  },
  503: {
    title: "Service Unavailable",
    descEn: "Server temporarily unavailable",
    descZh: "服务器暂时不可用，通常是过载或维护中",
  },
};

export default function HttpStatusPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [code, setCode] = useState("");
  const [result, setResult] = useState<{
    title: string;
    descEn: string;
    descZh: string;
  } | null>(null);
  const [error, setError] = useState("");

  function handleLookup() {
    const trimmed = code.trim();
    const num = Number(trimmed);

    if (!trimmed || !Number.isInteger(num)) {
      setResult(null);
      setError(dict.httpStatusTool.notFound);
      return;
    }

    if (STATUS_MAP[num]) {
      setResult(STATUS_MAP[num]);
      setError("");
    } else {
      setResult(null);
      setError(dict.httpStatusTool.notFound);
    }
  }

  function handleClear() {
    setCode("");
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/${lang}`} className="text-sm text-zinc-500">
            ← {dict.common.backToHome}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link
              href="/en/http-status"
              className={`px-3 py-1 rounded-md ${
                lang === "en" ? "bg-black text-white" : "border"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/http-status"
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
          <h1 className="text-4xl font-bold">{dict.httpStatusTool.title}</h1>
          <p className="text-zinc-600 mt-2">{dict.httpStatusTool.subtitle}</p >
        </header>

        <div className="flex gap-3 mb-6">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setResult(null);
              setError("");
            }}
            placeholder={dict.httpStatusTool.placeholder}
            className="border rounded-xl px-4 py-2 w-64"
          />

          <button
            onClick={handleLookup}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            {dict.httpStatusTool.lookup}
          </button>

          <button
            onClick={handleClear}
            className="border px-4 py-2 rounded-xl"
          >
            {dict.httpStatusTool.clear}
          </button>
        </div>

        <div className="border rounded-2xl p-4 min-h-[100px]">
          {error && <p className="text-red-500">{error}</p >}

          {result && (
            <div>
              <p className="text-lg font-semibold">
                {Number(code)} {result.title}
              </p >
              <p className="text-zinc-600 mt-2">
                {lang === "zh" ? result.descZh : result.descEn}
              </p >
            </div>
          )}
        </div>
      </div>
    </main>
  );
}