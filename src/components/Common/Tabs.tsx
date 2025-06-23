import React, { useState } from "react";
import { Box, Group, Stack, type BoxProps, type GroupProps, type StackProps } from "@mantine/core";
import Button, { type ButtonProps } from "./Button";
import IconButton, { type IconButtonProps } from "./IconButton";

export type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  badge?: string | number;
  
  // Icon-only tab support
  isIconOnly?: boolean;
  iconLabel?: string;
  
  // Custom styling per tab
  buttonProps?: Omit<ButtonProps, 'children' | 'onClick' | 'animated'>;
  iconButtonProps?: Omit<IconButtonProps, 'icon' | 'label' | 'onClick' | 'animated'>;
};

export type TabsProps = {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  defaultTab?: string;
  
  // Layout options
  orientation?: "horizontal" | "vertical";
  tabPosition?: "start" | "center" | "end" | "apart";
  contentPosition?: "start" | "center" | "end";
  
  // Styling
  animated?: boolean;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  activeVariant?: ButtonProps["variant"];
  activeColor?: ButtonProps["color"];
  spacing?: GroupProps["gap"];
  
  // Icon button styling
  iconButtonSize?: IconButtonProps["size"];
  iconButtonVariant?: IconButtonProps["variant"];
  iconButtonColor?: IconButtonProps["color"];
  
  // Content area styling
  contentProps?: BoxProps;
  tabListProps?: GroupProps | StackProps;
  
  // Behavior
  keepMounted?: boolean; // Keep inactive tab content in DOM
  lazy?: boolean; // Only render content when tab becomes active
  
  // Labels for accessibility
  ariaLabel?: string;
} & Omit<BoxProps, "children">;

/**
 * Tabs component built with Button and IconButton.
 * Provides flexible tab navigation with customizable display options.
 */
export default function Tabs({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  defaultTab,
  
  // Layout
  orientation = "horizontal",
  tabPosition = "start",
  contentPosition = "start",
  
  // Styling
  animated = false,
  size = "sm",
  variant = "light",
  color,
  activeVariant = "filled",
  activeColor,
  spacing = "xs",
  
  // Icon button styling
  iconButtonSize,
  iconButtonVariant,
  iconButtonColor,
  
  // Content styling
  contentProps,
  tabListProps,
  
  // Behavior
  keepMounted = false,
  lazy = false,
  
  // Accessibility
  ariaLabel = "Tabs",
  
  ...boxProps
}: TabsProps) {
  
  // Internal state for uncontrolled mode
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    defaultTab || tabs[0]?.id || ""
  );
  
  // Use controlled or uncontrolled state
  const activeTabId = controlledActiveTab ?? internalActiveTab;
  const isControlled = controlledActiveTab !== undefined;
  
  const handleTabChange = (tabId: string) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };
  
  const activeTabContent = tabs.find(tab => tab.id === activeTabId)?.content;
  
  const renderTabButton = (tab: TabItem) => {
    const isActive = tab.id === activeTabId;
    const isDisabled = tab.disabled || tab.loading;
    
    const handleClick = () => {
      if (!isDisabled) {
        handleTabChange(tab.id);
      }
    };
    
    // Icon-only tab
    if (tab.isIconOnly && tab.icon) {
      return (
        <IconButton
          key={tab.id}
          icon={tab.icon}
          label={tab.iconLabel || tab.label}
          size={iconButtonSize || size}
          variant={isActive ? (activeVariant || "filled") : (iconButtonVariant || variant)}
          color={isActive ? (activeColor || color) : (iconButtonColor || color)}
          loading={tab.loading}
          disabled={tab.disabled}
          animated={animated}
          onClick={handleClick}
          data-active={isActive}
          {...tab.iconButtonProps}
        />
      );
    }
    
    // Regular tab button
    return (
      <Button
        key={tab.id}
        size={size}
        variant={isActive ? activeVariant : variant}
        color={isActive ? (activeColor || color) : color}
        loading={tab.loading}
        disabled={tab.disabled}
        animated={animated}
        onClick={handleClick}
        data-active={isActive}
        style={{
          position: 'relative',
          ...(tab.buttonProps?.style || {})
        }}
        {...tab.buttonProps}
      >
        <Group gap="xs" wrap="nowrap">
          {tab.icon && (
            <span style={{ display: 'inline-flex' }}>
              {tab.icon}
            </span>
          )}
          <span>{tab.label}</span>
          {tab.badge && (
            <Box
              component="span"
              style={{
                backgroundColor: 'var(--mantine-color-red-6)',
                color: 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: 600,
                lineHeight: 1,
                minWidth: '16px',
                textAlign: 'center'
              }}
            >
              {tab.badge}
            </Box>
          )}
        </Group>
      </Button>
    );
  };
  
  const renderTabList = () => {
    const tabButtons = tabs.map((tab) => renderTabButton(tab));
    
    if (orientation === "vertical") {
      return (
        <Stack
          gap={spacing}
          align={tabPosition === "center" ? "center" : tabPosition === "end" ? "flex-end" : "flex-start"}
          role="tablist"
          aria-label={ariaLabel}
          {...(tabListProps as StackProps)}
        >
          {tabButtons}
        </Stack>
      );
    }
    
    return (
      <Group
        gap={spacing}
        justify={tabPosition === "apart" ? "space-between" : tabPosition}
        wrap="nowrap"
        role="tablist"
        aria-label={ariaLabel}
        {...(tabListProps as GroupProps)}
      >
        {tabButtons}
      </Group>
    );
  };
  
  const renderContent = () => {
    if (!keepMounted) {
      // Only render active tab content
      return (
        <Box
          role="tabpanel"
          id={`tabpanel-${activeTabId}`}
          aria-labelledby={`tab-${activeTabId}`}
          tabIndex={0}
          {...contentProps}
        >
          {activeTabContent}
        </Box>
      );
    }
    
    // Render all tab contents, show/hide with CSS
    return (
      <Box {...contentProps}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const shouldRender = !lazy || isActive || internalActiveTab === tab.id;
          
          if (!shouldRender) return null;
          
          return (
            <Box
              key={tab.id}
              role="tabpanel"
              id={`tabpanel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              style={{
                display: isActive ? 'block' : 'none'
              }}
            >
              {tab.content}
            </Box>
          );
        })}
      </Box>
    );
  };
  
  const containerStyle: React.CSSProperties = orientation === "vertical" 
    ? { display: 'flex', gap: 'var(--mantine-spacing-md)' }
    : { display: 'block' };
    
  const contentAlignStyle: React.CSSProperties = orientation === "horizontal" && contentPosition !== "start"
    ? { 
        textAlign: contentPosition === "center" ? "center" : "end",
        display: 'flex',
        justifyContent: contentPosition === "center" ? "center" : "flex-end",
        flexDirection: 'column'
      }
    : {};
  
  return (
    <Box style={containerStyle} {...boxProps}>
      {/* Tab List */}
      <Box style={{ flexShrink: 0 }}>
        {renderTabList()}
      </Box>
      
      {/* Tab Content */}
      <Box 
        style={{ 
          flex: orientation === "vertical" ? 1 : undefined,
          marginTop: orientation === "horizontal" ? 'var(--mantine-spacing-md)' : 0,
          ...contentAlignStyle
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}