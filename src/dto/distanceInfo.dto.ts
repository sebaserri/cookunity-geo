export class DistanceInfoDTO {
  country: string;
  value: number;

  constructor(country: string, value: number) {
    this.country = country;
    this.value = value;
  }

  public build(): DistanceInfoDTO {
    return this;
  }
}
