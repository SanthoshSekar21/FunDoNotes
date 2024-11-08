import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';  // Import the configured Redis client

export const cache = async (req: Request, res: Response, next: NextFunction) => {
  const createdBy = req.body.createdBy;
  let cacheKey=`notes:${createdBy}`;
  try {
    const cacheData = await redisClient.get(cacheKey);
    if (cacheData) {
      console.log('Cache hit');
      return res.status(200).json({
        code: 200,
        message: 'Data from cache',
        data: JSON.parse(cacheData),
      });
    } else {
      console.log('Cache miss');
      next(); // Proceed to the next middleware/handler to fetch data from DB
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
