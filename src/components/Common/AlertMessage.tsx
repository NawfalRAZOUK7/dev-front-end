import React, { useState, useEffect } from "react";
import { Alert, CloseButton, Group, Text, type AlertProps } from "@mantine/core";
import {
  IconCheck,
  IconInfoCircle,
  IconAlertCircle,
  IconX,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../StylesCSS/AlertMessage.module.css";

type AlertType = "success" | "info" | "warning" | "error";

export type AlertMessageProps = {
  type?: AlertType;
  title?: string;
  message: React.ReactNode;
  withCloseButton?: boolean;
  onClose?: () => void;
  autoClose?: number; // milliseconds, e.g., 5000 = 5 seconds
  animated?: boolean; // Global animation control
  animationType?: "slide" | "fade" | "scale" | "bounce";
  position?: "top" | "bottom" | "center";
  persistent?: boolean; // Prevent auto-close on hover
  showProgress?: boolean; // Show progress bar for auto-close
  className?: string;
  style?: React.CSSProperties;
} & Omit<AlertProps, "children" | "onClose" | "size">;

const iconsMap = {
  success: <IconCheck size={20} />,
  info: <IconInfoCircle size={20} />,
  warning: <IconAlertCircle size={20} />,
  error: <IconX size={20} />,
};

const colorMap = {
  success: "green",
  info: "blue", 
  warning: "yellow",
  error: "red",
};

/**
 * AlertMessage component with optional animations and auto-close functionality.
 * Consistent with the component library's animated parameter pattern.
 */
export default function AlertMessage({
  type = "info",
  title,
  message,
  withCloseButton = true,
  onClose,
  autoClose,
  animated = false,
  animationType = "slide",
  position = "top",
  persistent = false,
  showProgress = false,
  className,
  style,
  ...alertProps
}: AlertMessageProps) {
  const [opened, setOpened] = useState(true);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-close timer with progress
  useEffect(() => {
    if (autoClose && opened && !isPaused) {
      const startTime = Date.now();
      const interval = 50; // Update every 50ms for smooth progress
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, autoClose - elapsed);
        const progressValue = (remaining / autoClose) * 100;
        
        setProgress(progressValue);
        
        if (remaining <= 0) {
          setOpened(false);
          onClose?.();
          clearInterval(timer);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [autoClose, onClose, opened, isPaused]);

  // Animation variants
  const getAnimationVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    };

    switch (animationType) {
      case "slide":
        return {
          hidden: { 
            opacity: 0, 
            y: position === "bottom" ? 20 : -20,
            x: 0
          },
          visible: { 
            opacity: 1, 
            y: 0,
            x: 0
          },
          exit: { 
            opacity: 0, 
            y: position === "bottom" ? 20 : -20,
            x: 0
          }
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
              damping: 10
            }
          },
          exit: { opacity: 0, scale: 0.3 }
        };
      
      case "fade":
      default:
        return baseVariants;
    }
  };

  const handleClose = () => {
    setOpened(false);
    onClose?.();
  };

  const handleMouseEnter = () => {
    if (persistent && autoClose) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (persistent && autoClose) {
      setIsPaused(false);
    }
  };

  // Generate CSS classes
  const alertClasses = [
    animated ? styles.animatedAlert : "",
    className || ""
  ].filter(Boolean).join(" ");

  // Render content
  const renderContent = () => (
    <Alert
      icon={iconsMap[type]}
      title={title}
      color={colorMap[type]}
      variant="filled"
      radius="md"
      withCloseButton={false}
      className={alertClasses}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...alertProps}
    >
      <Group justify="space-between" align="flex-start" gap="xs">
        <Text style={{ flex: 1 }}>
          {message}
        </Text>
        {withCloseButton && (
          <CloseButton
            onClick={handleClose}
            title="Close alert"
            size="sm"
            variant="transparent"
            style={{ 
              color: "white",
              marginTop: title ? "4px" : "0"
            }}
          />
        )}
      </Group>
      
      {/* Progress bar for auto-close */}
      {showProgress && autoClose && (
        <div className={styles.progressContainer}>
          <div 
            className={styles.progressBar}
            style={{ 
              width: `${progress}%`,
              backgroundColor: "rgba(255, 255, 255, 0.3)"
            }}
          />
        </div>
      )}
    </Alert>
  );

  // Render with or without animation
  if (!animated) {
    return opened ? renderContent() : null;
  }

  return (
    <AnimatePresence mode="wait">
      {opened && (
        <motion.div
          key="alert"
          variants={getAnimationVariants()}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ 
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          style={{ marginBottom: 16 }}
        >
          {renderContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Utility function for creating toast-like alerts
export const createAlert = (alertProps: Omit<AlertMessageProps, "onClose">) => {
  return new Promise<void>((resolve) => {
    // This would typically integrate with a toast system
    // For now, we'll log the alert configuration and resolve
    console.log('Alert created with props:', alertProps);
    
    // In a real implementation, this would:
    // 1. Add the alert to a global notification system
    // 2. Handle the display and auto-close logic
    // 3. Return cleanup functions
    
    // Simulate async behavior
    setTimeout(() => {
      resolve();
    }, alertProps.autoClose || 0);
  });
};

// Preset configurations
export const AlertPresets = {
  // Success notification
  success: {
    type: "success" as const,
    animated: true,
    animationType: "slide" as const,
    autoClose: 4000,
    showProgress: true
  },
  
  // Error alert (persistent)
  error: {
    type: "error" as const,
    animated: true,
    animationType: "bounce" as const,
    persistent: true,
    withCloseButton: true
  },
  
  // Info tooltip
  info: {
    type: "info" as const,
    animated: true,
    animationType: "fade" as const,
    autoClose: 3000
  },
  
  // Warning (requires action)
  warning: {
    type: "warning" as const,
    animated: true,
    animationType: "scale" as const,
    persistent: true,
    showProgress: false
  }
};