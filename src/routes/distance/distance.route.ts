import { Router } from "express";

import { DistanceController } from "../../controllers/distance.controller";

export class DistanceRoute {
  private readonly _router: Router;
  private _distanceController: DistanceController = new DistanceController();

  constructor() {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this._router.post(
      "/traces",
      this._distanceController.traces.bind(this._distanceController)
    );
    this._router.post(
      "/statistics",
      this._distanceController.statistics.bind(this._distanceController)
    );
  }

  get router(): Router {
    return this._router;
  }

  set distanceController(distanceController: DistanceController) {
    this._distanceController = distanceController;
  }
}
