import {ILocation} from "../interfaces/location.interface";
import {ILocationResponse} from "../interfaces/location.api.response.interface";

export class DistanceService {
  constructor() {
  }

  public async calculateDistance(ip: string): Promise<ILocation> {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,lat,lon,currency`
    );
    if (!response.ok) {
      throw new Error(
        `Error calling IP API. The request was not success ${response.status}`
      );
    }
    const data: ILocationResponse = await response.json();
    return this.toILocation(data, ip)
  }

  private toILocation(data: ILocationResponse, ip: string): ILocation {
    return {
      ip,
      name: data.country,
      code: data.countryCode,
      lat: data.lat,
      lon: data.lon,
      currency: data.currency,
    }
  }
}
