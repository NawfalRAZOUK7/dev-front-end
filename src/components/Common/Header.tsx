import React from "react";
import {
  Group,
  Text,
  Box,
  Container,
  Divider,
  Avatar,
  Badge,
  Anchor,
  type GroupProps,
  type ContainerProps
} from "@mantine/core";
import {
  IconHome,
  IconUser,
  IconSettings,
  IconLogout,
  IconBell,
  IconSearch,
  IconMenu2
} from "@tabler/icons-react";
import Button, { type ButtonProps } from "./Button";
import IconButton, { type IconButtonProps } from "./IconButton";
import ThemeSwitcher, { type ThemeSwitcherProps } from "./ThemeSwitcher";
import DropdownMenu, { 
  type DropdownMenuItem, 
  createMenuItem, 
  createMenuDivider 
} from "./DropdownMenu";

// Navigation item type
export type NavigationItem = {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  badge?: string | number;
  hidden?: boolean;
};

// User info type
export type UserInfo = {
  name: string;
  email?: string;
  avatar?: string;
  initials?: string;
  role?: string;
  status?: "online" | "offline" | "away" | "busy";
};

// Header action type
export type HeaderAction = {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  badge?: string | number;
  disabled?: boolean;
  hidden?: boolean;
  variant?: IconButtonProps["variant"];
  color?: IconButtonProps["color"];
};

export type HeaderProps = {
  // Brand/Logo
  brand?: {
    logo?: React.ReactNode;
    name?: string;
    href?: string;
    onClick?: () => void;
  };
  
  // Navigation
  navigation?: {
    items?: NavigationItem[];
    mobileMenuIcon?: React.ReactNode;
    showMobileMenu?: boolean;
    onMobileMenuToggle?: () => void;
    buttonProps?: Partial<ButtonProps>; // Custom button styling for nav items
  };
  
  // User section
  user?: {
    info?: UserInfo;
    menuItems?: DropdownMenuItem[];
    showThemeSwitcher?: boolean;
    themeSwitcherProps?: Partial<ThemeSwitcherProps>;
  };
  
  // Actions (notifications, search, etc.)
  actions?: HeaderAction[];
  
  // Layout
  layout?: {
    height?: number | string;
    sticky?: boolean;
    withBorder?: boolean;
    withShadow?: boolean;
    withDivider?: boolean; // Use Divider component
    fluid?: boolean;
    containerSize?: ContainerProps["size"];
  };
  
  // Styling
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    variant?: "default" | "minimal" | "elevated";
  };
  
  // Mobile behavior
  mobile?: {
    breakpoint?: "xs" | "sm" | "md" | "lg" | "xl";
    hideNavigation?: boolean;
    hideActions?: boolean;
    compactUser?: boolean;
  };
  
  // Custom content
  leftSection?: React.ReactNode;
  centerSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  
  // Container props
  containerProps?: Omit<ContainerProps, "children">;
  groupProps?: Omit<GroupProps, "children">;
};

/**
 * Header component with flexible branding, navigation, user section, and actions.
 * Built with Button, IconButton, ThemeSwitcher, and DropdownMenu components.
 */
