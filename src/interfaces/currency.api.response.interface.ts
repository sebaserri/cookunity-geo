export interface ICurrencyAPIResponse {
  success: boolean;
  timestamp: Number;
  base: string;
  date: string;
  rates: Rates;
  error?: CurrencyError | null;
}

export interface Rates {
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
