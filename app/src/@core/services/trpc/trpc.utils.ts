import { Observable, catchError, from, map, of, startWith } from 'rxjs';
import { ApiLoadingResponse, ApiResponse } from './trpc.types';

/**
 * This should be used to wrap each network request.
 * It gives us a common interface for handling responses.
 * These include loading, error, and success.
 */
export function getApiResponse<T>(
  response: Promise<T>,
): Observable<ApiResponse<T>> {
  return from(response).pipe(
    map((res) => ({ status: 'success' as const, result: res })),
    startWith({ status: 'loading' as const }),
    catchError((error) =>
      of({
        status: 'error' as const,
        error: {
          message: error['shape'].message as string,
          status: error['shape']['data'].httpStatus as number,
          code: error['shape']['data'].code as string,
        },
      }),
    ),
  );
}

export function getInitialValue(): ApiLoadingResponse {
  return { status: 'loading' as const };
}
