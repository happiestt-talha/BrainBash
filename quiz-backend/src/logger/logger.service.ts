import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  logRequest(method: string, url: string, statusCode: number, responseTime: number) {
    const message = `${method} ${url} ${statusCode} - ${responseTime}ms`;
    
    if (statusCode >= 500) {
      this.error(message, 'RequestLogger');
    } else if (statusCode >= 400) {
      this.warn(message, 'RequestLogger');
    } else {
      this.log(message, 'RequestLogger');
    }
  }
}
