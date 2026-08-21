import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type PaginatedPayload = {
  data: unknown;
  meta: unknown;
};

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, unknown> {
  private isPaginatedPayload(value: unknown): value is PaginatedPayload {
    return (
      typeof value === 'object' &&
      value !== null &&
      'data' in value &&
      'meta' in value
    );
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();

        if (this.isPaginatedPayload(data)) {
          return {
            success: true,
            statusCode: response.statusCode,
            data: data.data,
            meta: data.meta,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          statusCode: response.statusCode,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
