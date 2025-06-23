// -------------------------------------------------
// Projet   : razouk-nawfal-app
// Fichier  : ThemeSwitcher.tsx
// Auteur   : Nawfal Razouk
// Usage    : Composant switch dark/light mode générique Mantine
// -------------------------------------------------
import React from "react";
import { 
  useMantineColorScheme, 
  useMantineTheme, 
  Group, 
  SegmentedControl, 
  Text,
  Box,
  Menu,
  type GroupProps 
} from "@mantine/core";
import {
  IconSun,
  IconMoon,
  IconDeviceDesktop,
  IconCheck,
  IconSettings
} from "@tabler/icons-react";
import Button, { type ButtonProps } from "./Button";
import IconButton, { type IconButtonProps } from "./IconButton";

export type ThemeSwitcherMode = "icon-only" | "button" | "segmented" | "dropdown";

export type ThemeSwitcherProps = {
  // Display mode
  mode?: ThemeSwitcherMode;
  
  // Content options
  showLabel?: boolean;
  showSystemOption?: boolean;
  label?: string;
  
  // Icon customization
  lightIcon?: React.ReactNode;
  darkIcon?: React.ReactNode;
  systemIcon?: React.ReactNode;
  
  // Styling
  animated?: boolean;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  
  // Icon button specific (for icon-only mode)
  iconButtonSize?: IconButtonProps["size"];
  iconButtonVariant?: IconButtonProps["variant"];
  iconButtonColor?: IconButtonProps["color"];
  
  // Layout
  orientation?: "horizontal" | "vertical";
  spacing?: GroupProps["gap"];
  
  // Labels for accessibility and display
  labels?: {
    light?: string;
    dark?: string;
    system?: string;
    toggle?: string;
    menu?: string;
  };
  
  // Event handlers
  onChange?: (colorScheme: "light" | "dark" | "auto") => void;
  
  // Container props
  containerProps?: GroupProps;
} & Omit<GroupProps, "children">;

/**
 * ThemeSwitcher component for toggling between light/dark themes.
 * Built with Button, IconButton, and supports multiple display modes.
 */
