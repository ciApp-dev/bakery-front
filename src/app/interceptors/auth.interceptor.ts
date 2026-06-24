import { HttpInterceptorFn } from '@angular/common/http';

const PUBLIC_ENDPOINTS = [
	'/login',
	'/usuarios',
	'/register',
	'/forgot-password',
	'/reset-password',
];

export const authInterceptor: HttpInterceptorFn = (request, next) => {
	const isPublicRequest = PUBLIC_ENDPOINTS.some((path) => request.url.includes(path));

	if (isPublicRequest) {
		return next(request);
	}

	const token = localStorage.getItem('access_token');

	if (!token) {
		return next(request);
	}

	const authRequest = request.clone({
		setHeaders: {
			Authorization: `Bearer ${token}`,
		},
	});

	return next(authRequest);
};