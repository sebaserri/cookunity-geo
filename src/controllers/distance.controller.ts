import { NextFunction, Request, Response } from "express";
import { DistanceService } from "../services/distance.service";
import _ from "lodash";
import { isValidIP } from "../utils/commons";
import {ILocation} from "../interfaces/location.interface";
import {CurrencyService} from "../services/currency.service";

export class DistanceController {
  private _distanceService: DistanceService = new DistanceService();
  private _currencyService: CurrencyService = new CurrencyService();
//  private locationMap: Map<string, any> = new Map();
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
/*      if (this.locationMap.has(ip)) {
        return res.json(this.locationMap.get(ip));
      }*/
      const location: ILocation = await this._distanceService.calculateDistance(ip);
      const data = await this._currencyService.fetchCurrency(location);
//      this.locationMap.set(ip, location);
      res.json( { location, data});
    } catch (e) {
      next(e);
    }
  }

  public async statistics(req: Request, res: Response, next: NextFunction) {}

  set distanceService(distanceService: DistanceService) {
    this._distanceService = distanceService;
  }
}
