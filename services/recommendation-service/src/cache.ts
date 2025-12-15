import { getRedisClient } from "../../../packages/db/src/index";

const redis = getRedisClient();

export async function getCachedRecommendations(key: string) {
  const data = await redis.get(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    // Optionally log the error here
    return null;
  }
}

export async function setCachedRecommendations(
  key: string,
  value: any,
  ttlSeconds = 86400
) {
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}
