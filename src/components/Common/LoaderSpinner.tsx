import React from "react";
import { Loader, Center, Box, type BoxProps } from "@mantine/core";

type LoaderSpinnerProps = {
  size?: number | string;
  color?: string;
  variant?: "dots" | "oval" | "bars" | "dots" | "gradient" | "spinner";
  fullScreen?: boolean;
} & BoxProps;

/**
 * LoaderSpinner component: centered loader with optional full screen overlay.
 */
export default function LoaderSpinner({
  size = 40,
  color,
  variant = "oval",
  fullScreen = false,
  ...boxProps
}: LoaderSpinnerProps) {
  if (fullScreen) {
    return (
      <Box
        {...boxProps}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          ...(boxProps.style || {}),
        }}
      >
        <Loader size={size} color={color} variant={variant} />
      </Box>
    );
  }

  return (
    <Center {...boxProps}>
      <Loader size={size} color={color} variant={variant} />
    </Center>
  );
}
