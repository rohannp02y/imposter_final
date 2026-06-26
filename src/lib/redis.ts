import { createClient, type RedisClientType } from "redis";

const globalForRedis = globalThis as unknown as {
  redis: RedisClientType | undefined;
};

let redisClient: RedisClientType;

async function getRedisClient(): Promise<RedisClientType> {
  if (globalForRedis.redis) {
    return globalForRedis.redis;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  redisClient.on("connect", () => console.log("Redis connected"));

  await redisClient.connect();
  globalForRedis.redis = redisClient;

  return redisClient;
}

export { getRedisClient };

export async function setGameState(code: string, state: unknown, ttl = 3600) {
  const client = await getRedisClient();
  await client.setEx(`game:${code}`, ttl, JSON.stringify(state));
}

export async function getGameState(code: string) {
  const client = await getRedisClient();
  const data = await client.get(`game:${code}`);
  return data ? JSON.parse(data) : null;
}

export async function deleteGameState(code: string) {
  const client = await getRedisClient();
  await client.del(`game:${code}`);
}

export async function addActiveGame(code: string) {
  const client = await getRedisClient();
  await client.sAdd("active_games", code);
}

export async function removeActiveGame(code: string) {
  const client = await getRedisClient();
  await client.sRem("active_games", code);
}

export async function getActiveGames(): Promise<string[]> {
  const client = await getRedisClient();
  return client.sMembers("active_games");
}

export async function setPlayerInRoom(code: string, userId: string) {
  const client = await getRedisClient();
  await client.sAdd(`room:${code}:players`, userId);
}

export async function removePlayerFromRoom(code: string, userId: string) {
  const client = await getRedisClient();
  await client.sRem(`room:${code}:players`, userId);
}

export async function getPlayersInRoom(code: string): Promise<string[]> {
  const client = await getRedisClient();
  return client.sMembers(`room:${code}:players`);
}

export async function setUserOnline(userId: string) {
  const client = await getRedisClient();
  await client.setEx(`user:${userId}:online`, 300, "1");
}

export async function setUserOffline(userId: string) {
  const client = await getRedisClient();
  await client.del(`user:${userId}:online`);
}

export async function isUserOnline(userId: string): Promise<boolean> {
  const client = await getRedisClient();
  const result = await client.exists(`user:${userId}:online`);
  return result === 1;
}
