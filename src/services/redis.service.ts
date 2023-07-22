import Redis from "ioredis";
import { TraceDTO } from "../dto/trace.dto";

export class RedisService {
  private readonly _client: Redis;

  constructor() {
    this._client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async get(key: string): Promise<any> {
    const data: string | null = await this._client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, traceDTO: TraceDTO): Promise<void> {
    await this._client.set(key, JSON.stringify(traceDTO));
  }

  async getKeys(pattern: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const stream = this._client.scanStream({
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

  get client(): Redis {
    return this._client;
  }
}
