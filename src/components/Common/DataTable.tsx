import React, { useState, useMemo } from "react";
import {
  Table,
  Paper,
  Group,
  Text,
  Checkbox,
  ActionIcon,
  Box,
  ScrollArea,
  Loader,
  Alert,
  type PaperProps
} from "@mantine/core";
import {
  IconChevronUp,
  IconChevronDown,
  IconFilter,
  IconRefresh,
  IconDownload,
  IconSelector
} from "@tabler/icons-react";
import Button, { type ButtonProps } from "./Button";
import InputField from "./InputField";
import Pagination, { type PaginationProps } from "./Pagination";

export type DataTableColumn<T = Record<string, unknown>> = {
  key: string;
  label: string;
  accessor?: keyof T | ((row: T) => unknown);
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: "left" | "center" | "right";
  
  // Custom rendering
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  
  // Filtering
  filterType?: "text" | "select" | "number";
  filterOptions?: { value: string; label: string }[];
  
  // Styling
  headerProps?: React.ComponentProps<"th">;
  cellProps?: React.ComponentProps<"td">;
};

export type DataTableAction<T = Record<string, unknown>> = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  color?: ButtonProps["color"];
  variant?: ButtonProps["variant"];
  onClick: (row: T, index: number) => void;
  disabled?: (row: T, index: number) => boolean;
  hidden?: (row: T, index: number) => boolean;
};

export type DataTableProps<T = Record<string, unknown>> = {
  data: T[];
  columns: DataTableColumn<T>[];
  
  // Selection
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (row: T, index: number) => string;
  
  // Sorting
  sortable?: boolean;
  defaultSort?: { key: string; direction: "asc" | "desc" };
  onSort?: (key: string, direction: "asc" | "desc") => void;
  
  // Filtering & Search
  searchable?: boolean;
  filterable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: Record<string, unknown>;
  onFiltersChange?: (filters: Record<string, unknown>) => void;
  
  // Pagination
  paginated?: boolean;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  paginationProps?: Partial<PaginationProps>;
  
  // Actions
  actions?: DataTableAction<T>[];
  bulkActions?: DataTableAction<T[]>[];
  
  // Styling & Layout
  animated?: boolean;
  striped?: boolean;
  highlightOnHover?: boolean;
  withBorder?: boolean;
  withColumnBorders?: boolean;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
  
  // States
  loading?: boolean;
  error?: string | React.ReactNode;
  emptyMessage?: string | React.ReactNode;
  
  // Toolbar
  withToolbar?: boolean;
  toolbarProps?: React.ComponentProps<"div">;
  title?: string;
  subtitle?: string;
  
  // Custom components
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  
  // Event handlers
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  
} & Omit<PaperProps, "children">;

/**
 * DataTable component with sorting, filtering, pagination, and actions.
 * Built with Button, InputField, and Pagination components.
 */
