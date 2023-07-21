import Redis from "ioredis";
import { TraceDTO } from "../dto/trace.dto";

export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async get(key: string): Promise<any> {
    const data: string | null = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, traceDTO: TraceDTO): Promise<void> {
    await this.client.set(key, JSON.stringify(traceDTO));
  }

  async getKeys(pattern: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const stream = this.client.scanStream({
        match: pattern,
      });
      const keys: string[] = [];
      stream.on("data", (resultKeys: any) => {
        for (const key of resultKeys) {
          keys.push(key);
        }
      });
      stream.on("end", () => resolve(keys));
      stream.on("error", reject);
    });
  }
}
