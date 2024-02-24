import { inject, Injectable, signal } from '@angular/core';
import { AuthTokenService } from '@core/services/auth/auth-token.service';
import { AppRouter } from '@trpc-server/server';
import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import { firstValueFrom } from 'rxjs';
import superjson from 'superjson';
import { WebsocketState } from './trpc.types';

@Injectable({
  providedIn: 'root',
})
export class TrpcService {
  private tokenService = inject(AuthTokenService);

  private _wsConnected = signal<WebsocketState>(WebsocketState.CONNECTING);

  public server = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      splitLink({
        condition: (op) => {
          return op.type === 'subscription' || op.path === 'editors.typing';
        },
        true: wsLink({
          client: createWSClient({
            url: 'ws://localhost:3000/trpc',
            onOpen: () => {
              this._wsConnected.set(WebsocketState.OPEN);
            },
            onClose: () => {
              this._wsConnected.set(WebsocketState.CLOSED);
            },
          }),
        }),
        false: httpBatchLink({
          headers: async () => {
            const token = await firstValueFrom(this.tokenService.authToken);
            return {
              authorization: token,
            };
          },
          url: 'http://localhost:3000/trpc',
        }),
      }),
    ],
  });

  get wsConnected() {
    return this._wsConnected.asReadonly();
  }
}
