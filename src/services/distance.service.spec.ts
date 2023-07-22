import { DistanceService } from "./distance.service";
import { ILocationResponse } from "../interfaces/location.api.response.interface";
import fetchMock from "jest-fetch-mock";

global.fetch = fetchMock as any;

describe("DistanceService", () => {
  let distanceService: DistanceService;

  beforeEach(() => {
    fetchMock.resetMocks();
    distanceService = new DistanceService();
  });

  it("fetches ip information correctly", async () => {
    const myIpMocked: string = "192.168.33.125";
    const mockResponse: ILocationResponse = {
      status: "success",
      country: "Country",
      countryCode: "CC",
      lat: 34.34,
      lon: 43.43,
      currency: "Currency",
    } as ILocationResponse;

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await distanceService.fetchIpInformation(myIpMocked);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `http://ip-api.com/json/${myIpMocked}?fields=status,message,country,countryCode,lat,lon,currency`
    );
    expect(result).toEqual({
      ip: myIpMocked,
      name: mockResponse.country,
      code: mockResponse.countryCode,
      lat: mockResponse.lat,
      lon: mockResponse.lon,
      currency: mockResponse.currency,
      distanceToUSA: distanceService.calculateDistance(
        mockResponse.lat,
        mockResponse.lon
      ),
    });
  });

  it("calculates distance correctly", () => {
    const lat: number = 34.34;
    const lon: number = 43.43;

    const distance = distanceService.calculateDistance(lat, lon);
    expect(distance).toBeGreaterThan(0);
  });
});
