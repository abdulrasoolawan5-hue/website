const partners = [
  "Ministry of Food Security",
  "PARC",
  "UAF Faisalabad",
  "Sindh Agri. Dept.",
  "Akhuwat Foundation",
  "FAO Pakistan",
];

export function TrustedBy() {
  return (
    <section className="border-y border-border/60 bg-secondary/40 py-10">
      <div className="container-page">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Built with & for the agriculture ecosystem
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p) => (
            <div
              key={p}
              className="flex h-14 items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90 transition-colors hover:text-foreground"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
