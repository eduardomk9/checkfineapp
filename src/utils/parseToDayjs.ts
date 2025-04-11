import dayjs, { Dayjs } from 'dayjs';

export const parseToDayjs = (value: unknown): Dayjs | null => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }
  if (typeof value === 'object' && value !== null && 'isValid' in value && typeof (value as { isValid: unknown }).isValid === 'function') {
    return value as Dayjs;
  }
  const parsed = (typeof value === 'string' || typeof value === 'number' || value instanceof Date) ? dayjs(value) : dayjs();
  return parsed.isValid() ? parsed : null;
};
