import { inject, Injectable } from '@angular/core';
import { Auth, onIdTokenChanged } from '@angular/fire/auth';
import { BehaviorSubject, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  private auth = inject(Auth);

  // NULL = still waiting for response
  // UNDEFINED = not logged in
  // STRING = logged in
  private _token$: BehaviorSubject<string | null | undefined> =
    new BehaviorSubject<string | null | undefined>(null);

  constructor() {
    onIdTokenChanged(this.auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        this._token$.next(token);
      } else {
        this._token$.next(undefined);
      }
    });
  }

  get authToken() {
    return this._token$.asObservable().pipe(
      filter((token) => token !== null),
      map((token) => {
        return token === null ? undefined : token;
      }),
    );
  }
}
