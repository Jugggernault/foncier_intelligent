import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import type { Parcel } from "@/lib/data/types";
import { fmtArea, rightLabel } from "@/lib/labels";
import { assess } from "@/lib/risk";
import { cn } from "@/lib/utils";
import { LEVEL } from "./verdict";

/** Ligne de liste cliquable : verdict, NUP, localisation. */
export function ParcelRow({ parcel, href, aside }: { parcel: Parcel; href?: string; aside?: React.ReactNode }) {
  const r = assess(parcel);
  const Icon = LEVEL[r.level].icon;
  return (
    <Item variant="outline" className="bg-card" render={<Link href={href ?? `/parcelle/${parcel.nup}`} />}>
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-md", LEVEL[r.level].soft)} aria-label={`Verdict ${LEVEL[r.level].label}`}>
        <Icon className="size-5" />
      </span>
      <ItemContent>
        <ItemTitle className="tabular font-display text-base font-bold tracking-[0.03em] text-navy">{parcel.nup}</ItemTitle>
        <ItemDescription>
          {[...new Set([parcel.quartier, parcel.commune])].join(", ")} · {fmtArea(parcel.areaM2)} · {rightLabel(parcel)}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="gap-3 text-right">
        {aside}
        <ChevronRightIcon className="size-4 text-muted-foreground" />
      </ItemActions>
    </Item>
  );
}
