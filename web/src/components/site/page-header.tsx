import { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

/** En-tête des pages publiques secondaires : fil d'Ariane, titre, chapeau, actions. */
export function PageHeader({
  title,
  lead,
  crumbs = [],
  children,
  className,
}: {
  title: string;
  lead?: string;
  crumbs?: [label: string, href?: string][];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("bg-sky", className)}>
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.map(([label, href]) => (
              <Fragment key={label}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {href ? <BreadcrumbLink render={<Link href={href} />}>{label}</BreadcrumbLink> : <BreadcrumbPage>{label}</BreadcrumbPage>}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] font-extrabold text-navy">{title}</h1>
            {lead && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{lead}</p>}
          </div>
          {children}
        </div>
      </div>
    </header>
  );
}
