import redisClient from "../config/redis";

export const getCache = async (key: string) => {

    const value = await redisClient.get(key);

    console.log(
        value
            ? `Redis HIT: ${key}`
            : `Redis MISS: ${key}`
    );

    return value;
};

export const setCache = async (
    key: string,
    value: string,
    expiry: number
) => {

    await redisClient.set(key, value, {
        EX: expiry
    });

    console.log(`Redis SET: ${key}`);
};

export const deleteCache = async (
    key: string
): Promise<void> => {

    await redisClient.del(key);
};