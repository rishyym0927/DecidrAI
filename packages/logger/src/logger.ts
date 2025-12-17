export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

const COLORS = {
    reset: '\x1b[0m',
    gray: '\x1b[90m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    cyan: '\x1b[36m'
};

/**
 * Create a logger instance for a service
 */
export function createLogger(serviceName: string, minLevel: LogLevel = 'info') {
    const currentLevel = LOG_LEVELS[minLevel];

    const formatTimestamp = (): string => new Date().toISOString();

    const log = (level: LogLevel, message: string, meta?: Record<string, unknown>): void => {
        if (LOG_LEVELS[level] < currentLevel) return;

        const timestamp = formatTimestamp();
        const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';

        let color = COLORS.reset;
        switch (level) {
            case 'debug': color = COLORS.gray; break;
            case 'info': color = COLORS.blue; break;
            case 'warn': color = COLORS.yellow; break;
            case 'error': color = COLORS.red; break;
        }

        const output = `${color}[${timestamp}] [${serviceName}] [${level.toUpperCase()}]${COLORS.reset} ${message}${metaStr}`;

        if (level === 'error') {
            console.error(output);
        } else if (level === 'warn') {
            console.warn(output);
        } else {
            console.log(output);
        }
    };

    return {
        debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
        info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
        warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
        error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),

        request: (method: string, path: string, statusCode: number, durationMs: number) => {
            const statusColor = statusCode >= 500 ? COLORS.red :
                statusCode >= 400 ? COLORS.yellow : COLORS.green;
            console.log(
                `${COLORS.cyan}[${formatTimestamp()}] [${serviceName}]${COLORS.reset} ` +
                `${method} ${path} ${statusColor}${statusCode}${COLORS.reset} - ${durationMs}ms`
            );
        }
    };
}

export type Logger = ReturnType<typeof createLogger>;
