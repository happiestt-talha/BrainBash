import { Logger } from '@nestjs/common';
export declare class LoggerService extends Logger {
    logRequest(method: string, url: string, statusCode: number, responseTime: number): void;
}
