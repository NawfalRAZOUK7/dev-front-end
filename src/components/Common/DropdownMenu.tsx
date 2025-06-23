import React from "react";
import { Menu, Group, Text, type MenuProps } from "@mantine/core";
import { IconChevronDown, IconDots } from "@tabler/icons-react";
import Button, { type ButtonProps } from "./Button";
import IconButton, { type IconButtonProps } from "./IconButton";

export type DropdownMenuItem = {
  key: string;
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  color?: string;
  shortcut?: string;
  type?: "item" | "divider" | "label";
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
};

export type DropdownMenuProps = {
  // Menu items
  items: DropdownMenuItem[];
  
  // Trigger configuration
  trigger?: "button" | "icon" | "custom";
  triggerElement?: React.ReactNode;
  
  // Button trigger props
  buttonLabel?: string;
  buttonProps?: Omit<ButtonProps, "onClick" | "children">;
  
  // Icon button trigger props
  iconButtonLabel?: string;
  iconButtonIcon?: React.ReactNode;
  iconButtonProps?: Omit<IconButtonProps, "onClick" | "icon" | "label">;
  
  // Menu configuration
  position?: MenuProps["position"];
  offset?: MenuProps["offset"];
  width?: MenuProps["width"];
  shadow?: MenuProps["shadow"];
  radius?: MenuProps["radius"];
  withArrow?: boolean;
  closeOnItemClick?: boolean;
  closeOnClickOutside?: boolean;
  
  // Styling
  animated?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  
  // Event handlers
  onOpen?: () => void;
  onClose?: () => void;
  
  // State
  opened?: boolean;
  disabled?: boolean;
  loading?: boolean;
  
};

/**
 * DropdownMenu component with Button and IconButton integration.
 * Provides flexible dropdown menus with customizable triggers and items.
 */
export default function DropdownMenu({
  // Menu items
  items,
  
  // Trigger configuration
  trigger = "button",
  triggerElement,
  
  // Button trigger props
  buttonLabel = "Menu",
  buttonProps,
  
  // Icon button trigger props
  iconButtonLabel = "Open menu",
  iconButtonIcon = <IconDots size={16} />,
  iconButtonProps,
  
  // Menu configuration
  position = "bottom-start",
  offset = 8,
  width = 220,
  shadow = "md",
  radius = "md",
  withArrow = false,
  closeOnItemClick = true,
  closeOnClickOutside = true,
  
  // Styling
  animated = false,
  size = "sm",
  
  // Event handlers
  onOpen,
  onClose,
  
  // State
  opened,
  disabled = false,
  loading = false
}: DropdownMenuProps) {
  
  // Filter and process menu items
  const processedItems = items.filter(item => !item.hidden);
  
  // Handle item click
  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    
    item.onClick();
    // Note: Menu will auto-close based on closeOnItemClick prop
  };
  
  // Render trigger element
  const renderTrigger = () => {
    if (trigger === "custom" && triggerElement) {
      return triggerElement;
    }
    
    if (trigger === "icon") {
      return (
        <IconButton
          icon={iconButtonIcon}
          label={iconButtonLabel}
          size={size}
          disabled={disabled}
          loading={loading}
          animated={animated}
          {...iconButtonProps}
        />
      );
    }
    
    // Default button trigger
    return (
      <Button
        size={size}
        disabled={disabled}
        loading={loading}
        animated={animated}
        rightSection={<IconChevronDown size={14} />}
        {...buttonProps}
      >
        {buttonLabel}
      </Button>
    );
  };
  
  // Render menu item
  const renderMenuItem = (item: DropdownMenuItem) => {
    if (item.type === "divider") {
      return <Menu.Divider key={item.key} />;
    }
    
    if (item.type === "label") {
      return (
        <Menu.Label key={item.key}>
          {item.label}
        </Menu.Label>
      );
    }
    
    return (
      <Menu.Item
        key={item.key}
        leftSection={item.leftSection || item.icon}
        rightSection={item.rightSection || (item.shortcut && (
          <Text size="xs" c="dimmed">
            {item.shortcut}
          </Text>
        ))}
        color={item.color}
        disabled={item.disabled}
        onClick={() => handleItemClick(item)}
      >
        <Group gap="xs" justify="space-between" w="100%">
          <Text size={size === "xs" ? "xs" : "sm"}>
            {item.label}
          </Text>
        </Group>
      </Menu.Item>
    );
  };
  
  return (
    <Menu
      position={position}
      offset={offset}
      width={width}
      shadow={shadow}
      radius={radius}
      withArrow={withArrow}
      closeOnItemClick={closeOnItemClick}
      closeOnClickOutside={closeOnClickOutside}
      opened={opened}
      onOpen={onOpen}
      onClose={onClose}
      disabled={disabled}
    >
      <Menu.Target>
        {renderTrigger()}
      </Menu.Target>

      <Menu.Dropdown>
        {processedItems.length === 0 ? (
          <Menu.Item disabled>
            <Text size="sm" c="dimmed">
              No items available
            </Text>
          </Menu.Item>
        ) : (
          processedItems.map((item) => renderMenuItem(item))
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

// Utility function to create menu items
export const createMenuItem = (
  key: string,
  label: string,
  onClick: () => void,
  options?: Partial<Omit<DropdownMenuItem, "key" | "label" | "onClick">>
): DropdownMenuItem => ({
  key,
  label,
  onClick,
  type: "item",
  ...options
});

// Utility function to create dividers
export const createMenuDivider = (key: string): DropdownMenuItem => ({
  key,
  label: "",
  onClick: () => {},
  type: "divider"
});

// Utility function to create labels
export const createMenuLabel = (key: string, label: string): DropdownMenuItem => ({
  key,
  label,
  onClick: () => {},
  type: "label"
});

// Preset configurations for common use cases
export const DropdownMenuPresets = {
  // Standard dropdown menu
  standard: {
    animated: true,
    withArrow: true,
    closeOnItemClick: true
  },
  
  // Action menu (icon trigger)
  actions: {
    animated: true,
    size: "sm" as const,
    iconButtonIcon: <IconDots size={16} />,
    iconButtonLabel: "More actions"
  },
  
  // Context menu
  context: {
    position: "right-start" as const,
    animated: true,
    withArrow: false
  },
  
  // Settings menu
  settings: {
    animated: true,
    width: 280,
    withArrow: true,
    shadow: "lg" as const
  }
};