export default function Header({
  // Brand/Logo
  brand,
  
  // Navigation
  navigation,
  
  // User section
  user,
  
  // Actions
  actions = [],
  
  // Layout
  layout = {},
  
  // Styling
  style = {},
  
  // Mobile behavior
  mobile = {},
  
  // Custom content
  leftSection,
  centerSection,
  rightSection,
  
  // Container props
  containerProps,
  groupProps
}: HeaderProps) {
  
  const {
    height = 60,
    sticky = true,
    withBorder = true,
    withShadow = false,
    withDivider = false,
    fluid = false,
    containerSize = "xl"
  } = layout;
  
  const {
    backgroundColor,
    borderColor,
    variant = "default"
  } = style;
  
  const {
    breakpoint = "sm",
    hideNavigation = false,
    hideActions = false,
    compactUser = true
  } = mobile;
  
  // Filter visible navigation items
  const visibleNavItems = navigation?.items?.filter(item => !item.hidden) || [];
  
  // Filter visible actions
  const visibleActions = actions.filter(action => !action.hidden);
  
  // Default user menu items
  const defaultUserMenuItems: DropdownMenuItem[] = [
    createMenuItem("profile", "Profile", () => {}, { 
      icon: <IconUser size={16} />,
      shortcut: "⌘P"
    }),
    createMenuItem("settings", "Settings", () => {}, { 
      icon: <IconSettings size={16} />,
      shortcut: "⌘,"
    }),
    createMenuDivider("divider-1"),
    createMenuItem("logout", "Logout", () => {}, { 
      icon: <IconLogout size={16} />,
      color: "red"
    })
  ];
  
  // Render brand/logo section
  const renderBrand = () => {
    if (!brand && !leftSection) return null;
    
    if (leftSection) return leftSection;
    
    if (!brand) return null;
    
    const brandContent = (
      <Group gap="sm" align="center">
        {brand.logo}
        {brand.name && (
          <Text 
            size="lg" 
            fw={700} 
            style={{ userSelect: "none" }}
          >
            {brand.name}
          </Text>
        )}
      </Group>
    );
    
    if (brand.href) {
      return (
        <Anchor href={brand.href} underline="never" c="inherit">
          {brandContent}
        </Anchor>
      );
    }
    
    if (brand.onClick) {
      return (
        <Box
          style={{ cursor: "pointer" }}
          onClick={brand.onClick}
        >
          {brandContent}
        </Box>
      );
    }
    
    return brandContent;
  };
  
  // Render navigation items
  const renderNavigation = () => {
    if (!navigation?.items || visibleNavItems.length === 0 || hideNavigation) {
      return null;
    }
    
    return (
      <Group gap="xs" visibleFrom={breakpoint}>
        {visibleNavItems.map((item) => {
          const buttonElement = (
            <Button
              key={item.key}
              variant={item.active ? "filled" : "subtle"}
              size="sm"
              disabled={item.disabled}
              leftSection={item.icon}
              rightSection={item.badge ? (
                <Badge size="xs" variant="filled">
                  {item.badge}
                </Badge>
              ) : undefined}
              onClick={item.onClick}
              {...navigation?.buttonProps}
            >
              {item.label}
            </Button>
          );

          if (item.href) {
            return (
              <Anchor key={item.key} href={item.href} underline="never">
                {buttonElement}
              </Anchor>
            );
          }

          return buttonElement;
        })}
      </Group>
    );
  };
  
  // Render mobile menu button
  const renderMobileMenu = () => {
    if (!navigation?.showMobileMenu || !navigation?.onMobileMenuToggle) {
      return null;
    }
    
    return (
      <IconButton
        icon={navigation.mobileMenuIcon || <IconMenu2 size={18} />}
        label="Toggle navigation menu"
        variant="subtle"
        onClick={navigation.onMobileMenuToggle}
        hiddenFrom={breakpoint}
      />
    );
  };
  
  // Render header actions
  const renderActions = () => {
    if (visibleActions.length === 0 || hideActions) return null;
    
    return (
      <Group gap="xs">
        {visibleActions.map((action) => (
          <Box key={action.key} pos="relative">
            <IconButton
              icon={action.icon}
              label={action.label}
              variant={action.variant || "subtle"}
              color={action.color}
              disabled={action.disabled}
              onClick={action.onClick}
            />
            {action.badge && (
              <Badge
                size="xs"
                variant="filled"
                color="red"
                pos="absolute"
                top={-2}
                right={-2}
                style={{ 
                  minWidth: 18, 
                  height: 18,
                  pointerEvents: "none"
                }}
              >
                {action.badge}
              </Badge>
            )}
          </Box>
        ))}
      </Group>
    );
  };
  
  // Render user section
  const renderUserSection = () => {
    if (!user?.info && !rightSection) return null;
    
    if (rightSection) return rightSection;
    
    const userMenuItems = user?.menuItems || defaultUserMenuItems;
    
    return (
      <Group gap="sm" align="center">
        {/* Theme switcher */}
        {user?.showThemeSwitcher && (
          <ThemeSwitcher
            mode="icon-only"
            size="sm"
            variant="subtle"
            {...user.themeSwitcherProps}
          />
        )}
        
        {/* User dropdown */}
        {user?.info && (
          <DropdownMenu
            trigger="custom"
            items={userMenuItems}
            position="bottom-end"
            triggerElement={
              <Group
                gap="sm"
                style={{ cursor: "pointer" }}
                align="center"
              >
                <Avatar
                  src={user.info.avatar}
                  size="sm"
                  radius="xl"
                  color="blue"
                >
                  {user.info.initials || user.info.name.charAt(0).toUpperCase()}
                </Avatar>
                {!compactUser && (
                  <Box visibleFrom="sm">
                    <Text size="sm" fw={500} lineClamp={1}>
                      {user.info.name}
                    </Text>
                    {user.info.role && (
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {user.info.role}
                      </Text>
                    )}
                  </Box>
                )}
                {user.info.status && (
                  <Box
                    w={8}
                    h={8}
                    style={{
                      borderRadius: "50%",
                      backgroundColor: 
                        user.info.status === "online" ? "green" :
                        user.info.status === "away" ? "yellow" :
                        user.info.status === "busy" ? "red" : "gray"
                    }}
                  />
                )}
              </Group>
            }
          />
        )}
      </Group>
    );
  };
  
  // Get header styles based on variant
  const getHeaderStyles = () => {
    const baseStyles: React.CSSProperties = {
      height,
      minHeight: height,
      backgroundColor: backgroundColor || 
        (variant === "elevated" ? "var(--mantine-color-body)" : "transparent"),
      borderBottom: withBorder ? 
        `1px solid ${borderColor || "var(--mantine-color-default-border)"}` : 
        "none",
      boxShadow: withShadow || variant === "elevated" ? 
        "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
      position: sticky ? "sticky" as const : "static" as const,
      top: sticky ? 0 : "auto",
      zIndex: sticky ? 100 : "auto"
    };
    
    return baseStyles;
  };
  
  return (
    <Box style={getHeaderStyles()}>
      <Container
        size={containerSize}
        fluid={fluid}
        h="100%"
        {...containerProps}
      >
        <Group
          h="100%"
          justify="space-between"
          align="center"
          gap="md"
          {...groupProps}
        >
          {/* Left section */}
          <Group gap="lg" align="center" style={{ flex: 1 }}>
            {renderBrand()}
            {renderNavigation()}
            {centerSection}
          </Group>
          
          {/* Right section */}
          <Group gap="sm" align="center">
            {renderMobileMenu()}
            {renderActions()}
            {renderUserSection()}
          </Group>
        </Group>
      </Container>
      
      {/* Optional divider at bottom of header */}
      {withDivider && <Divider />}
    </Box>
  );
}

