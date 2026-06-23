export interface ApiResponse {
    mensaje: string;
    usuario: {
        name: string;
        email: string;
    }
}

export interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ToastSuccessfully {
    id: string;
    type: 'success' | 'error';
    message: string;
    durationMs: number;
    closable: boolean;
}

export interface ToastWrong {
    id: string;
    type: 'success' | 'error';
    message: string;
    messageDetails: string;
    durationMs: number;
    closable: boolean;
}

export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user:{
        id: number;
        name: string;
        email: string;
        estado: string;
        roles: string[];
        permissions: string[];
    }
}

export interface Permission {
    id: number;
    name: string;
}

