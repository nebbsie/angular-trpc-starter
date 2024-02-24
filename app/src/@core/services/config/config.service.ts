import { Injectable, inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
} from '@angular/router';
import { Observable, distinctUntilChanged, filter, map } from 'rxjs';
import { Config } from './config.types';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  getConfig(): Observable<Config> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.route.snapshot),
      map((snapshot) => this.getRecursiveRouteData(snapshot)),
      distinctUntilChanged(),
    );
  }

  /**
   * Get config from nested child routes.
   * Route data is specified in appropriate RoutingModules
   */
  private getRecursiveRouteData(snapshot: ActivatedRouteSnapshot): Config {
    let { data } = snapshot;
    snapshot.children.forEach((child) => {
      data = { ...data, ...this.getRecursiveRouteData(child) };
    });
    return data as Config;
  }
}
