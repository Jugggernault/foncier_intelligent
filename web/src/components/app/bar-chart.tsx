"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

/** Histogramme simple (une série) aux couleurs du thème. */
export function SimpleBarChart({ data, label, className }: { data: { name: string; value: number }[]; label: string; className?: string }) {
  const config = { value: { label, color: "var(--chart-1)" } } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className={className ?? "aspect-[16/9] w-full"}>
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} interval={0} />
        <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
