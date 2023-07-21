import { NextFunction, Request, Response } from "express";
import { DistanceService } from "../services/distance.service";
import _ from "lodash";
import { isValidIP } from "../utils/commons";
import {ILocation} from "../interfaces/location.interface";
import {CurrencyService} from "../services/currency.service";
import {CurrencyDTO} from "../dto/currency.dto";
import {TraceDTO} from "../dto/trace.dto";
import {DistanceInfoDTO} from "../dto/distanceInfo.dto";
import {TraceInfoDTO} from "../dto/traceInfo.dto";
import {StatisticsDTO} from "../dto/stadistics.dto";

export class DistanceController {
  private _distanceService: DistanceService = new DistanceService();
  private _currencyService: CurrencyService = new CurrencyService();
  private locationMap: Map<string, TraceDTO> = new Map();
  constructor() {}

  public async traces(req: Request, res: Response, next: NextFunction) {
    const { ip } = req.body;
    if (_.isNil(ip)) {
      req.statusCode = 400;
      return next(new Error("Missing parameters"));
    } else if (!isValidIP(ip)) {
      req.statusCode = 400;
      return next(new Error("Not valid IP"));
    }

    try {
      if (this.locationMap.has(ip)) {
        return res.json(this.locationMap.get(ip));
      }
      const location: ILocation = await this._distanceService.fetchIpInformation(ip);
      const data: CurrencyDTO[] = await this._currencyService.fetchCurrency(location);
      const traceDTO: TraceDTO = new TraceDTO(location, data);
      this.locationMap.set(ip, traceDTO);
      res.json(traceDTO.build());
    } catch (e) {
      next(e);
    }
  }

  public async statistics(req: Request, res: Response, _next: NextFunction): Promise<void> {
    let longestDistance = 0;
    let longestDistanceCountry = '';

    const countryTraceCounts: {[key: string]: number} = {};

    for (const traceDTO of this.locationMap.values()) {
      if (traceDTO.distanceToUSA > longestDistance) {
        longestDistance = traceDTO.distanceToUSA;
        longestDistanceCountry = traceDTO.name;
      }

      if (countryTraceCounts[traceDTO.name]) {
        countryTraceCounts[traceDTO.name]++;
      } else {
        countryTraceCounts[traceDTO.name] = 1;
      }
    }

    let mostTracedCountry = '';
    let mostTraces = 0;

    for (const country in countryTraceCounts) {
      if (countryTraceCounts[country] > mostTraces) {
        mostTraces = countryTraceCounts[country];
        mostTracedCountry = country;
      }
    }

    const longestDistanceInfo: DistanceInfoDTO = new DistanceInfoDTO(longestDistanceCountry, longestDistance).build();
    const mostTracedInfo: TraceInfoDTO = new TraceInfoDTO(mostTracedCountry, mostTraces).build();
    const statistics: StatisticsDTO = new StatisticsDTO(longestDistanceInfo, mostTracedInfo).build();
    res.json(statistics);
  }

  set distanceService(distanceService: DistanceService) {
    this._distanceService = distanceService;
  }

  set currencyService(currencyService: CurrencyService) {
    this._currencyService = currencyService;
  }
}
