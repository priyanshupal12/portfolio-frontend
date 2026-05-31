export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const title = decodedSlug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3efe4] px-6 py-8 text-[#1c1912]">
      <div className="absolute left-[-12rem] top-[-10rem] h-96 w-96 rounded-full bg-[#f6b84b]/45 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[#214f45]/25 blur-3xl" />

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <div className="w-full rounded-[2rem] border border-[#1c1912]/10 bg-white/55 p-6 shadow-2xl shadow-[#806537]/15 backdrop-blur md:p-10">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <span className="rounded-full border border-[#1c1912]/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em]">
              Dynamic Route
            </span>
            <span className="rounded-full bg-[#214f45] px-4 py-2 text-sm font-medium text-[#f8f2df]">
              /{decodedSlug}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#9b6a1f]">
                Current slug
              </p>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-[#1c1912] md:text-7xl">
                {title || decodedSlug}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4f493c]">
                This page is rendered from your dynamic{" "}
                <code className="rounded-md bg-[#1c1912]/10 px-2 py-1 text-sm">
                  [slug]
                </code>{" "}
                route, so each URL can become its own focused landing page.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-[#1c1912] p-5 text-[#f8f2df]">
              <p className="text-sm uppercase tracking-[0.25em] text-[#f6b84b]">
                Raw value
              </p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5 font-mono text-2xl break-words">
                {decodedSlug}
              </div>
              <p className="mt-5 text-sm leading-6 text-[#d8cfba]">
                Try changing the URL after the domain, like{" "}
                <span className="font-mono text-[#f6b84b]">/about-us</span> or{" "}
                <span className="font-mono text-[#f6b84b]">/hello-world</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
