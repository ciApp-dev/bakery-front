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