import { format, isValid, parseISO } from "date-fns";

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Not scheduled";
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Invalid date";
    return format(date, "PPP");
  } catch {
    return "Invalid date";
  }
};

export const toISOString = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  try {
    return date.toISOString();
  } catch {
    return null;
  }
};
