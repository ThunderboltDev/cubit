import { motion } from "framer-motion";
import type {
  Attributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";
import { Children, cloneElement, isValidElement, useId } from "react";
import {
  FieldDescription,
  FieldGroup,
  FieldItem,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

const itemVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.15,
    },
  },
};

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <FieldGroup className="gap-0">
      <motion.div variants={itemVariants}>
        <FieldLegend
          variant="label"
          className="px-1 font-bold uppercase tracking-wider text-muted-foreground"
        >
          {title}
        </FieldLegend>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="rounded-xl bg-secondary border border-border shadow-md overflow-hidden"
      >
        {children}
      </motion.div>
    </FieldGroup>
  );
}

interface SettingsItemProps {
  label: string;
  description?: string;
  children: ReactNode;
  orientation?: "vertical" | "horizontal" | "responsive";
  disabled?: boolean;
}

export function SettingsItem({
  label,
  description,
  children,
  orientation = "horizontal",
  disabled,
}: SettingsItemProps) {
  const generatedId = useId();
  const controlId = `${generatedId}-control`;

  const labeledChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    if (isInputElement(child)) {
      return cloneElement(child, { id: controlId } as Attributes);
    }

    const deepInput = findInputElement(child);
    if (deepInput) {
      return cloneWithId(child, controlId);
    }

    return child;
  });

  return (
    <motion.div variants={itemVariants}>
      <FieldSet
        className={cn(
          disabled &&
            "transition-opacity duration-200 ease-in-out opacity-50 cursor-not-allowed",
        )}
        disabled={disabled}
        aria-disabled={disabled}
      >
        <FieldItem
          orientation={orientation}
          className={cn(
            "py-3 px-4 items-center justify-between",
            orientation === "vertical" && "items-stretch pb-4 gap-3",
          )}
          disabled={disabled}
        >
          <div className={cn(disabled && "pointer-events-none select-none")}>
            <FieldLabel
              htmlFor={controlId}
              className={cn(disabled && "cursor-default")}
            >
              {label}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </div>
          <div
            className={cn(
              "relative",
              disabled && "pointer-events-none select-none",
            )}
          >
            {labeledChildren}
            {disabled && (
              <div
                className="absolute inset-0 cursor-not-allowed"
                aria-hidden="true"
              />
            )}
          </div>
        </FieldItem>
      </FieldSet>
    </motion.div>
  );
}

function hasChildren(
  element: ReactElement,
): element is ReactElement<PropsWithChildren> {
  return "children" in (element.props as object);
}

function getProps(element: ReactElement): Record<string, unknown> {
  return element.props as Record<string, unknown>;
}

function isInputElement(child: ReactNode): child is ReactElement {
  if (!isValidElement(child)) return false;
  const type = child.type;
  if (typeof type === "string") {
    return ["input", "select", "textarea"].includes(type);
  }
  const typeObj = type as { displayName?: string; name?: string };
  const displayName = typeObj.displayName;
  const name = typeObj.name;
  return (
    !!displayName?.match(
      /^(Input|Select|Switch|Slider|Textarea|Checkbox|Radio)/i,
    ) || !!name?.match(/^(Input|Select|Switch|Slider|Textarea|Checkbox|Radio)/i)
  );
}

function findInputElement(children: ReactNode): ReactElement | null {
  let found: ReactElement | null = null;

  Children.forEach(children, (child) => {
    if (found) return;
    if (isInputElement(child)) {
      found = child;
    } else if (isValidElement(child) && hasChildren(child)) {
      const childProps = getProps(child);
      found = findInputElement(childProps.children as ReactNode);
    }
  });

  return found;
}

function cloneWithId(element: ReactElement, id: string): ReactElement {
  const elementProps = getProps(element);
  const newProps: Record<string, unknown> = { id };

  if (hasChildren(element)) {
    const childInput = findInputElement(elementProps.children as ReactNode);
    if (childInput) {
      newProps.children = Children.map(elementProps.children, (child) => {
        if (child === childInput) {
          return cloneElement(childInput, { id } as Attributes);
        }
        if (isValidElement(child) && hasChildren(child)) {
          return cloneWithId(child, id);
        }
        return child;
      });
    }
  }

  return cloneElement(element, { ...elementProps, ...newProps });
}
