// -------------------------------------------------
// Projet   : razouk-nawfal-app
// Fichier  : AnimatedCard.tsx
// Auteur   : Nawfal Razouk
// Usage    : Card Mantine animée générique avec option d'animation
// -------------------------------------------------

import React from "react";
import { Card, type CardProps, useMantineTheme, useMantineColorScheme } from "@mantine/core";
import styles from "../StylesCSS/AnimatedCard.module.css";

export type AnimatedCardProps = CardProps & {
  animated?: boolean;
  hoverEffect?: "lift" | "scale" | "glow" | "shadow" | "none";
  animationDuration?: number;
  children: React.ReactNode;
};

/**
 * AnimatedCard component with optional hover animations.
 * Extends Mantine Card with smooth transitions and theme-aware styling.
 */
export default function AnimatedCard({ 
  children, 
  className, 
  style, 
  animated = false,
  hoverEffect = "lift",
  animationDuration = 300,
  ...props 
}: AnimatedCardProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Generate CSS class names based on animation settings
  const getAnimationClasses = () => {
    if (!animated) return "";
    
    const baseClass = styles.animatedCard;
    const effectClass = styles[`effect${hoverEffect.charAt(0).toUpperCase() + hoverEffect.slice(1)}`];
    
    return `${baseClass} ${effectClass || ""}`.trim();
  };

  // Merge styles with theme-aware defaults
  const mergedStyle: React.CSSProperties = {
    // Base card styling
    boxShadow: theme.shadows.md,
    backgroundColor: colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    borderColor: colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3],
    
    // Animation duration (CSS custom property)
    ...(animated && {
      "--animation-duration": `${animationDuration}ms`,
    } as React.CSSProperties),
    
    // User provided styles
    ...(style && typeof style === "object" && !Array.isArray(style) ? style : {}),
  };

  // Combine class names
  const combinedClassName = [
    getAnimationClasses(),
    className || ""
  ].filter(Boolean).join(" ");

  return (
    <Card
      {...props}
      className={combinedClassName}
      style={mergedStyle}
    >
      {children}
    </Card>
  );
}
