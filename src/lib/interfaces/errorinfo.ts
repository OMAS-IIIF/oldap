
export enum Severity {
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error',
	SEVERE = 'severe',
	FATAL = 'fatal',
}

export interface ErrorInfo {
	errormsg: string;
	errorcode?: number;
	severity: Severity;
}