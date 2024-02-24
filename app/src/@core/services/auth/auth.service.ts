import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { TrpcService } from '@core/services/trpc';
import { AuthResponse } from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private trpc = inject(TrpcService);

  private user$ = user(this.auth);

  private _userId = signal<number | null>(null);
  private _isAuthenticated: WritableSignal<boolean>;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      this._isAuthenticated = signal(userId !== null);

      this._userId.set(userId ? parseInt(userId, 10) : null);

      this.user$.subscribe(async (user: User | null) => {
        this._isAuthenticated.set(user !== null);
      });
    } else {
      this._isAuthenticated = signal(false);
    }
  }

  get isAuthenticated() {
    return this._isAuthenticated.asReadonly();
  }

  get userId() {
    return this._userId.asReadonly();
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    return signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(async (res) => {
        await this.handleLogin(res);
        return { success: true as const };
      })
      .catch((err) => ({ success: false as const, code: err.code }));
  }

  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(async (res) => {
        await this.handleLogin(res);
        return { success: true as const };
      })
      .catch((err) => ({ success: false as const, code: err.code }));
  }

  async registerWithEmail(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (res) => {
        await this.handleLogin(res);
        return { success: true as const };
      })
      .catch((err) => ({ success: false as const, code: err.code }));
  }

  async handleLogin(res: UserCredential) {
    if (res.user && res.user.email) {
      const createdUser = await this.trpc.server.users.createUser.mutate({
        displayName: res.user.displayName ?? res.user.uid,
        email: res.user.email,
        uid: res.user.uid,
      });

      this._userId.set(createdUser.id);
      localStorage.setItem('userId', createdUser.id.toString());

      this._isAuthenticated.set(true);
    }
  }

  async logout() {
    await signOut(this.auth);
    localStorage.removeItem('userId');
    this._isAuthenticated.set(false);
    await this.router.navigate(['/']);
  }
}