export default function DataTable<T = Record<string, unknown>>({
  data,
  columns,
  
  // Selection
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId = (row, index) => index.toString(),
  
  // Sorting
  sortable = true,
  defaultSort,
  onSort,
  
  // Filtering & Search
  searchable = true,
  filterable = false,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  filters = {},
  onFiltersChange,
  
  // Pagination
  paginated = true,
  currentPage = 1,
  pageSize = 10,
  totalItems,
  onPageChange,
  onPageSizeChange,
  paginationProps,
  
  // Actions
  actions = [],
  bulkActions = [],
  
  // Styling
  animated = false,
  striped = true,
  highlightOnHover = true,
  withBorder = true,
  withColumnBorders = false,
  spacing = "sm",
  
  // States
  loading = false,
  error,
  emptyMessage = "No data available",
  
  // Toolbar
  withToolbar = true,
  toolbarProps,
  title,
  subtitle,
  
  // Custom components
  headerComponent,
  footerComponent,
  
  // Event handlers
  onRowClick,
  onRowDoubleClick,
  
  ...paperProps
}: DataTableProps<T>) {
  
  // Internal state
  const [internalSort, setInternalSort] = useState(defaultSort || { key: "", direction: "asc" as const });
  const [internalSearch, setInternalSearch] = useState(searchValue);
  const [internalFilters, setInternalFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);
  
  // Use controlled or internal state
  const currentSort = onSort ? internalSort : internalSort;
  const currentSearch = onSearchChange ? searchValue : internalSearch;
  const currentFilters = onFiltersChange ? filters : internalFilters;
  
  // Process data (if not externally managed)
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply search if not externally managed
    if (!onSearchChange && currentSearch) {
      result = result.filter(row =>
        columns.some(col => {
          if (!col.searchable) return false;
          const value = col.accessor 
            ? typeof col.accessor === "function" 
              ? col.accessor(row)
              : row[col.accessor]
            : row[col.key as keyof T];
          return String(value).toLowerCase().includes(currentSearch.toLowerCase());
        })
      );
    }
    
    // Apply filters if not externally managed
    if (!onFiltersChange && Object.keys(currentFilters).length > 0) {
      result = result.filter(row => {
        return Object.entries(currentFilters).every(([key, filterValue]) => {
          if (!filterValue) return true;
          const column = columns.find(col => col.key === key);
          if (!column) return true;
          
          const value = column.accessor
            ? typeof column.accessor === "function"
              ? column.accessor(row)
              : row[column.accessor]
            : row[column.key as keyof T];
            
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        });
      });
    }
    
    // Apply sorting if not externally managed
    if (!onSort && currentSort.key) {
      const column = columns.find(col => col.key === currentSort.key);
      if (column) {
        result.sort((a, b) => {
          const aValue = column.accessor
            ? typeof column.accessor === "function"
              ? column.accessor(a)
              : a[column.accessor]
            : a[column.key as keyof T];
          const bValue = column.accessor
            ? typeof column.accessor === "function"
              ? column.accessor(b)
              : b[column.accessor]
            : b[column.key as keyof T];
            
          const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true });
          return currentSort.direction === "asc" ? comparison : -comparison;
        });
      }
    }
    
    return result;
  }, [data, columns, currentSearch, currentFilters, currentSort, onSearchChange, onFiltersChange, onSort]);
  
  // Pagination
  const paginatedData = useMemo(() => {
    if (!paginated) return processedData;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, paginated, currentPage, pageSize]);
  
  const totalPages = Math.ceil((totalItems || processedData.length) / pageSize);
  
  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      const allIds = paginatedData.map((row, index) => getRowId(row, index));
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };
  
  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedRows, rowId]);
    } else {
      onSelectionChange(selectedRows.filter(id => id !== rowId));
    }
  };
  
  // Sorting handler
  const handleSort = (columnKey: string) => {
    const newDirection: "asc" | "desc" = currentSort.key === columnKey && currentSort.direction === "asc" ? "desc" : "asc";
    const newSort = { key: columnKey, direction: newDirection };
    
    if (onSort) {
      onSort(columnKey, newDirection);
    } else {
      setInternalSort(newSort);
    }
  };
  
  // Search handler
  const handleSearchChange = (value: unknown) => {
    const searchStr = String(value || "");
    if (onSearchChange) {
      onSearchChange(searchStr);
    } else {
      setInternalSearch(searchStr);
    }
  };
  
  // Filter handler
  const handleFilterChange = (columnKey: string, value: unknown) => {
    const newFilters = { ...currentFilters, [columnKey]: value };
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    } else {
      setInternalFilters(newFilters);
    }
  };
  
  // Bulk actions handler
  const handleBulkAction = (action: DataTableAction<T[]>) => {
    const selectedData = paginatedData.filter((row, index) => 
      selectedRows.includes(getRowId(row, index))
    );
    action.onClick(selectedData, 0);
  };
  
  // Render functions
  const renderToolbar = () => {
    if (!withToolbar) return null;
    
    return (
      <Box p={spacing} {...toolbarProps}>
        <Group justify="space-between" mb={searchable || filterable ? "sm" : 0}>
          {/* Title section */}
          <Box>
            {title && <Text size="lg" fw={600}>{title}</Text>}
            {subtitle && <Text size="sm" c="dimmed">{subtitle}</Text>}
          </Box>
          
          {/* Action buttons */}
          <Group gap="xs">
            {filterable && (
              <Button
                variant="light"
                size="sm"
                animated={animated}
                onClick={() => setShowFilters(!showFilters)}
                leftSection={<IconFilter size={16} />}
              >
                Filters
              </Button>
            )}
            
            <Button
              variant="light"
              size="sm"
              animated={animated}
              onClick={() => window.location.reload()}
              leftSection={<IconRefresh size={16} />}
            >
              Refresh
            </Button>
            
            <Button
              variant="light"
              size="sm"
              animated={animated}
              leftSection={<IconDownload size={16} />}
            >
              Export
            </Button>
          </Group>
        </Group>
        
        {/* Search and bulk actions */}
        <Group gap="sm" align="flex-end">
          {searchable && (
            <Box style={{ flex: 1 }}>
              <InputField
                type="text"
                name="search"
                placeholder={searchPlaceholder}
                value={currentSearch}
                onChange={handleSearchChange}
                animated={animated}
                style={{ marginBottom: 0 }}
              />
            </Box>
          )}
          
          {selectable && selectedRows.length > 0 && bulkActions.length > 0 && (
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                {selectedRows.length} selected
              </Text>
              {bulkActions.map((action) => (
                <Button
                  key={action.key}
                  size="sm"
                  variant={action.variant || "light"}
                  color={action.color}
                  animated={animated}
                  onClick={() => handleBulkAction(action)}
                  leftSection={action.icon}
                >
                  {action.label}
                </Button>
              ))}
            </Group>
          )}
        </Group>
        
        {/* Filters */}
        {filterable && showFilters && (
          <Group gap="sm" mt="sm" p="sm" style={{ backgroundColor: "var(--mantine-color-gray-0)", borderRadius: "var(--mantine-radius-sm)" }}>
            {columns.filter(col => col.filterable).map((column) => (
              <Box key={column.key} style={{ minWidth: 200 }}>
                <InputField
                  type={column.filterType === "number" ? "number" : column.filterType === "select" ? "select" : "text"}
                  name={`filter-${column.key}`}
                  label={`Filter ${column.label}`}
                  value={currentFilters[column.key] || ""}
                  onChange={(value) => handleFilterChange(column.key, value)}
                  data={column.filterOptions}
                  animated={animated}
                />
              </Box>
            ))}
          </Group>
        )}
      </Box>
    );
  };
  
  const renderTableHeader = () => {
    const isAllSelected = selectedRows.length > 0 && selectedRows.length === paginatedData.length;
    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < paginatedData.length;
    
    return (
      <Table.Thead>
        <Table.Tr>
          {selectable && (
            <Table.Th style={{ width: 40 }}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={(event) => handleSelectAll(event.currentTarget.checked)}
              />
            </Table.Th>
          )}
          
          {columns.map((column) => (
            <Table.Th
              key={column.key}
              style={{
                width: column.width,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
                textAlign: column.align,
                cursor: column.sortable && sortable ? "pointer" : "default"
              }}
              onClick={() => column.sortable && sortable && handleSort(column.key)}
              {...column.headerProps}
            >
              <Group gap="xs" wrap="nowrap" justify={column.align === "center" ? "center" : column.align === "right" ? "flex-end" : "flex-start"}>
                {column.headerRender ? column.headerRender() : column.label}
                
                {column.sortable && sortable && (
                  <Box>
                    {currentSort.key === column.key ? (
                      currentSort.direction === "asc" ? (
                        <IconChevronUp size={14} />
                      ) : (
                        <IconChevronDown size={14} />
                      )
                    ) : (
                      <IconSelector size={14} style={{ opacity: 0.5 }} />
                    )}
                  </Box>
                )}
              </Group>
            </Table.Th>
          ))}
          
          {actions.length > 0 && (
            <Table.Th style={{ width: actions.length * 40 }}>Actions</Table.Th>
          )}
        </Table.Tr>
      </Table.Thead>
    );
  };
  
  const renderTableBody = () => {
    if (loading) {
      return (
        <Table.Tbody>
          <Table.Tr>
            <Table.Td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}>
              <Group justify="center" p="xl">
                <Loader size="md" />
                <Text>Loading...</Text>
              </Group>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      );
    }
    
    if (error) {
      return (
        <Table.Tbody>
          <Table.Tr>
            <Table.Td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}>
              <Alert color="red" p="xl">
                {error}
              </Alert>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      );
    }
    
    if (paginatedData.length === 0) {
      return (
        <Table.Tbody>
          <Table.Tr>
            <Table.Td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}>
              <Text ta="center" p="xl" c="dimmed">
                {emptyMessage}
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      );
    }
    
    return (
      <Table.Tbody>
        {paginatedData.map((row, index) => {
          const rowId = getRowId(row, index);
          const isSelected = selectedRows.includes(rowId);
          
          return (
            <Table.Tr
              key={rowId}
              style={{
                cursor: onRowClick ? "pointer" : "default",
                backgroundColor: isSelected ? "var(--mantine-color-blue-0)" : undefined
              }}
              onClick={() => onRowClick?.(row, index)}
              onDoubleClick={() => onRowDoubleClick?.(row, index)}
            >
              {selectable && (
                <Table.Td>
                  <Checkbox
                    checked={isSelected}
                    onChange={(event) => handleSelectRow(rowId, event.currentTarget.checked)}
                  />
                </Table.Td>
              )}
              
              {columns.map((column) => {
                const value = column.accessor
                  ? typeof column.accessor === "function"
                    ? column.accessor(row)
                    : row[column.accessor]
                  : row[column.key as keyof T];
                
                return (
                  <Table.Td
                    key={column.key}
                    style={{ textAlign: column.align }}
                    {...column.cellProps}
                  >
                    {column.render ? column.render(value, row, index) : String(value || "")}
                  </Table.Td>
                );
              })}
              
              {actions.length > 0 && (
                <Table.Td>
                  <Group gap="xs" wrap="nowrap">
                    {actions.map((action) => {
                      const isHidden = action.hidden?.(row, index);
                      const isDisabled = action.disabled?.(row, index);
                      
                      if (isHidden) return null;
                      
                      return (
                        <ActionIcon
                          key={action.key}
                          size="sm"
                          variant={action.variant || "subtle"}
                          color={action.color}
                          disabled={isDisabled}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row, index);
                          }}
                          title={action.label}
                        >
                          {action.icon}
                        </ActionIcon>
                      );
                    })}
                  </Group>
                </Table.Td>
              )}
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    );
  };
  
  return (
    <Paper withBorder={withBorder} {...paperProps}>
      {headerComponent}
      
      {renderToolbar()}
      
      <ScrollArea>
        <Table
          striped={striped}
          highlightOnHover={highlightOnHover}
          withColumnBorders={withColumnBorders}
          verticalSpacing={spacing}
          horizontalSpacing={spacing}
        >
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </ScrollArea>
      
      {paginated && totalPages > 1 && onPageChange && (
        <Box p={spacing}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems || processedData.length}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            animated={animated}
            showFirstLast={true}
            showPrevNext={true}
            showPageInfo={true}
            showPageSizeSelector={true}
            {...paginationProps}
          />
        </Box>
      )}
      
      {footerComponent}
    </Paper>
  );
}