// Preset configurations for common use cases
export const HeaderPresets = {
  // Application header with full features
  app: {
    layout: {
      height: 64,
      sticky: true,
      withBorder: true,
      withShadow: false
    },
    style: {
      variant: "default" as const
    },
    user: {
      showThemeSwitcher: true
    }
  },
  
  // Marketing/landing page header
  marketing: {
    layout: {
      height: 72,
      sticky: true,
      withBorder: false,
      withShadow: true,
      containerSize: "xl" as const
    },
    style: {
      variant: "elevated" as const
    },
    mobile: {
      hideNavigation: true,
      compactUser: true
    }
  },
  
  // Dashboard header
  dashboard: {
    layout: {
      height: 56,
      sticky: true,
      withBorder: true,
      withShadow: false
    },
    style: {
      variant: "minimal" as const
    },
    mobile: {
      compactUser: true
    }
  },
  
  // Admin panel header
  admin: {
    layout: {
      height: 60,
      sticky: true,
      withBorder: true,
      withShadow: true
    },
    style: {
      variant: "elevated" as const
    },
    user: {
      showThemeSwitcher: true
    }
  }
};

// Utility function to create navigation items
export const createNavItem = (
  key: string,
  label: string,
  options?: Partial<Omit<NavigationItem, "key" | "label">>
): NavigationItem => ({
  key,
  label,
  ...options
});

// Utility function to create header actions
export const createHeaderAction = (
  key: string,
  icon: React.ReactNode,
  label: string,
  onClick: () => void,
  options?: Partial<Omit<HeaderAction, "key" | "icon" | "label" | "onClick">>
): HeaderAction => ({
  key,
  icon,
  label,
  onClick,
  ...options
});

// Common header actions
export const CommonHeaderActions = {
  home: (onClick: () => void) =>
    createHeaderAction(
      "home",
      <IconHome size={18} />,
      "Home",
      onClick,
      { variant: "subtle" }
    ),
  
  notifications: (onClick: () => void, badge?: string | number) => 
    createHeaderAction(
      "notifications",
      <IconBell size={18} />,
      "Notifications",
      onClick,
      { badge, color: "blue" }
    ),
  
  search: (onClick: () => void) =>
    createHeaderAction(
      "search",
      <IconSearch size={18} />,
      "Search",
      onClick,
      { variant: "subtle" }
    ),
  
  settings: (onClick: () => void) =>
    createHeaderAction(
      "settings",
      <IconSettings size={18} />,
      "Settings",
      onClick,
      { variant: "subtle" }
    )
};