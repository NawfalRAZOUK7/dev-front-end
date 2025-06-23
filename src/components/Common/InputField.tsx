import React from "react";
import {
  TextInput,
  PasswordInput,
  Textarea,
  Select,
  NumberInput,
  Text,
  type BoxProps,
  Box,
} from "@mantine/core";
import { motion } from "framer-motion";

type Option = { value: string; label: string };

type InputFieldProps = {
  type: "text" | "email" | "number" | "password" | "textarea" | "select";
  name: string;
  label?: string;
  placeholder?: string;
  data?: Option[]; // for select
  value?: unknown;
  onChange?: (value: unknown) => void;
  error?: string;
  animated?: boolean; // New prop for optional animations
} & Omit<BoxProps, "sx" | "styles">;

const MotionBox = motion.div;

export default function InputField({
  type,
  name,
  label,
  placeholder,
  data,
  value,
  onChange,
  error,
  animated = false, // Default to false for better performance
  ...boxProps
}: InputFieldProps) {
  const variants = {
    rest: { scale: 1, boxShadow: "none" },
    hover: { scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    focus: { scale: 1.03, boxShadow: "0 0 8px rgba(24,144,255,0.6)" },
  };

  const handleChange = (val: unknown) => {
    onChange?.(val);
  };

  const renderInput = () => {
    const commonProps = {
      name,
      label,
      placeholder,
      error,
      radius: "md" as const,
      variant: "filled" as const,
    };

    switch (type) {
      case "password":
        return (
          <PasswordInput
            {...commonProps}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => handleChange(e.currentTarget.value)}
          />
        );
      case "textarea":
        return (
          <Textarea
            {...commonProps}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => handleChange(e.currentTarget.value)}
            autosize
            minRows={3}
          />
        );
      case "select":
        return (
          <Select
            {...commonProps}
            data={data || []}
            value={typeof value === "string" ? value : null}
            onChange={handleChange}
          />
        );
      case "number":
        return (
          <NumberInput
            {...commonProps}
            value={typeof value === "number" ? value : undefined}
            onChange={handleChange}
          />
        );
      case "email":
      case "text":
      default:
        return (
          <TextInput
            {...commonProps}
            type={type}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => handleChange(e.currentTarget.value)}
          />
        );
    }
  };

  const InputWrapper = ({ children }: { children: React.ReactNode }) => {
    if (animated) {
      return (
        <MotionBox
          initial="rest"
          whileHover="hover"
          whileFocus="focus"
          animate="rest"
          variants={variants}
          style={{ originX: 0.5 }}
        >
          {children}
        </MotionBox>
      );
    }
    return <>{children}</>;
  };

  return (
    <Box mb="md" {...boxProps}>
      <InputWrapper>
        {renderInput()}
        {error && (
          <Text c="red" size="sm" mt={4} fw={500} ta="right">
            {error}
          </Text>
        )}
      </InputWrapper>
    </Box>
  );
}