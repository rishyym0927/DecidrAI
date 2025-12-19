/**
 * Generic API response types
 */

export interface ApiError {
    success: false;
    error: string;
    message?: string;
    statusCode?: number;
}

export interface ApiSuccess<T = any> {
    success: true;
    data: T;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

export interface HealthCheckResponse {
    success: boolean;
    service: string;
    timestamp: string;
    uptime: number;
    dependencies?: Record<string, 'healthy' | 'unhealthy'>;
}
