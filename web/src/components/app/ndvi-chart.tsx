"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const config = { ndvi: { label: "NDVI", color: "var(--chart-4)" } } satisfies ChartConfig;
const YEARS = [2020, 2021, 2022, 2023, 2024];

export function NdviChart({ values, expected, years = YEARS }: { values: number[]; expected: number; years?: number[] }) {
  const data = values.map((v, i) => ({ year: String(years[i]), ndvi: v }));
  return (
    <ChartContainer config={config} className="mt-4 aspect-[16/9] w-full">
      <LineChart data={data} margin={{ left: 0, right: 12, top: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="year" tickLine={false} axisLine={false} />
        <YAxis domain={[0, 1]} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ReferenceLine y={expected} stroke="var(--risk-caution)" strokeDasharray="4 4" label={{ value: "Attendu", position: "insideTopRight", fontSize: 11 }} />
        <Line dataKey="ndvi" stroke="var(--color-ndvi)" strokeWidth={2.5} dot />
      </LineChart>
    </ChartContainer>
  );
}
