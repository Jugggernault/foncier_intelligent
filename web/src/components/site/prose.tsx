import { cn } from "@/lib/utils";

/** Mise en forme des pages de lecture (à propos, charte, mentions). */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto max-w-3xl px-4 py-12 leading-relaxed sm:px-6 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-navy [&_h2:first-child]:mt-0 [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:marker:text-navy [&_a]:font-medium [&_a]:text-navy [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-sky [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
