import { CurrencyDTO } from "./currency.dto";
import { ILocation } from "../interfaces/location.interface";

export class TraceDTO {
  ip: string;
  name: string;
  code: string;
  lat: number;
  lon: number;
  currencies: CurrencyDTO[];
  distanceToUSA: number;

  constructor(iLocation: ILocation, currencyDTO: CurrencyDTO[]) {
    this.ip = iLocation.ip;
    this.name = iLocation.name;
    this.code = iLocation.code;
    this.lat = iLocation.lat;
    this.lon = iLocation.lon;
    this.currencies = currencyDTO;
    this.distanceToUSA = iLocation.distanceToUSA;
  }

  public build(): TraceDTO {
    return this;
  }
}