export default function ThemeSwitcher({
  // Display mode
  mode = "icon-only",
  
  // Content options
  showLabel = false,
  showSystemOption = true,
  label = "Theme",
  
  // Icon customization
  lightIcon = <IconSun size={16} />,
  darkIcon = <IconMoon size={16} />,
  systemIcon = <IconDeviceDesktop size={16} />,
  
  // Styling
  animated = false,
  size = "sm",
  variant = "light",
  color,
  
  // Icon button specific
  iconButtonSize,
  iconButtonVariant,
  iconButtonColor,
  
  // Layout
  orientation = "horizontal",
  spacing = "xs",
  
  // Labels
  labels = {},
  
  // Event handlers
  onChange,
  
  // Container props
  containerProps,
  
  ...groupProps
}: ThemeSwitcherProps) {
  
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  
  const {
    light = "Light",
    dark = "Dark",
    system = "System",
    toggle = "Toggle theme",
    menu = "Theme options"
  } = labels;
  
  // Handle theme change
  const handleThemeChange = (newScheme: "light" | "dark" | "auto") => {
    setColorScheme(newScheme);
    onChange?.(newScheme);
  };
  
  // Get current theme info
  const getCurrentTheme = () => {
    switch (colorScheme) {
      case "light": return { icon: lightIcon, label: light, key: "light" };
      case "dark": return { icon: darkIcon, label: dark, key: "dark" };
      case "auto": return { icon: systemIcon, label: system, key: "auto" };
      default: return { icon: lightIcon, label: light, key: "light" };
    }
  };
  
  const currentTheme = getCurrentTheme();
  
  // Icon-only mode - simple toggle button
  const renderIconOnly = () => {
    const toggleToNext = () => {
      if (showSystemOption) {
        const nextScheme = colorScheme === "light" ? "dark" : colorScheme === "dark" ? "auto" : "light";
        handleThemeChange(nextScheme);
      } else {
        const nextScheme = colorScheme === "light" ? "dark" : "light";
        handleThemeChange(nextScheme as "light" | "dark");
      }
    };
    
    return (
      <IconButton
        icon={currentTheme.icon}
        label={`${toggle} (${currentTheme.label})`}
        size={iconButtonSize || size}
        variant={iconButtonVariant || variant}
        color={iconButtonColor || color}
        animated={animated}
        onClick={toggleToNext}
      />
    );
  };
  
  // Button mode - button with icon and optional text
  const renderButton = () => {
    const toggleToNext = () => {
      if (showSystemOption) {
        const nextScheme = colorScheme === "light" ? "dark" : colorScheme === "dark" ? "auto" : "light";
        handleThemeChange(nextScheme);
      } else {
        const nextScheme = colorScheme === "light" ? "dark" : "light";
        handleThemeChange(nextScheme as "light" | "dark");
      }
    };
    
    return (
      <Button
        size={size}
        variant={variant}
        color={color}
        animated={animated}
        onClick={toggleToNext}
        leftSection={currentTheme.icon}
      >
        {showLabel ? `${label}: ${currentTheme.label}` : currentTheme.label}
      </Button>
    );
  };
  
  // Segmented control mode
  const renderSegmented = () => {
    const data = [
      { label: light, value: "light" },
      { label: dark, value: "dark" },
      ...(showSystemOption ? [{ label: system, value: "auto" }] : [])
    ];
    
    return (
      <Group gap={spacing} align="center">
        {showLabel && <Text size="sm" fw={500}>{label}:</Text>}
        <SegmentedControl
          value={colorScheme}
          onChange={(value) => handleThemeChange(value as "light" | "dark" | "auto")}
          data={data}
          size={size}
        />
      </Group>
    );
  };
  
  // Dropdown menu mode
  const renderDropdown = () => {
    const themeOptions = [
      { key: "light", icon: lightIcon, label: light },
      { key: "dark", icon: darkIcon, label: dark },
      ...(showSystemOption ? [{ key: "auto", icon: systemIcon, label: system }] : [])
    ];
    
    return (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button
            size={size}
            variant={variant}
            color={color}
            animated={animated}
            leftSection={currentTheme.icon}
            rightSection={<IconSettings size={14} />}
          >
            {showLabel ? `${label}: ${currentTheme.label}` : currentTheme.label}
          </Button>
        </Menu.Target>
        
        <Menu.Dropdown>
          <Menu.Label>{menu}</Menu.Label>
          {themeOptions.map((option) => (
            <Menu.Item
              key={option.key}
              leftSection={option.icon}
              rightSection={colorScheme === option.key ? <IconCheck size={16} /> : null}
              onClick={() => handleThemeChange(option.key as "light" | "dark" | "auto")}
            >
              {option.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    );
  };
  
  // Color indicator (optional enhancement)
  const renderColorIndicator = () => {
    if (!color) return null;
    
    return (
      <Box
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: theme.colors[color]?.[6] || color,
          flexShrink: 0
        }}
      />
    );
  };
  
  // Main render function
  const renderThemeSwitcher = () => {
    switch (mode) {
      case "button":
        return renderButton();
      case "segmented":
        return renderSegmented();
      case "dropdown":
        return renderDropdown();
      case "icon-only":
      default:
        return renderIconOnly();
    }
  };
  
  // Wrapper for layout control
  const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
    if (mode === "segmented" || mode === "dropdown") {
      return <>{children}</>;
    }
    
    return (
      <Group
        gap={spacing}
        align="center"
        {...(orientation === "vertical" ? { style: { flexDirection: "column" } } : {})}
        {...containerProps}
        {...groupProps}
      >
        {showLabel && mode !== "icon-only" && (
          <Group gap="xs" align="center">
            <Text size="sm" fw={500}>{label}:</Text>
            {renderColorIndicator()}
          </Group>
        )}
        {children}
      </Group>
    );
  };
  
  return (
    <ThemeWrapper>
      {renderThemeSwitcher()}
    </ThemeWrapper>
  );
}

// Utility hook for theme-aware styling
export const useThemeAwareStyles = () => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  
  return {
    colorScheme,
    isDark: colorScheme === "dark",
    isLight: colorScheme === "light",
    isSystem: colorScheme === "auto",
    theme,
    // Helper function for conditional styles
    themeStyle: (lightStyle: React.CSSProperties, darkStyle: React.CSSProperties) => 
      colorScheme === "dark" ? darkStyle : lightStyle,
    // Helper function for conditional values
    themeValue: <T,>(lightValue: T, darkValue: T) => 
      colorScheme === "dark" ? darkValue : lightValue
  };
};

// Preset configurations for common use cases
export const ThemeSwitcherPresets = {
  // Header/navbar theme switcher
  header: {
    mode: "icon-only" as const,
    animated: true,
    size: "sm" as const,
    variant: "subtle" as const
  },
  
  // Settings page theme switcher
  settings: {
    mode: "segmented" as const,
    showLabel: true,
    showSystemOption: true,
    animated: true
  },
  
  // Compact theme switcher
  compact: {
    mode: "button" as const,
    size: "xs" as const,
    variant: "light" as const,
    showLabel: false
  },
  
  // Dropdown theme switcher with full options
  dropdown: {
    mode: "dropdown" as const,
    showLabel: true,
    showSystemOption: true,
    animated: true,
    size: "sm" as const
  }
};