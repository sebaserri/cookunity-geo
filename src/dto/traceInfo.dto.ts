export class TraceInfoDTO {
  country: string;
  value: number;

  constructor(country: string, value: number) {
    this.country = country;
    this.value = value;
  }

  public build(): TraceInfoDTO {
    return this;
  }
}
