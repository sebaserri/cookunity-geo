import { ILocation } from '../interfaces/location.interface';
import { ICurrencyAPIResponse } from '../interfaces/currency.api.response.interface';
import { CurrencyDTO } from '../dto/currency.dto';

export class CurrencyService {
  private readonly CURRENCY_API_KEY: string | undefined;

  constructor() {
    this.CURRENCY_API_KEY = process.env.CURRENCY_API_KEY ?? '';
  }

  public async fetchCurrency(location: ILocation): Promise<CurrencyDTO[]> {
    const response = await fetch(
      `http://data.fixer.io/api/latest?access_key=${this.CURRENCY_API_KEY}`,
    );
    if (!response.ok) {
      throw new Error(
        `Error calling Currency API. The request was not success ${response.status}`,
      );
    }
    const data: ICurrencyAPIResponse = await response.json();
    if (!data.success) {
      throw new Error(`Error processing call = Code: ${data?.error?.code} - Type:  ${data?.error?.type}`);
    }
    return this.toICurrency(data, location);
  }

  private toICurrency(data: ICurrencyAPIResponse, location: ILocation): CurrencyDTO[] {
    const currencies: CurrencyDTO[] = [];
    let currencyDto: CurrencyDTO = new CurrencyDTO({
      iso: location.currency,
      symbol: '$',
      conversionRate: 1 / data.rates[location.currency],
    });
    currencies.push(currencyDto.build());

    // The endpoint calculate currencies in EUR, and docs says it should be in USD.
    currencyDto = new CurrencyDTO({
      iso: 'USD',
      symbol: '$',
      conversionRate: 1,
    });
    currencies.push(currencyDto.build());
    return currencies;
  }
}
