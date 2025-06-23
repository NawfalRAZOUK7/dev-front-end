import React from "react";
import { ActionIcon, type ActionIconProps } from "@mantine/core";
import styles from "../StylesCSS/AnimatedButton.module.css";

export type IconButtonProps = ActionIconProps & {
  label: string; // for accessibility (aria-label)
  icon: React.ReactNode;
  animated?: boolean;
  onClick?: () => void;
};

/**
 * IconButton component: clickable icon with accessible label.
 * Wraps Mantine ActionIcon with aria-label for screen readers.
 * Supports optional animations via the animated prop.
 * Can be used in pagination, forms, and any other components.
 */
export default function IconButton({ 
  label, 
  icon, 
  animated = false,
  onClick,
  className,
  ...props 
}: IconButtonProps) {
  const iconClassName = animated 
    ? `${styles.animatedIconBtn} ${className || ""}`.trim()
    : className;

  return (
    <ActionIcon 
      aria-label={label} 
      className={iconClassName}
      onClick={onClick}
      {...props}
    >
      {icon}
    </ActionIcon>
  );
}