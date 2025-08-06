// types.ts
export type Threshold = {
  id: number;
  partNumber: string;
  standard: string;
  limitHigh: number;
  limitLow: number;
};

export type Mode = "add" | "edit";

export type Props = {
  isOpen: boolean;
  onClose: () => void;
};
