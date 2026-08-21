import { Tone } from "@/theme/Theme.types";

// Badge.tsx
export type BadgeTone = Tone;

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  iconName?: string;
  showIcon?: boolean;
}

// Button.tsx
export type ButtonVariant = "primary" | "default" | "subtle" | "danger";

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  iconName?: string;
  disabled?: boolean;
  busy?: boolean;
  /** Required when the visible label is not the full accessible name. */
  ariaLabel?: string;
  type?: "button" | "submit";
  href?: string;
  /** Opens an href in a new tab, with the opener relationship dropped. */
  newTab?: boolean;
  title?: string;
}

// MenuButton.tsx
export interface MenuButtonItem {
  key: string;
  label: string;
  iconName?: string;
  disabled?: boolean;
  onClick: () => void;
}

export interface MenuButtonProps {
  label: string;
  iconName?: string;
  items: MenuButtonItem[];
  disabled?: boolean;
}

// Card.tsx
export interface AccordionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  padded?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

// Checkbox.tsx
export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
}

// ComboBox.tsx
export interface PickerProps {
  label: string;
  options: SelectOption[];
  selectedKey?: string;
  onChange: (key: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface ComboBoxProps {
  label: string;
  options: SelectOption[];
  selectedKey?: string;
  onChange: (key: string) => void;
  /** Lets the user type a value that is not in the list. */
  allowFreeform?: boolean;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
}

// DatePickerField.tsx
export interface DatePickerFieldProps {
  label: string;
  value?: Date;
  onChange: (value: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

// Drawer.tsx
export interface DrawerProps {
  open: boolean;
  title: string;
  onDismiss: () => void;
  width?: "small" | "medium" | "large";
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

// Dropdown.tsx
export interface SelectOption {
  key: string;
  text: string;
  disabled?: boolean;
}

export interface DropdownProps {
  label: string;
  options: SelectOption[];
  selectedKey?: string;
  onChange: (key: string) => void;
  placeholder?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
}

// FieldRow.tsx
export interface FieldRowProps {
  /** Minimum column width before the row wraps. */
  minColumnWidth?: number;
  children: React.ReactNode;
}

// IconButton.tsx
export interface IconButtonProps {
  iconName: string;
  /** Icon-only controls have no visible text, so this is the accessible name. */
  ariaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  toggled?: boolean;
  tooltip?: string;
}

// Modal.tsx
export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onDismiss: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  width?: "small" | "medium" | "large";
}

// MultiDropdown.tsx
export interface MultiDropdownProps {
  label: string;
  options: SelectOption[];
  selectedKeys: string[];
  onChange: (keys: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Notice.tsx
export type NoticeTone = "info" | "success" | "warning" | "error";

export interface NoticeProps {
  tone?: NoticeTone;
  message: string;
  onDismiss?: () => void;
  actions?: React.ReactNode;
}

// NumberField.tsx
export interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  suffix?: string;
}

// PageHeader.tsx
export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

// ProgressBar.tsx
export type ProgressStatus =
  | "pending"
  | "queued"
  | "interrupted"
  | "waiting"
  | "running"
  | "throttled"
  | "paused"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "skipped";

export interface ProgressBarProps {
  label?: string;
  description?: string;
  /** 0..1. Omit for an indeterminate bar. */
  ratio?: number;
  status?: ProgressStatus;
  compact?: boolean;
  countLabel?: string;
}

export interface ProgressStep {
  key: string;
  label: string;
  /** Whether the step spends its time on requests, on local work, or both. */
  work?: "network" | "client" | "both";
  status: ProgressStatus;
  ratio?: number;
  message?: string;
  countLabel?: string;
}

export interface ProgressGroupProps {
  label: string;
  status?: ProgressStatus;
  ratio?: number;
  steps: ProgressStep[];
  description?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  stepsLabel?: string;
}

export interface ProgressRingProps {
  ratio?: number;
  size?: number;
  thickness?: number;
  label?: string;
  status?: ProgressStatus;
}

export interface PreviewSection {
  key: string;
  title?: string;
  content: React.ReactNode;
}

export interface PreviewDialogProps {
  open: boolean;
  title: string;
  description?: string;
  /** Controls rendered in the dialog header, beside the close button. */
  headerActions?: React.ReactNode;
  /** Small facts rendered as a definition list under the description. */
  facts?: { label: string; value: React.ReactNode }[];
  sections?: PreviewSection[];
  actions?: React.ReactNode;
  onDismiss: () => void;
  width?: "medium" | "large" | "full";
  children?: React.ReactNode;
}

export interface ErrorDrawerProps {
  open: boolean;
  title: string;
  message: string;
  context?: { label: string; value: string }[];
  onDismiss: () => void;
  onRetry?: () => void;
  retryLabel?: string;
}

export interface StatusBadgeProps {
  status: ProgressStatus;
  label?: string;
}

// RadioGroup.tsx
export interface RadioGroupProps {
  label: string;
  options: SelectOption[];
  selectedKey?: string;
  onChange: (key: string) => void;
  disabled?: boolean;
  inline?: boolean;
}

// SearchBox.tsx
export interface SearchBoxProps {
  /** Search boxes rarely carry a visible label, so this becomes the aria-label. */
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  width?: number | string;
}

// Spinner.tsx
export interface SpinnerProps {
  label?: string;
  size?: "small" | "medium" | "large";
}

// StatTile.tsx
export interface StatTileSpec {
  key: string;
  label: string;
  value: string;
  hint?: string;
  info?: string;
  tone?: BadgeTone;
  badge?: string;
  /** Fluent icon name shown beside the value, so a tile reads at a glance. */
  iconName?: string;
  /** The run did not measure this. Reads NA and dims, rather than claiming zero. */
  unavailable?: boolean;
  /** Same measure from the run being compared against, if one was chosen. */
  previousValue?: number;
  /** This run's measure as a number, so a change can be worked out. */
  currentValue?: number;
}

export interface StatGridProps {
  tiles: StatTileSpec[];
  /** Tiles per row before wrapping. The grid always fills its container. */
  columns?: number;
  minWidth?: number;
  /** Groups the tiles under a heading, for a grid that covers several subjects. */
  title?: string;
}

export interface StatTileProps {
  label: string;
  value: string;
  iconName?: string;
  unavailable?: boolean;
  previousValue?: number;
  currentValue?: number;
  hint?: string;
  tone?: BadgeTone;
  badge?: string;
  /** Shown on an info icon, for anything the label cannot say. */
  info?: string;
  width?: number;
}

// Table.tsx
export interface TableColumn<TRow> {
  key: string;
  header: string;
  minWidth?: number;
  maxWidth?: number;
  render: (row: TRow) => React.ReactNode;
  /** Supplying this makes the column sortable. */
  sortValue?: (row: TRow) => string | number;
  /** Supplying this adds a value filter for the column. */
  filterValue?: (row: TRow) => string;
}

export interface TableProps<TRow> {
  ariaLabel: string;
  columns: TableColumn<TRow>[];
  rows: TRow[];
  getRowKey: (row: TRow) => string;
  onRowClick?: (row: TRow) => void;
  compact?: boolean;
  initialSortKey?: string;
  initialSortDescending?: boolean;
  /** Hides the generated filter bar even when columns declare filterValue. */
  hideFilters?: boolean;
  emptyLabel?: string;
  /** Supplying this adds a keyword search box over the returned text. */
  searchValue?: (row: TRow) => string;
  searchLabel?: string;
  /** Rows scroll inside the table above this height, which keeps long tables fast. */
  maxHeight?: number;
  /** Lets the table grow with its rows instead of scrolling inside itself. */
  fill?: boolean;
  /** Extra controls rendered alongside the generated filters. */
  extraFilters?: React.ReactNode;
}

// Tabs.tsx
export interface TabItem {
  key: string;
  label: string;
  iconName?: string;
  count?: number;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  selectedKey?: string;
  onChange?: (key: string) => void;
  ariaLabel: string;
}

// TextArea.tsx
export interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  resizable?: boolean;
}

// TextField.tsx
export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  iconName?: string;
}

// Toggle.tsx
export interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onText?: string;
  offText?: string;
  inlineLabel?: boolean;
  disabled?: boolean;
}

// Toolbar.tsx
export interface ToolbarProps {
  ariaLabel: string;
  children: React.ReactNode;
}
