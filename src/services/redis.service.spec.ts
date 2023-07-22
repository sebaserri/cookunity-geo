import { RedisService } from "./redis.service";
import { TraceDTO } from "../dto/trace.dto";
import { CurrencyDTO } from "../dto/currency.dto";
import { ILocation } from "../interfaces/location.interface";

jest.mock("ioredis", () => {
  return require("ioredis-mock");
});

describe("RedisService", () => {
  let redisService: RedisService;

  beforeEach(() => {
    redisService = new RedisService();
  });

  afterEach(async () => {
    await redisService.client.flushall();
  });

  it("sets and gets a key-value pair correctly", async () => {
    const mockKey: string = "192.200.3.10";

    const mockCurrencyDTO: CurrencyDTO = new CurrencyDTO({
      iso: "USD",
      symbol: "$",
      conversionRate: 1.0,
    });

    const mockLocation: ILocation = {
      ip: "192.168.3.35",
      name: "Argentina",
      code: "AR",
      lat: -42.912,
      lon: -71.3634554,
      currency: "ARS",
      distanceToUSA: 130003.4,
    };

    const mockValue: TraceDTO = new TraceDTO(mockLocation, [mockCurrencyDTO]);

    await redisService.set(mockKey, mockValue.build());
    const result = await redisService.get(mockKey);

    expect(result).toEqual(mockValue.build());
  });

  it("gets keys correctly", async () => {
    const mockKeys: string[] = ["Villa Traful", "Esquel", "Villa La Angostura"];

    const mockCurrencyDTO: CurrencyDTO = new CurrencyDTO({
      iso: "USD",
      symbol: "$",
      conversionRate: 1.0,
    });

    const mockLocation: ILocation = {
      ip: "123.123.123.123",
      name: "Argentina",
      code: "AR",
      lat: -42.912,
      lon: -71.3634554,
      currency: "ARS",
      distanceToUSA: 120003.4,
    };

    const mockValue: TraceDTO = new TraceDTO(mockLocation, [mockCurrencyDTO]);

    for (const key of mockKeys) {
      await redisService.set(key, mockValue.build());
    }

    const result = await redisService.getKeys("*");

    expect(result.sort()).toEqual(mockKeys.sort());
  });
});
