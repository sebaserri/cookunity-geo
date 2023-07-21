import {ILocation} from "../interfaces/location.interface";
import {ILocationResponse} from "../interfaces/location.api.response.interface";

export class DistanceService {
  constructor() {
  }

  public async fetchIpInformation(ip: string): Promise<ILocation> {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,lat,lon,currency`
    );
    if (!response.ok) {
      throw new Error(
        `Error calling IP API. The request was not success ${response.status}`
      );
    }
    const data: ILocationResponse = await response.json();
    const distance: number = this.calculateDistance(+data.lat, +data.lon);
    return this.toILocation(data, ip, distance)
  }

  private toILocation(data: ILocationResponse, ip: string, distance: number): ILocation {
    return {
      ip,
      name: data.country,
      code: data.countryCode,
      lat: data.lat,
      lon: data.lon,
      currency: data.currency,
      distanceToUSA: distance,
    } as ILocation;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public calculateDistance(latitudeDestiny: number, longitudeDestiny: number): number {
    const EARTH_RADIUS_KM: number = 6371;
    const NY_LAT: number = 40.7128;
    const NY_LON: number = -74.0060;

    const dLat: number = this.toRadians(latitudeDestiny - NY_LAT);
    const dLon: number = this.toRadians(longitudeDestiny - NY_LON);

    const latNYRadians: number = this.toRadians(NY_LAT);
    const latDestinyRadians: number = this.toRadians(latitudeDestiny);

    const halfDeltaLatitudeSin: number = Math.sin(dLat / 2);
    const halfDeltaLongitudeSin: number = Math.sin(dLon / 2);

    const haversineFormula: number = halfDeltaLatitudeSin * halfDeltaLatitudeSin +
      Math.cos(latNYRadians) * Math.cos(latDestinyRadians) *
      halfDeltaLongitudeSin * halfDeltaLongitudeSin;

    const distance: number = 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(haversineFormula), Math.sqrt(1 - haversineFormula));
    return +distance.toFixed(2);
  }
}
