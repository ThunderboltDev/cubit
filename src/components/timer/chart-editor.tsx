import { Delete02Icon, Plus, Save } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  FieldDescription,
  FieldGroup,
  FieldItem,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SheetAction,
  SheetBody,
  SheetCancel,
  SheetFooter,
} from "@/components/ui/sheet";
import type { ChartConfig, ChartType } from "@/lib/constants";

interface ChartEditorProps {
  initialConfig: ChartConfig;
  isNew: boolean;
  onSave: (config: ChartConfig) => void;
  onCancel: () => void;
  onDelete?: () => void;
  puzzleFeatures: {
    inspection: boolean;
    multiphase: boolean;
    phaseCount: number;
  };
}

export function ChartEditor({
  initialConfig,
  isNew,
  onSave,
  onCancel,
  onDelete,
  puzzleFeatures,
}: ChartEditorProps) {
  const [config, setConfig] = useState<ChartConfig>(initialConfig);

  return (
    <>
      <SheetBody>
        <FieldGroup>
          <FieldItem orientation="horizontal">
            <div>
              <FieldLabel>Chart Type</FieldLabel>
              <FieldDescription>
                What type of data to represent
              </FieldDescription>
            </div>
            <div>
              <Select
                value={config.type}
                onValueChange={(v) =>
                  setConfig((prev) => ({ ...prev, type: v as ChartType }))
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="solves">Solves</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="mean">Mean</SelectItem>
                  <SelectItem value="consistency">Consistency</SelectItem>
                  {puzzleFeatures.inspection && (
                    <SelectItem value="inspection">Inspection Time</SelectItem>
                  )}
                  {puzzleFeatures.multiphase && (
                    <SelectItem value="multiphase">Phase Time</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </FieldItem>

          <FieldItem orientation="horizontal">
            <div>
              <FieldLabel>Number of Solves to Show</FieldLabel>
              <FieldDescription>
                How many recent solves to display on the chart.
              </FieldDescription>
            </div>
            <Input
              type="number"
              className="ml-auto w-20"
              min={10}
              max={1000}
              value={config.n}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setConfig((prev) => ({
                  ...prev,
                  n: Number.isNaN(val) ? 0 : val,
                }));
              }}
              onBlur={() => {
                if (!config.n || Number(config.n) < 10) {
                  setConfig((prev) => ({ ...prev, n: 10 }));
                }
              }}
            />
          </FieldItem>

          {config.type === "multiphase" && (
            <FieldItem>
              <FieldLabel>Phase Number</FieldLabel>
              <Select
                value={String(config.phase ?? 1)}
                onValueChange={(v) =>
                  setConfig((prev) => ({ ...prev, phase: Number(v) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: puzzleFeatures.phaseCount }).map(
                    (_, i) => (
                      <SelectItem
                        key={crypto.randomUUID()}
                        value={String(i + 1)}
                      >
                        Phase {i + 1}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </FieldItem>
          )}
        </FieldGroup>
      </SheetBody>

      <SheetFooter className="justify-between items-center w-full flex-row">
        {!isNew ?
          <AlertDialog>
            <AlertDialogTrigger variant="danger">
              <HugeiconsIcon icon={Delete02Icon} /> Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Chart</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this chart? This cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel />
                <AlertDialogAction onClick={onDelete} variant="danger">
                  <HugeiconsIcon icon={Delete02Icon} /> Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        : <div />}
        <div className="flex gap-2">
          <SheetCancel onClick={onCancel} />
          <SheetAction
            variant={isNew ? "accent" : "success"}
            onClick={() => onSave(config)}
          >
            <HugeiconsIcon icon={isNew ? Plus : Save} />
            {isNew ? "Add Chart" : "Save Changes"}
          </SheetAction>
        </div>
      </SheetFooter>
    </>
  );
}
