import React, { useEffect, useState } from "react";
import {
  Modal,
  Group,
  Text,
  Stack,
  ScrollArea,
  Divider,
  CloseButton,
  Box,
  type ModalProps,
  type GroupProps
} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import Button, { type ButtonProps } from "./Button";
import AnimatedCard, { type AnimatedCardProps } from "./AnimatedCard";
import AlertMessage, { type AlertMessageProps } from "./AlertMessage";

export type ModalAction = {
  key: string;
  label: string;
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  size?: ButtonProps["size"];
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void | Promise<void>;
  closeOnClick?: boolean; // Auto-close modal after action
  position?: "left" | "right" | "center";
};

export type ModalDialogProps = {
  // Basic props
  opened: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  
  // Modal configuration
  size?: ModalProps["size"];
  centered?: boolean;
  withCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  trapFocus?: boolean;
  
  // Content layout
  withHeader?: boolean;
  withFooter?: boolean;
  withDividers?: boolean;
  scrollable?: boolean;
  maxHeight?: string | number;
  
  // Actions
  actions?: ModalAction[];
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  
  // Styling & Animation
  animated?: boolean;
  animationType?: "fade" | "slide" | "scale" | "bounce";
  cardAnimated?: boolean;
  cardHoverEffect?: AnimatedCardProps["hoverEffect"];
  
  // Alert integration
  alert?: AlertMessageProps;
  showAlert?: boolean;
  onAlertClose?: () => void;
  
  // Loading state
  loading?: boolean;
  loadingText?: string;
  
  // Custom components
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  
  // Layout options
  actionPosition?: GroupProps["justify"];
  headerAlign?: "left" | "center" | "right";
  
  // Event handlers
  onOpen?: () => void;
  onAfterClose?: () => void;
  
  // Advanced options
  persistent?: boolean; // Prevent closing
  fullscreen?: boolean;
  zIndex?: number;
  
} & Omit<ModalProps, "opened" | "onClose" | "title" | "children" | "size" | "centered">;

/**
 * ModalDialog component with integrated Button, AnimatedCard, and AlertMessage.
 * Provides comprehensive modal functionality with animations and flexible layouts.
 */
