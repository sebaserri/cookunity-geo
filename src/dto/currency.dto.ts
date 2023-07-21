export class CurrencyDTO {
  iso: string;
  symbol: string;
  conversionRate: number;

  constructor(data: any) {
    this.iso = data.iso;
    this.symbol = data.symbol;
    this.conversionRate = data.conversionRate;
  }

  public build(): CurrencyDTO {
    return this;
  }
}
