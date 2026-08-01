import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';
export declare class LoggerMiddleware implements NestMiddleware {
    private readonly logger;
    constructor(logger: LoggerService);
    use(request: Request, response: Response, next: NextFunction): void;
}
