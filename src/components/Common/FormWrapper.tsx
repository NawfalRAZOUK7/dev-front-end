import React from "react";
import { Paper, Stack, Group, Title, Text, Divider, type PaperProps } from "@mantine/core";
import Button, { type ButtonProps } from "./Button";
import IconButton, { type IconButtonProps } from "./IconButton";

export type FormAction = {
  label: string;
  htmlType?: "submit" | "button" | "reset";
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  size?: ButtonProps["size"];
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  
  // Icon button support
  isIconOnly?: boolean;
  icon?: React.ReactNode;
  iconLabel?: string;
  iconButtonProps?: Omit<IconButtonProps, 'icon' | 'label' | 'onClick' | 'animated'>;
};

export type FormWrapperProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: FormAction[];
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  animated?: boolean; // Global animation control
  withHeader?: boolean;
  withDivider?: boolean;
  headerOrder?: 1 | 2 | 3 | 4 | 5 | 6;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  actionPosition?: "flex-start" | "center" | "flex-end" | "space-between";
  containerProps?: React.ComponentProps<"div">;
} & PaperProps;

/**
 * General FormWrapper component that provides a flexible layout for forms.
 * All styling and behavior can be customized through props.
 * The 'animated' prop controls whether buttons and inputs use animations.
 */
export default function FormWrapper({
  title,
  subtitle,
  children,
  actions = [],
  onSubmit,
  loading = false,
  animated = false, // Default to false for better performance
  withHeader = true,
  withDivider = false,
  headerOrder = 2,
  spacing = "md",
  actionPosition = "flex-end",
  containerProps,
  ...paperProps
}: FormWrapperProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  // Clone children and inject animated prop if they support it
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childType = child.type;
      // Check if it's an InputField component by checking function name
      const isInputField = typeof childType === 'function' && 
        ('name' in childType && childType.name === 'InputField');
      
      if (isInputField) {
        // Type assertion to tell TypeScript this component accepts animated prop
        return React.cloneElement(child as React.ReactElement<{ animated?: boolean }>, {
          animated,
        });
      }
    }
    return child;
  });

  const renderActions = () => {
    if (actions.length === 0) return null;

    return (
      <Group justify={actionPosition} mt={spacing}>
        {actions.map((action, index) => {
          const { 
            label, 
            htmlType, 
            onClick, 
            loading: actionLoading, 
            disabled,
            isIconOnly,
            icon,
            iconLabel,
            iconButtonProps,
            ...buttonProps 
          } = action;
          
          // Render IconButton if isIconOnly is true
          if (isIconOnly && icon) {
            return (
              <IconButton
                key={index}
                icon={icon}
                label={iconLabel || label}
                loading={actionLoading || loading}
                disabled={disabled || loading}
                onClick={onClick}
                animated={animated}
                {...iconButtonProps}
              />
            );
          }
          
          // Render regular Button
          return (
            <Button
              key={index}
              htmlType={htmlType || "button"}
              loading={actionLoading || (htmlType === "submit" && loading)}
              disabled={disabled || loading}
              onClick={onClick}
              animated={animated}
              {...buttonProps}
            >
              {icon && (
                <span style={{ marginRight: '8px', display: 'inline-flex' }}>
                  {icon}
                </span>
              )}
              {label}
            </Button>
          );
        })}
      </Group>
    );
  };

  const renderHeader = () => {
    if (!withHeader || (!title && !subtitle)) return null;

    return (
      <Stack gap="xs" mb={spacing}>
        {title && (
          <Title order={headerOrder}>
            {title}
          </Title>
        )}
        {subtitle && (
          <Text c="dimmed">
            {subtitle}
          </Text>
        )}
        {withDivider && <Divider />}
      </Stack>
    );
  };

  return (
    <div {...containerProps}>
      <Paper {...paperProps}>
        <form onSubmit={handleSubmit} noValidate>
          {renderHeader()}
          
          <Stack gap={spacing}>
            {enhancedChildren}
          </Stack>

          {renderActions()}
        </form>
      </Paper>
    </div>
  );
}