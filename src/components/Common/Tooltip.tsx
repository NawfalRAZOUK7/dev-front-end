import React from "react";
import { Tooltip as MantineTooltip, type TooltipProps } from "@mantine/core";

type TooltipPropsExtended = TooltipProps & {
  label: React.ReactNode; // Tooltip content
  children: React.ReactElement; // Element to wrap with tooltip
};

/**
 * Tooltip component wrapping Mantine Tooltip.
 * Usage: <Tooltip label="Info"><Button>Click me</Button></Tooltip>
 */
export default function Tooltip({ label, children, ...props }: TooltipPropsExtended) {
  return (
    <MantineTooltip label={label} withArrow {...props}>
      {children}
    </MantineTooltip>
  );
}
