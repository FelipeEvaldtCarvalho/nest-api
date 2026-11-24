import { BadRequestException } from '@nestjs/common';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Valida uma data 'YYYY-MM-DD' (formato das colunas DATE) e a devolve como veio.
export const assertIsoDate = (value: string): string => {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) {
    throw new BadRequestException('Data inválida. Use AAAA-MM-DD');
  }
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    throw new BadRequestException('Data inválida');
  }
  return value;
};
