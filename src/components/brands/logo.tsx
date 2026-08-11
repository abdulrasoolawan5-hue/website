import sujaagHariLogo from "@/assets/sujaag-hari-logo.jpg";

export function Logo({ className = "size-10" }: { className?: string }) {
  return (
    <img
      src={sujaagHariLogo}
      alt="Sujaag Hari logo"
      className={`${className} rounded-full object-cover ring-1 ring-border shadow-soft`}
      loading="eager"
      decoding="async"
    />
  );
}

export function LogoLockup() {
  return (
    <div className="flex items-center gap-2.5">
      <Logo className="size-9" />
      <div className="leading-tight">
        <div className="font-display text-[15px] font-bold tracking-tight text-navy dark:text-foreground">
          Sujaag Hari
        </div>
        <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Agentic AI · Agriculture
        </div>
      </div>
    </div>
  );
}
