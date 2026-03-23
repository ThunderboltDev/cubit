import { ChevronDown, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type SelectItemData = {
  value: string;
  label: ReactNode;
};

type SelectContextType = {
  selectedValue: string | undefined;
  setSelected: (item: SelectItemData) => void;
  registerItem: (item: SelectItemData) => void;
  getLabel: () => ReactNode;
  isRegistering: boolean;
};

const SelectContext = createContext<SelectContextType | null>(null);

type SelectProviderProps = {
  value: string | undefined;
  onValueChange?: (value: string) => void;
  children: ReactNode;
};

export function SelectProvider({
  value,
  onValueChange,
  children,
}: SelectProviderProps) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const itemsRef = useRef<Map<string, ReactNode>>(new Map());
  const [, forceUpdate] = useState(0);

  const registerItem = ({ value, label }: SelectItemData) => {
    if (!itemsRef.current.has(value)) {
      itemsRef.current.set(value, label);
      forceUpdate((n) => n + 1);
    }
  };

  const setSelected = (item: SelectItemData) => {
    setSelectedValue(item.value);
    onValueChange?.(item.value);
  };

  const getLabel = () =>
    selectedValue ? itemsRef.current.get(selectedValue) : undefined;

  return (
    <SelectContext.Provider
      value={{
        selectedValue,
        setSelected,
        registerItem,
        getLabel,
        isRegistering: false,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

export function useSelect() {
  const context = useContext(SelectContext);
  if (!context)
    throw new Error("useSelect must be used within a SelectProvider");
  return context;
}

type SelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
} & Omit<ComponentProps<typeof DropdownMenu>, "children">;

export function Select({
  value,
  onValueChange,
  children,
  ...props
}: SelectProps) {
  return (
    <SelectProvider value={value} onValueChange={onValueChange}>
      <RegistrationPass>{children}</RegistrationPass>
      <DropdownMenu {...props}>{children}</DropdownMenu>
    </SelectProvider>
  );
}

function RegistrationPass({ children }: { children: ReactNode }) {
  return (
    <SelectContext.Consumer>
      {() => (
        <div hidden aria-hidden style={{ display: "none" }}>
          <RegistrationContext.Provider value={true}>
            {children}
          </RegistrationContext.Provider>
        </div>
      )}
    </SelectContext.Consumer>
  );
}

const RegistrationContext = createContext(false);

export function SelectTrigger({
  children,
  className,
  ...props
}: ComponentProps<typeof DropdownMenuTrigger>) {
  const isRegistering = useContext(RegistrationContext);
  if (isRegistering) return null;

  return (
    <DropdownMenuTrigger
      {...props}
      render={
        <Button
          className={cn(
            "text-foreground text-responsive! inline-flex gap-2 justify-between items-center px-6 min-w-0 whitespace-normal",
            className,
          )}
        />
      }
    >
      <span className="inline-flex items-center gap-2">{children}</span>
      <HugeiconsIcon className="text-muted-foreground" icon={ChevronDown} />
    </DropdownMenuTrigger>
  );
}

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({
  placeholder = "Select a value",
}: SelectValueProps) {
  const isRegistering = useContext(RegistrationContext);
  const { getLabel, selectedValue } = useSelect();
  if (isRegistering) return null;
  const label = getLabel();
  if (!selectedValue)
    return <span className="text-muted-foreground">{placeholder}</span>;
  return <>{label ?? selectedValue}</>;
}

export function SelectContent({
  children,
  className,
  ...props
}: ComponentProps<typeof DropdownMenuContent>) {
  const isRegistering = useContext(RegistrationContext);
  if (isRegistering) return <>{children}</>;
  return (
    <DropdownMenuContent className={cn("min-w-40", className)} {...props}>
      {children}
    </DropdownMenuContent>
  );
}

type SelectItemProps = {
  value: string;
} & ComponentProps<typeof DropdownMenuItem>;

export function SelectItem({
  value,
  children,
  className,
  ...props
}: SelectItemProps) {
  const { selectedValue, setSelected, registerItem } = useSelect();
  const isRegistering = useContext(RegistrationContext);

  registerItem({ value, label: children });

  if (isRegistering) return null;

  return (
    <DropdownMenuItem
      {...props}
      className={cn("justify-between w-full", className)}
      onClick={() => setSelected({ value, label: children })}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
      <HugeiconsIcon
        icon={Tick02Icon}
        className={cn(
          "size-5 text-accent shrink-0",
          selectedValue !== value && "invisible",
        )}
      />
    </DropdownMenuItem>
  );
}
