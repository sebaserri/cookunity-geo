import { TraceInfoDTO } from "./traceInfo.dto";
import { DistanceInfoDTO } from "./distanceInfo.dto";

export class StatisticsDTO {
  longestDistance: DistanceInfoDTO;
  mostTraced: TraceInfoDTO;

  constructor(longestDistance: DistanceInfoDTO, mostTraced: TraceInfoDTO) {
    this.longestDistance = longestDistance;
    this.mostTraced = mostTraced;
  }

  public build(): StatisticsDTO {
    return this;
  }
}
