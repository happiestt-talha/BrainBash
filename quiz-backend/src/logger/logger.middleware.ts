import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const startTime = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const responseTime = Date.now() - startTime;
      this.logger.logRequest(method, originalUrl, statusCode, responseTime);
    });

    next();
  }
}
