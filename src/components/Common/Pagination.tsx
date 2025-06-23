import React from "react";
import { Group, Text, Select, Box, type GroupProps } from "@mantine/core";
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconChevronsLeft, 
  IconChevronsRight,
  IconDots
} from "@tabler/icons-react";
import Button, { type ButtonProps } from "./Button";
import IconButton, { type IconButtonProps } from "./IconButton";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  
  // Display options
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  showPageInfo?: boolean;
  showPageSizeSelector?: boolean;
  
  // Customization
  maxVisiblePages?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  totalItems?: number;
  
  // Styling
  animated?: boolean;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  spacing?: GroupProps["gap"];
  
  // Icon button customization
  iconButtonSize?: IconButtonProps["size"];
  iconButtonVariant?: IconButtonProps["variant"];
  iconButtonColor?: IconButtonProps["color"];
  
  // Labels for accessibility
  labels?: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
    pageInfo?: string;
    pageSize?: string;
  };
  
  // State
  loading?: boolean;
  disabled?: boolean;
} & Omit<GroupProps, "children">;

/**
 * Pagination component built with Button and IconButton.
 * Provides flexible pagination controls with customizable display options.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  
  // Display options
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  showPageInfo = true,
  showPageSizeSelector = false,
  
  // Customization
  maxVisiblePages = 5,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  onPageSizeChange,
  totalItems,
  
  // Styling
  animated = false,
  size = "sm",
  variant = "light",
  color,
  spacing = "xs",
  
  // Icon button styling
  iconButtonSize,
  iconButtonVariant,
  iconButtonColor,
  
  // Labels
  labels = {},
  
  // State
  loading = false,
  disabled = false,
  
  ...groupProps
}: PaginationProps) {
  
  const {
    first = "First page",
    previous = "Previous page", 
    next = "Next page",
    last = "Last page",
    pageInfo = "Page info",
    pageSize: pageSizeLabel = "Items per page"
  } = labels;

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - halfVisible);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    
    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('ellipsis-start');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const isDisabled = loading || disabled;
  const canGoPrevious = currentPage > 1 && !isDisabled;
  const canGoNext = currentPage < totalPages && !isDisabled;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !isDisabled) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newSize: string | null) => {
    if (newSize && onPageSizeChange) {
      const size = parseInt(newSize, 10);
      onPageSizeChange(size);
    }
  };

  const renderPageButton = (page: number | string, index: number) => {
    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
      return (
        <IconButton
          key={`ellipsis-${index}`}
          icon={<IconDots size={16} />}
          label="More pages"
          size={iconButtonSize || size}
          variant={iconButtonVariant || "subtle"}
          color={iconButtonColor}
          disabled
          animated={false} // Don't animate ellipsis
        />
      );
    }

    const pageNum = page as number;
    const isActive = pageNum === currentPage;

    return (
      <Button
        key={pageNum}
        variant={isActive ? "filled" : variant}
        color={isActive ? color || "blue" : color}
        size={size}
        loading={loading && isActive}
        disabled={isDisabled}
        animated={animated}
        onClick={() => handlePageChange(pageNum)}
        style={{
          minWidth: size === "xs" ? 32 : size === "sm" ? 36 : 40,
        }}
      >
        {pageNum}
      </Button>
    );
  };

  const renderNavigationButton = (
    direction: "first" | "previous" | "next" | "last",
    icon: React.ReactNode,
    targetPage: number,
    canNavigate: boolean,
    label: string
  ): React.ReactElement<IconButtonProps> => (
    <IconButton
      icon={icon}
      label={label}
      size={iconButtonSize || size}
      variant={iconButtonVariant || variant}
      color={iconButtonColor || color}
      loading={loading && !canNavigate}
      disabled={!canNavigate}
      animated={animated}
      onClick={() => handlePageChange(targetPage)}
    />
  );

  const renderPageInfo = () => {
    if (!showPageInfo) return null;

    const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : currentPage;
    const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage;

    return (
      <Text size="sm" c="dimmed" aria-label={pageInfo}>
        {totalItems ? (
          <>Showing {startItem}-{endItem} of {totalItems.toLocaleString()}</>
        ) : (
          <>Page {currentPage} of {totalPages}</>
        )}
      </Text>
    );
  };

  const renderPageSizeSelector = () => {
    if (!showPageSizeSelector || !onPageSizeChange) return null;

    return (
      <Group gap="xs" align="center">
        <Text size="sm" c="dimmed">
          {pageSizeLabel}:
        </Text>
        <Select
          size="xs"
          value={pageSize.toString()}
          data={pageSizeOptions.map(size => ({
            value: size.toString(),
            label: size.toString()
          }))}
          onChange={handlePageSizeChange}
          disabled={isDisabled}
          style={{ width: 70 }}
        />
      </Group>
    );
  };

  // Don't render if there's only one page and no page size selector
  if (totalPages <= 1 && !showPageSizeSelector) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <Box>
      {/* Main pagination controls */}
      <Group justify="center" gap={spacing} {...groupProps}>
        {/* First page button */}
        {showFirstLast && renderNavigationButton(
          "first",
          <IconChevronsLeft size={16} />,
          1,
          canGoPrevious && currentPage > 2,
          first
        )}

        {/* Previous page button */}
        {showPrevNext && renderNavigationButton(
          "previous",
          <IconChevronLeft size={16} />,
          currentPage - 1,
          canGoPrevious,
          previous
        )}

        {/* Page number buttons */}
        {showPageNumbers && visiblePages.map((page, index) => 
          renderPageButton(page, index)
        )}

        {/* Next page button */}
        {showPrevNext && renderNavigationButton(
          "next",
          <IconChevronRight size={16} />,
          currentPage + 1,
          canGoNext,
          next
        )}

        {/* Last page button */}
        {showFirstLast && renderNavigationButton(
          "last",
          <IconChevronsRight size={16} />,
          totalPages,
          canGoNext && currentPage < totalPages - 1,
          last
        )}
      </Group>

      {/* Page info and page size selector */}
      {(showPageInfo || showPageSizeSelector) && (
        <Group justify="space-between" mt="sm">
          {renderPageInfo()}
          {renderPageSizeSelector()}
        </Group>
      )}
    </Box>
  );
}