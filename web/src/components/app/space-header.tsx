/** Titre de page dans un espace connecté. */
export function SpaceHeader({ title, lead, children }: { title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 px-4 pt-8 pb-6 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-extrabold text-navy">{title}</h1>
        {lead && <p className="mt-2 text-muted-foreground">{lead}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function SpaceBody({ children }: { children: React.ReactNode }) {
  return <div className="px-4 pb-16 sm:px-6 lg:px-8">{children}</div>;
}
