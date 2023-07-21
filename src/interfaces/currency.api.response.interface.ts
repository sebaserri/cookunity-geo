export interface ICurrencyAPIResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: IRate;
  error?: CurrencyError | null;
}

export interface IRate {
  ARS?: number;
  USD?: number;
  GBP?: number;
  JPY?: number;
  EUR?: number;
  AUD?: number;
  CAD?: number;
}

export interface CurrencyError {
  code: number;
  type: string;
}
