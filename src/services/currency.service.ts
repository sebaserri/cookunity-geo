import {ILocation} from "../interfaces/location.interface";
import {ICurrencyAPIResponse} from "../interfaces/currency.api.response.interface";

export class CurrencyService {
  private readonly CURRENCY_API_KEY: string | undefined;

  constructor() {
    this.CURRENCY_API_KEY = process.env.CURRENCY_API_KEY ?? "";
  }

  public async fetchCurrency(location: ILocation): Promise<any> {
    const response = await fetch(
      `http://data.fixer.io/api/latest?access_key=${this.CURRENCY_API_KEY}&base=USD&symbols=${location.currency}`
    );
    if (!response.ok) {
      throw new Error(
        `Error calling Currency API. The request was not success ${response.status}`
      );
    }
    const data: ICurrencyAPIResponse = await response.json();
    if (!data.success) {
      throw new Error(`Error processing call = Code: ${data?.error?.code} - Type:  ${data?.error?.type}`)
    }
    return data;
  }

}