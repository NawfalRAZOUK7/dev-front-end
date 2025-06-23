import React from "react";
import { Button as MantineButton, type ButtonProps as MantineButtonProps } from "@mantine/core";
import styles from "../StylesCSS/AnimatedButton.module.css";

export type ButtonProps = Omit<MantineButtonProps, 'type'> & {
  loading?: boolean;
  animated?: boolean;
  htmlType?: "submit" | "button" | "reset";
  onClick?: () => void;
};

/**
 * Basic reusable Button component wrapping Mantine Button.
 * Supports optional animations via the animated prop.
 * Can be used in forms, pagination, and any other components.
 */
export default function Button({ 
  loading = false, 
  disabled, 
  animated = false,
  htmlType,
  onClick,
  className,
  children, 
  ...props 
}: ButtonProps) {
  const buttonClassName = animated 
    ? `${styles.animatedBtn} ${className || ""}`.trim()
    : className;

  return (
    <MantineButton 
      disabled={disabled || loading} 
      loading={loading}
      type={htmlType}
      onClick={onClick}
      className={buttonClassName}
      {...props}
    >
      {children}
    </MantineButton>
  );
}