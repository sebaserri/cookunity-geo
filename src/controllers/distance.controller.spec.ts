import { DistanceController } from "./distance.controller";
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { DistanceService } from "../services/distance.service";
import { CurrencyService } from "../services/currency.service";
import { TraceDTO } from '../dto/trace.dto';
import { CurrencyDTO } from '../dto/currency.dto';
import { ILocation } from '../interfaces/location.interface';
import { RedisService } from "../services/redis.service";
import { TraceInfoDTO } from '../dto/traceInfo.dto';
import { DistanceInfoDTO } from '../dto/distanceInfo.dto';
import { getDateFormatted } from '../utils/commons';

describe("DistanceController", () => {
  let distanceController: DistanceController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  let mockDistanceService: Partial<DistanceService>;
  let mockCurrencyService: Partial<CurrencyService>;
  let mockRedisService: Partial<RedisService>;

  beforeEach(() => {
    distanceController = new DistanceController();

    mockDistanceService = { fetchIpInformation: jest.fn() };
    mockCurrencyService = { fetchCurrency: jest.fn() };
    mockRedisService = { get: jest.fn(), set: jest.fn() };

    distanceController.distanceService = mockDistanceService as DistanceService;
    distanceController.currencyService = mockCurrencyService as CurrencyService;
    distanceController.redisService = mockRedisService as RedisService;

    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("traces", () => {
    it("should respond with error if IP is missing", async () => {
      mockRequest.body = {};
      await distanceController.traces(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
      expect(nextFunction).toHaveBeenCalledWith(new Error("Missing parameters"));
    });

    it("should respond with error if IP is not valid", async () => {
      mockRequest.body = { ip: "invalid_ip" };
      await distanceController.traces(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
      expect(nextFunction).toHaveBeenCalledWith(new Error("Not valid IP"));
    });

    it("should respond with data from cache if available", async () => {
      const mockCurrencyDTO: CurrencyDTO = new CurrencyDTO({
        iso: "USD",
        symbol: "$",
        conversionRate: 1.0,
      });

      const mockLocation: ILocation = {
        ip: "192.168.1.1",
        name: "Argentina",
        code: "AR",
        lat: -42.912,
        lon: -71.3634554,
        currency: "ARS",
        distanceToUSA: 130003.4,
      };

      const mockCachedData: TraceDTO = new TraceDTO(mockLocation, [mockCurrencyDTO]);

      mockRequest.body = { ip: "192.168.1.1" };
      mockRedisService.get = jest.fn().mockResolvedValue(mockCachedData);

      await distanceController.traces(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRedisService.get).toHaveBeenCalledWith(mockLocation.ip + getDateFormatted());
      expect(mockResponse.json).toHaveBeenCalledWith(mockCachedData);
    });

    it("should fetch data if not available in cache", async () => {
      const mockCurrencyDTO: CurrencyDTO = new CurrencyDTO({
        iso: "USD",
        symbol: "$",
        conversionRate: 1.0,
      });

      const mockLocation: ILocation = {
        ip: "192.168.1.1",
        name: "Argentina",
        code: "AR",
        lat: -42.912,
        lon: -71.3634554,
        currency: "ARS",
        distanceToUSA: 130003.4,
      };

      const mockTrace: TraceDTO = new TraceDTO(mockLocation, [mockCurrencyDTO]);

      mockRequest.body = { ip: "192.168.1.1" };
      mockRedisService.get = jest.fn().mockResolvedValue(null);
      mockDistanceService.fetchIpInformation = jest.fn().mockResolvedValue(mockLocation);
      mockCurrencyService.fetchCurrency = jest.fn().mockResolvedValue([mockCurrencyDTO]);
      mockRedisService.set = jest.fn().mockResolvedValue(undefined);

      await distanceController.traces(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRedisService.get).toHaveBeenCalledWith(mockLocation.ip + getDateFormatted());
      expect(mockDistanceService.fetchIpInformation).toHaveBeenCalledWith("192.168.1.1");
      expect(mockCurrencyService.fetchCurrency).toHaveBeenCalledWith(mockLocation);
      expect(mockRedisService.set).toHaveBeenCalledWith("192.168.1.1", mockTrace);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTrace);
    });
  });

  describe("statistics", () => {
    it("should calculate statistics correctly", async () => {
      const mockTraceDTO1: TraceDTO = new TraceDTO(
        { ip: "192.168.1.1", name: "Argentina", code: "AR", lat: -42.912, lon: -71.3634554, currency: "ARS", distanceToUSA: 130003.4 },
        [new CurrencyDTO({ iso: "USD", symbol: "$", conversionRate: 1.0 })]
      );

      const mockTraceDTO2: TraceDTO = new TraceDTO(
        { ip: "192.168.1.2", name: "Brazil", code: "BR", lat: -42.912, lon: -71.3634554, currency: "BRL", distanceToUSA: 140003.4 },
        [new CurrencyDTO({ iso: "USD", symbol: "$", conversionRate: 1.0 })]
      );

      mockRedisService.getKeys = jest.fn().mockResolvedValue(["192.168.1.1", "192.168.1.2"]);
      mockRedisService.get = jest.fn()
        .mockResolvedValueOnce(mockTraceDTO1)
        .mockResolvedValueOnce(mockTraceDTO2);

      await distanceController.statistics(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRedisService.getKeys).toHaveBeenCalledWith("*");
      expect(mockRedisService.get).toHaveBeenCalledTimes(2);
      expect(mockRedisService.get).toHaveBeenCalledWith("192.168.1.1");
      expect(mockRedisService.get).toHaveBeenCalledWith("192.168.1.2");
      expect(mockResponse.json).toHaveBeenCalledWith({
        longestDistance: new DistanceInfoDTO("Brazil", 140003.4),
        mostTraced: new TraceInfoDTO("Argentina", 1),
      });
    });
  });
});
