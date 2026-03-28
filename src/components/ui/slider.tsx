import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { sliderSound } from "@/data/sfx/slider";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

interface SliderProps extends SliderPrimitive.Root.Props {
  marks?: string[] | ((value: number) => string | undefined);
  withBadge?: boolean;
  formatBadge?: (value: number) => string;
  badgeWidth?: string;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  marks,
  withBadge = true,
  formatBadge = (value) => String(value),
  badgeWidth = "3rem",
  ...props
}: SliderProps) {
  const [play] = useSound(sliderSound);

  const trackRef = useRef<HTMLDivElement>(null);

  const _values: number[] = useMemo(
    () =>
      Array.isArray(value) ? value
      : Array.isArray(defaultValue) ? defaultValue
      : [min, max],
    [value, defaultValue, min, max],
  );

  const getMarkPosition = (markValue: number) => {
    const position = (markValue - min) / (max - min);
    const offset = position * 16;

    return `calc(${position * 100}% - ${offset}px)`;
  };

  const processedMarks = useMemo(() => {
    if (!marks) return null;

    if (typeof marks === "function") {
      const step = 1;
      const markValues: { value: number; label: string }[] = [];

      for (let i = min; i <= max; i += step) {
        const label = marks(i);
        if (label) {
          markValues.push({ value: i, label });
        }
      }

      return markValues;
    }

    return marks.map((v) => ({ value: v, label: String(v) }));
  }, [marks, min, max]);

  return (
    <div
      className={cn(
        "w-full flex flex-row gap-3 items-center",
        !marks && "-mt-2",
      )}
    >
      <div className="w-full">
        <SliderPrimitive.Root
          className={cn(
            "data-horizontal:w-full data-vertical:h-full cursor-pointer",
            className,
          )}
          data-slot="slider"
          defaultValue={defaultValue}
          value={value}
          min={min}
          max={max}
          thumbAlignment="edge"
          {...props}
          onValueChange={(value, e) => {
            const oldValue = Array.isArray(value) ? value[0] : value;

            if (_values[0] !== oldValue) play();

            props.onValueChange?.(value, e);
          }}
        >
          <SliderPrimitive.Control className="data-vertical:min-h-40 relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col">
            <SliderPrimitive.Track
              ref={trackRef}
              data-slot="slider-track"
              className="bg-inset rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 relative grow overflow-hidden select-none inset-shadow-sm shadows-inset"
            >
              <SliderPrimitive.Indicator
                data-slot="slider-range"
                className="size-4 bg-accent select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full inset-shadow-sm shadows-accent"
              />
            </SliderPrimitive.Track>
            {Array.from({ length: _values.length }, () => (
              <SliderPrimitive.Thumb
                data-slot="slider-thumb"
                key={crypto.randomUUID()}
                className="border-3 border-accent relative size-3.5 rounded-full shadow-xs inset-shadow-xs shadows-accent bg-white duration-200 transition-[color,box-shadow,transform,scale] after:absolute after:-inset-2 hover:scale-120 active:scale-95 block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50"
              />
            ))}
          </SliderPrimitive.Control>
        </SliderPrimitive.Root>
        {processedMarks && (
          <div className="relative mt-3 h-6 w-full">
            {processedMarks.map((mark, i) => {
              return (
                <span
                  key={mark.value}
                  className="absolute top-0 flex flex-col items-center gap-1 text-xs text-muted-foreground"
                  style={{
                    left: getMarkPosition(
                      typeof mark.value === "number" ? mark.value : i,
                    ),
                    transform: `translateX(calc(-50% + 8px))`,
                  }}
                >
                  <span className="block h-1 w-px bg-muted-foreground" />
                  {mark.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
      {withBadge && (
        <Badge
          className={cn(
            "shrink-0 justify-center self-start font-mono",
            marks && "-mt-2",
          )}
          style={{ width: badgeWidth }}
        >
          {formatBadge(_values[0])}
        </Badge>
      )}
    </div>
  );
}

export { Slider };