export default function ModalDialog({
  // Basic props
  opened,
  onClose,
  title,
  children,
  
  // Modal configuration
  size = "md",
  centered = true,
  withCloseButton = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  trapFocus = true,
  
  // Content layout
  withHeader = true,
  withFooter = true,
  withDividers = false,
  scrollable = true,
  maxHeight = "80vh",
  
  // Actions
  actions = [],
  primaryAction,
  secondaryAction,
  
  // Styling & Animation
  animated = false,
  animationType = "fade",
  cardAnimated = false,
  cardHoverEffect = "none",
  
  // Alert integration
  alert,
  showAlert = false,
  onAlertClose,
  
  // Loading state
  loading = false,
  loadingText = "Loading...",
  
  // Custom components
  headerComponent,
  footerComponent,
  
  // Layout options
  actionPosition = "flex-end",
  headerAlign = "left",
  
  // Event handlers
  onOpen,
  onAfterClose,
  
  // Advanced options
  persistent = false,
  fullscreen = false,
  zIndex = 1000,
  
  ...modalProps
}: ModalDialogProps) {
  
  const [isActionLoading, setIsActionLoading] = useState<Record<string, boolean>>({});
  
  // Handle modal open
  useEffect(() => {
    if (opened && onOpen) {
      onOpen();
    }
  }, [opened, onOpen]);
  
  // Handle modal close
  const handleClose = () => {
    if (persistent) return;
    onClose();
    if (onAfterClose) {
      setTimeout(onAfterClose, 300); // Wait for close animation
    }
  };
  
  // Handle action click
  const handleActionClick = async (action: ModalAction) => {
    setIsActionLoading(prev => ({ ...prev, [action.key]: true }));
    
    try {
      await action.onClick();
      
      if (action.closeOnClick !== false) {
        handleClose();
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsActionLoading(prev => ({ ...prev, [action.key]: false }));
    }
  };
  
  // Get animation variants for modal content
  const getAnimationVariants = () => {
    switch (animationType) {
      case "slide":
        return {
          hidden: { opacity: 0, y: -50, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -50, scale: 0.95 }
        };
      
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        };
      
      case "bounce":
        return {
          hidden: { opacity: 0, scale: 0.3 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
              type: "spring" as const,
              stiffness: 400,
              damping: 15
            }
          },
          exit: { opacity: 0, scale: 0.3 }
        };
      
      case "fade":
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };
  
  // Combine all actions
  const allActions = [
    ...(secondaryAction ? [secondaryAction] : []),
    ...actions,
    ...(primaryAction ? [primaryAction] : [])
  ];
  
  // Group actions by position
  const leftActions = allActions.filter(action => action.position === "left");
  const centerActions = allActions.filter(action => action.position === "center");
  const rightActions = allActions.filter(action => !action.position || action.position === "right");
  
  // Render header
  const renderHeader = () => {
    if (!withHeader && !title && !headerComponent) return null;
    
    return (
      <>
        <Group
          justify={
            headerAlign === "center" ? "center" : 
            headerAlign === "right" ? "flex-end" : "space-between"
          }
          align="center"
          p="md"
        >
          {headerComponent || (
            <>
              {headerAlign !== "right" && title && (
                <Text size="lg" fw={600}>
                  {title}
                </Text>
              )}
              
              {headerAlign === "center" && title && (
                <Text size="lg" fw={600}>
                  {title}
                </Text>
              )}
              
              {headerAlign === "right" && (
                <>
                  {withCloseButton && (
                    <CloseButton
                      onClick={handleClose}
                      size="md"
                      disabled={persistent}
                    />
                  )}
                  {title && (
                    <Text size="lg" fw={600}>
                      {title}
                    </Text>
                  )}
                </>
              )}
              
              {headerAlign !== "right" && withCloseButton && (
                <CloseButton
                  onClick={handleClose}
                  size="md"
                  disabled={persistent}
                />
              )}
            </>
          )}
        </Group>
        {withDividers && <Divider />}
      </>
    );
  };
  
  // Render content
  const renderContent = () => {
    const content = (
      <Box p="md">
        {/* Alert Message */}
        {showAlert && alert && (
          <Box mb="md">
            <AlertMessage
              {...alert}
              onClose={onAlertClose}
            />
          </Box>
        )}
        
        {/* Loading State */}
        {loading && (
          <Group justify="center" p="xl">
            <Text>{loadingText}</Text>
          </Group>
        )}
        
        {/* Main Content */}
        {!loading && children}
      </Box>
    );
    
    if (scrollable) {
      return (
        <ScrollArea.Autosize
          mah={maxHeight}
          type="scroll"
          offsetScrollbars
        >
          {content}
        </ScrollArea.Autosize>
      );
    }
    
    return content;
  };
  
  // Render footer
  const renderFooter = () => {
    if (!withFooter && allActions.length === 0 && !footerComponent) return null;
    
    return (
      <>
        {withDividers && <Divider />}
        <Box p="md">
          {footerComponent || (
            <Group justify={actionPosition} gap="sm">
              {/* Left actions */}
              {leftActions.length > 0 && (
                <Group gap="sm">
                  {leftActions.map((action) => (
                    <Button
                      key={action.key}
                      variant={action.variant || "light"}
                      color={action.color}
                      size={action.size || "sm"}
                      loading={isActionLoading[action.key] || action.loading}
                      disabled={action.disabled || loading}
                      animated={animated}
                      onClick={() => handleActionClick(action)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Group>
              )}
              
              {/* Spacer for space-between layout */}
              {actionPosition === "space-between" && (
                <div style={{ flex: 1 }} />
              )}
              
              {/* Center actions */}
              {centerActions.length > 0 && (
                <Group gap="sm">
                  {centerActions.map((action) => (
                    <Button
                      key={action.key}
                      variant={action.variant || "light"}
                      color={action.color}
                      size={action.size || "sm"}
                      loading={isActionLoading[action.key] || action.loading}
                      disabled={action.disabled || loading}
                      animated={animated}
                      onClick={() => handleActionClick(action)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Group>
              )}
              
              {/* Right actions */}
              {rightActions.length > 0 && (
                <Group gap="sm">
                  {rightActions.map((action) => (
                    <Button
                      key={action.key}
                      variant={action.variant || (action === primaryAction ? "filled" : "light")}
                      color={action.color || (action === primaryAction ? "blue" : undefined)}
                      size={action.size || "sm"}
                      loading={isActionLoading[action.key] || action.loading}
                      disabled={action.disabled || loading}
                      animated={animated}
                      onClick={() => handleActionClick(action)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Group>
              )}
            </Group>
          )}
        </Box>
      </>
    );
  };
  
  // Render modal content
  const renderModalContent = () => {
    const content = (
      <Stack gap={0}>
        {renderHeader()}
        {renderContent()}
        {renderFooter()}
      </Stack>
    );
    
    if (cardAnimated) {
      return (
        <AnimatedCard
          animated={cardAnimated}
          hoverEffect={cardHoverEffect}
          withBorder={false}
          p={0}
        >
          {content}
        </AnimatedCard>
      );
    }
    
    return content;
  };
  
  // Main render with animation wrapper
  const ModalContent = () => {
    if (!animated) {
      return renderModalContent();
    }
    
    return (
      <motion.div
        variants={getAnimationVariants()}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {renderModalContent()}
      </motion.div>
    );
  };
  
  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size={fullscreen ? "100%" : size}
      centered={centered && !fullscreen}
      withCloseButton={false} // We handle this ourselves
      closeOnClickOutside={closeOnClickOutside && !persistent}
      closeOnEscape={closeOnEscape && !persistent}
      trapFocus={trapFocus}
      fullScreen={fullscreen}
      padding={0}
      radius={fullscreen ? 0 : "md"}
      zIndex={zIndex}
      {...modalProps}
    >
      <AnimatePresence mode="wait">
        {opened && <ModalContent />}
      </AnimatePresence>
    </Modal>
  );
}

// Utility functions for common modal types
export const createConfirmModal = (props: {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "warning" | "info";
}): Pick<ModalDialogProps, "title" | "animated" | "animationType" | "size" | "primaryAction" | "secondaryAction"> & {
  children: React.ReactNode;
} => ({
  title: props.title,
  children: <Text>{props.message}</Text>,
  animated: true,
  animationType: "scale",
  size: "sm",
  primaryAction: {
    key: "confirm",
    label: props.confirmLabel || "Confirm",
    variant: "filled",
    color: props.type === "danger" ? "red" : props.type === "warning" ? "orange" : "blue",
    onClick: props.onConfirm,
    closeOnClick: true
  },
  secondaryAction: {
    key: "cancel",
    label: props.cancelLabel || "Cancel",
    variant: "light",
    onClick: props.onCancel || (() => {}),
    closeOnClick: true
  }
});

// Preset configurations
export const ModalPresets = {
  // Confirmation dialog
  confirm: {
    animated: true,
    animationType: "scale" as const,
    size: "sm" as const,
    withDividers: true
  },
  
  // Form modal
  form: {
    animated: true,
    animationType: "slide" as const,
    size: "md" as const,
    scrollable: true,
    withDividers: true,
    closeOnClickOutside: false
  },
  
  // Full screen modal
  fullscreen: {
    animated: true,
    animationType: "fade" as const,
    fullscreen: true,
    withDividers: true
  },
  
  // Alert modal
  alert: {
    animated: true,
    animationType: "bounce" as const,
    size: "sm" as const,
    persistent: true,
    withCloseButton: false
  }
};