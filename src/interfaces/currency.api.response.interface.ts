export interface ICurrencyAPIResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    [currency: string]: number;
  };
  error?: CurrencyError | null;
}


export interface CurrencyError {
  code: number;
  type: string;
}
