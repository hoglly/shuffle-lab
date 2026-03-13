import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">
          Shuffle Lab
        </p >

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Choose your language
        </h1>

        <p className="mt-4 text-zinc-600">
          Select a language to enter Shuffle Lab.
        </p >

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/en"
            className="rounded-xl border border-zinc-300 px-5 py-3 transition hover:border-zinc-500 hover:bg-zinc-50"
          >
            English
          </Link>

          <Link
            href="/zh"
            className="rounded-xl border border-zinc-300 px-5 py-3 transition hover:border-zinc-500 hover:bg-zinc-50"
          >
            中文
          </Link>

          <button
            disabled
            className="cursor-not-allowed rounded-xl border border-zinc-200 px-5 py-3 text-zinc-400"
          >
            ไทย · Coming Soon
          </button>

          <button
            disabled
            className="cursor-not-allowed rounded-xl border border-zinc-200 px-5 py-3 text-zinc-400"
          >
            日本語 · Coming Soon
          </button>
        </div>
      </div>
    </main>
  );
}