import { format, parseISO, isValid } from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, formatStr);
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, "MMM d, yyyy 'at' h:mm a");
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return format(date, 'h:mm a');
}

export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getMinBookingDate(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getMaxBookingDate(): Date {
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  return maxDate;
}
