import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class DecimalInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => this.transformPrice(data)),
        );
    }

    private transformPrice(data: any): any {
        if (Array.isArray(data)) {
            return data.map((item) => this.transformPrice(item));
        } else if (data && typeof data === 'object') {
            const updated = {...data};
            if (Object.hasOwn(updated, 'price') && !isNaN(+updated.price)) {
                updated.price = Intl.NumberFormat(
                    'id-ID',
                    {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                    }
                ).format(+updated.price);
            }
            return updated;
        }
        return data
    }
}
