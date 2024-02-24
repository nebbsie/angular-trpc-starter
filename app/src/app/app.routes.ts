import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'login',
		data: {
			hideNavbar: true,
		},
		loadComponent: () =>
			import('./login/login.component').then((c) => c.LoginComponent),
	},
	{
		path: 'register',
		data: {
			hideNavbar: true,
		},
		loadComponent: () =>
			import('./register/register.component').then((c) => c.RegisterComponent),
	},
	{
		path: '404',
		loadComponent: () =>
			import('./not-found/not-found.component').then(
				(c) => c.NotFoundComponent,
			),
	},
	{
		path: '**',
		loadComponent: () =>
			import('./not-found/not-found.component').then(
				(c) => c.NotFoundComponent,
			),
	},
];
