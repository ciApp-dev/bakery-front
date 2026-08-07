import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RefreshTokenResponse } from '../interfaces/responses';
import { LoginService } from '../service/login-service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';

const PUBLIC_ENDPOINTS = [
	'/login',
	'/refresh',
	'/usuarios',
	'/register',
	'/forgot-password',
	'/reset-password',
];

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'access_token_expires_at';
const REFRESH_BUFFER_SECONDS = 60;

let refreshInFlight$: Observable<string> | null = null;

function parseJwtExp(token: string): number | null {
	const parts = token.split('.');

	if (parts.length !== 3) {
		return null;
	}

	try {
		const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
		const exp = payload?.exp;
		return typeof exp === 'number' ? exp : null;
	} catch {
		return null;
	}
}

function getTokenExpiryEpochSeconds(token: string): number | null {
	const storedExpiry = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY);

	if (storedExpiry && !Number.isNaN(Number(storedExpiry))) {
		return Math.floor(Number(storedExpiry) / 1000);
	}

	return parseJwtExp(token);
}

function isTokenNearExpiry(token: string, thresholdSeconds: number): boolean {
	const expEpochSeconds = getTokenExpiryEpochSeconds(token);

	if (!expEpochSeconds) {
		return false;
	}

	const nowEpochSeconds = Math.floor(Date.now() / 1000);
	return expEpochSeconds - nowEpochSeconds <= thresholdSeconds;
}

function storeTokenData(accessToken: string, expiresIn: number, refreshToken?: string): void {
	localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
	localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, (Date.now() + expiresIn * 1000).toString());

	if (refreshToken) {
		localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
	}
}

function clearTokenData(): void {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
	localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
}

function getValidAccessToken(currentToken: string, loginService: LoginService): Observable<string> {
	if (!isTokenNearExpiry(currentToken, REFRESH_BUFFER_SECONDS)) {
		return of(currentToken);
	}

	if (!refreshInFlight$) {
		refreshInFlight$ = loginService.refreshToken().pipe(
			tap((response: RefreshTokenResponse) => {
				storeTokenData(response.access_token, response.expires_in, response.refresh_token);
			}),
			map((response: RefreshTokenResponse) => response.access_token),
			catchError((error) => {
				clearTokenData();
				return throwError(() => error);
			}),
			shareReplay(1)
		);
	}

	const currentRefreshRequest$ = refreshInFlight$;

	if (!currentRefreshRequest$) {
		return throwError(() => new Error('Refresh flow was not initialized'));
	}

	return currentRefreshRequest$.pipe(
		tap({
			next: () => {
				refreshInFlight$ = null;
			},
			error: () => {
				refreshInFlight$ = null;
			},
		})
	);
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
	const loginService = inject(LoginService);
	const isPublicRequest = PUBLIC_ENDPOINTS.some((path) => request.url.includes(path));

	if (isPublicRequest) {
		return next(request);
	}

	const token = localStorage.getItem(ACCESS_TOKEN_KEY);

	if (!token) {
		return next(request);
	}

	return getValidAccessToken(token, loginService).pipe(
		switchMap((validToken) => {
			const authRequest = request.clone({
				setHeaders: {
					Authorization: `Bearer ${validToken}`,
				},
			});

			return next(authRequest);
		})
	);
};