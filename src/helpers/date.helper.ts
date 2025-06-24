import * as dayjs from 'dayjs';

export const formatDateToAPI = (date: Date): string => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
};

export const formatDateToDisplay = (date: Date): string => {
  if (!date) return '';
  return dayjs(date).format('DD/MM/YYYY');
};
