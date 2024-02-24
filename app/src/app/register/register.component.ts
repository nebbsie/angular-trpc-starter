import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  radixExclamationTriangle,
  radixGithubLogo,
  radixSymbol,
} from '@ng-icons/radix-icons';
import { HlmCardImports } from '@spartan-ng/ui-card-helm';
import { HlmButtonImports } from '@spartan-ng/ui-button-helm';
import { HlmIconImports } from '@spartan-ng/ui-icon-helm';
import { GoogleLogoComponent } from '@core/components/svgs/google-logo';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { HlmLabelImports } from '@spartan-ng/ui-label-helm';
import { HlmInputImports } from '@spartan-ng/ui-input-helm';
import { HlmAlertImports } from '@spartan-ng/ui-alert-helm';

@Component({
  selector: 'register',
  standalone: true,
  host: {
    class: 'flex justify-center p-5 w-full',
  },
  providers: [
    provideIcons({ radixGithubLogo, radixExclamationTriangle, radixSymbol }),
  ],
  template: `
    <section class="w-full max-w-xl" hlmCard>
      <div hlmCardHeader>
        <h3 hlmCardTitle>Register</h3>
        <p hlmCardDescription>Enter your details below to create an account.</p>
      </div>

      <div hlmCardContent>
        <div class="mb-10 flex items-center justify-between gap-4">
          <button
            class="flex-1"
            hlmBtn
            variant="outline"
            (click)="googleAuth()"
          >
            <google-logo class="mr-3 h-4 w-4" />
            Sign in with Google
          </button>

          <button class="flex-1" disabled hlmBtn variant="outline">
            <hlm-icon class="mr-3" size="sm" name="radixGithubLogo" />
            Sign in with GitHub
          </button>
        </div>

        <div class="mb-8 flex items-center">
          <brn-separator class="flex-grow" decorative hlmSeparator />
          <p class="mx-4 text-xs uppercase text-muted-foreground">
            or continue with
          </p>
          <brn-separator class="flex-grow" decorative hlmSeparator />
        </div>

        <label class="mb-4 block" hlmLabel>
          Email
          <input
            class="mt-1.5 w-full"
            hlmInput
            type="email"
            placeholder="user@email.com"
            [formControl]="emailControl"
          />
        </label>

        <label class="mb-6 block" hlmLabel>
          Password
          <input
            class="mt-1.5 w-full"
            hlmInput
            type="password"
            [formControl]="passwordControl"
          />
        </label>

        @if (error()) {
          <div class="mb-6" hlmAlert variant="destructive">
            <hlm-icon hlmAlertIcon name="radixExclamationTriangle" />
            <h4 hlmAlertTitle>Failed to login</h4>
            <p hlmAlertDesc>There was an issue logging in. Please try again.</p>
          </div>
        }

        <button
          class="w-full"
          hlmBtn
          [disabled]="form.invalid || loading()"
          (click)="registerWithEmail()"
        >
          @if (loading()) {
            <hlm-icon name="radixSymbol" size="sm" class="mr-2 animate-spin" />
          } @else {
            Register
          }
        </button>

        <div class="flex justify-center pt-4">
          <a
            class="text-center text-xs text-muted-foreground"
            routerLink="/login"
          >
            Got an account already?
          </a>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BrnSeparatorComponent,
    GoogleLogoComponent,
    HlmAlertImports,
    HlmButtonImports,
    HlmCardImports,
    HlmIconImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSeparatorDirective,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal<boolean>(false);
  loading = signal<boolean>(false);

  emailControl = new FormControl<string | null>(null, [
    Validators.required,
    Validators.email,
  ]);
  passwordControl = new FormControl<string | null>(null, [Validators.required]);

  form = new FormGroup({
    email: this.emailControl,
    password: this.passwordControl,
  });

  async googleAuth() {
    this.loading.set(true);

    const result = await this.auth.loginWithGoogle();
    if (!result.success) {
      this.error.set(true);
      this.loading.set(false);

      return;
    }

    await this.router.navigate(['/dashboard']);
  }

  async registerWithEmail() {
    const email = this.emailControl.value;
    const password = this.passwordControl.value;

    if (!email || !password) {
      return;
    }

    this.loading.set(true);

    const result = await this.auth.registerWithEmail(email, password);
    if (!result.success) {
      this.error.set(true);
      this.loading.set(false);

      return;
    }

    await this.router.navigate(['/dashboard']);
  }
}
