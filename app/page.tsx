export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Shuffle Lab
          </p >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Small tools for curious minds.
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            为好奇的人做的小工具。
          </p >
        </header>

        <section className="mb-12 grid gap-4 sm:grid-cols-2">
          <a
            href=" "
            className="rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm"
          >
            <h2 className="text-xl font-semibold">Word Counter</h2>
            <p className="mt-2 text-zinc-600">字数统计工具</p >
          </a >

          <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-zinc-400">
            <h2 className="text-xl font-semibold">More tools coming soon</h2>
            <p className="mt-2">更多工具正在路上</p >
          </div>
        </section>

        <footer className="border-t border-zinc-200 pt-6 text-sm text-zinc-500">
          <p>Built for the web. Built step by step.</p >
        </footer>
      </div>
    </main>
  );
}