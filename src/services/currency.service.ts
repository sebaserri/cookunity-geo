import {ILocation} from "../interfaces/location.interface";
import {ICurrencyAPIResponse} from "../interfaces/currency.api.response.interface";
import {CurrencyDTO} from "../dto/currency.dto";

export class CurrencyService {
 // private readonly CURRENCY_API_KEY: string | undefined;

  constructor() {
 //   this.CURRENCY_API_KEY = process.env.CURRENCY_API_KEY ?? "";
  }

  public async fetchCurrency(_location: ILocation): Promise<any> {
/*    const response = await fetch(
      `http://data.fixer.io/api/latest?access_key=${this.CURRENCY_API_KEY}&base=USD&symbols=${location.currency},USD`
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
    */
    const data: ICurrencyAPIResponse = {
      "success": true,
      "timestamp": 1519296206,
      "base": "USD",
      "date": "2023-07-21",
      "rates": {
        "ARS": 0.023,
        "JPY": 107.346001,
        "EUR": 0.813399,
      }
    } as ICurrencyAPIResponse;
    return this.toICurrency(data);
  }

  private toICurrency(data: ICurrencyAPIResponse): CurrencyDTO[] {
    const ratesEntries = Object.entries(data.rates);
    return ratesEntries.map(([iso, conversionRate]) => {
      const currencyData = {
        iso,
        symbol: "$",
        conversionRate
      };

      const currencyDto: CurrencyDTO = new CurrencyDTO(currencyData);
      return currencyDto.build();
    });
  }
}