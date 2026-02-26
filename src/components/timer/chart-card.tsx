import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/lib/constants";
import { formatTime } from "@/lib/format-time";

function getChartTitle(config: ChartConfig): string {
  switch (config.type) {
    case "solves":
      return `Last ${config.n} Solves`;
    case "average":
      return `Average of ${config.n}`;
    case "mean":
      return `Mean of ${config.n}`;
    case "consistency":
      return `Consistency (SD) of ${config.n}`;
    case "inspection":
      return `Inspection Time (Last ${config.n})`;
    case "multiphase":
      return `Phase ${config.phase} (Last ${config.n})`;
    default:
      return "Unknown Chart";
  }
}

function getValueLabel(config: ChartConfig): string {
  if (config.type === "solves") return "Time";
  if (config.type === "average") return `Ao${config.n}`;
  if (config.type === "mean") return `Mo${config.n}`;
  if (config.type === "consistency") return "SD";
  if (config.type === "inspection") return "Inspection";
  if (config.type === "multiphase") return `Phase ${config.phase}`;
  return "Value";
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number | null }>;
  label?: number;
  config: ChartConfig;
}

function ChartTooltip({ active, payload, label, config }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const val = payload[0].value;
  const valueLabel = getValueLabel(config);

  return (
    <div className="rounded-xl border border-border bg-muted p-3 shadow-md text-sm min-w-[124px]">
      <div className="font-semibold mb-2 text-foreground">Solve #{label}</div>
      <div className="flex justify-between items-center gap-6">
        <span className="text-muted-foreground">{valueLabel}</span>
        <span className="font-mono font-bold text-foreground">
          {val === null ? "DNF" : formatTime(val, 2)}
        </span>
      </div>
    </div>
  );
}

interface ChartCardProps {
  config: ChartConfig;
  data: Array<{ index: number; value: number | null }>;
  hasData: boolean;
  onEdit: () => void;
}

export function ChartCard({ config, data, hasData, onEdit }: ChartCardProps) {
  return (
    <div>
      <Card className="overflow-hidden transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            {getChartTitle(config)}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <HugeiconsIcon icon={Edit02Icon} className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {hasData ?
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="4 4"
                    stroke="var(--color-border)"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="index"
                    tick={{
                      fontSize: 11,
                      fill: "var(--color-muted-foreground)",
                    }}
                    stroke="transparent"
                  />
                  <YAxis
                    tickFormatter={(v: number) => (v / 1000).toFixed(1)}
                    tick={{
                      fontSize: 11,
                      fill: "var(--color-muted-foreground)",
                    }}
                    stroke="transparent"
                    width={45}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    cursor={{
                      stroke: "var(--color-accent)",
                      strokeWidth: 2,
                    }}
                    content={(props) => (
                      <ChartTooltip
                        active={props.active}
                        payload={
                          props.payload as Array<{ value: number | null }>
                        }
                        label={props.label as number}
                        config={config}
                      />
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-accent)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 6,
                      strokeWidth: 0,
                      fill: "var(--color-accent)",
                    }}
                    connectNulls
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          : <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
              Not enough data to display this chart.
            </div>
          }
        </CardBody>
      </Card>
    </div>
  );
}
