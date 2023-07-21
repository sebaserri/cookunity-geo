import { Router } from "express";
import { DistanceRoute } from "./distance/distance.route";

export class IndexRouter {
  public router: Router = Router();
  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.use("/distance", new DistanceRoute().router);
  }
}
