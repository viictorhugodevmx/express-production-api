interface LogContext {
  [key: string]: unknown;
}

function writeLog(
  level: 'info' | 'warn' | 'error',
  message: string,
  context: LogContext = {}
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context
  };

  const output = JSON.stringify(logEntry);

  if (level === 'error') {
    console.error(output);
    return;
  }

  if (level === 'warn') {
    console.warn(output);
    return;
  }

  console.log(output);
}

export const logger = {
  info(message: string, context?: LogContext): void {
    writeLog('info', message, context);
  },

  warn(message: string, context?: LogContext): void {
    writeLog('warn', message, context);
  },

  error(message: string, context?: LogContext): void {
    writeLog('error', message, context);
  }
};
