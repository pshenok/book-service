import log4js from 'log4js';
import stringify from 'json-stringify-safe';
import {Config} from './Config';
import cls from 'cls-hooked';


export class Logger {
	private cfg: Config['logger'];
	private logger: log4js.Logger;
	private context: cls.Namespace;

	constructor (
		private config: Config,
	) {
		this.cfg = this.config.logger;

		this.context = cls.createNamespace('app');

		const [appender, level = 'info'] = this.cfg.loggingType.split(':');

		log4js.addLayout('json', () => {
			return (logEvent) => {
				return stringify({
					ts:      logEvent.startTime.getTime(),
					level:   logEvent.level.levelStr,
					dataObj: typeof logEvent.data[0] === 'string' ? {msg: logEvent.data[0]} : logEvent.data[0],
				});
			};
		});
		log4js.addLayout('simple', () => {
			return (logEvent) => {
				return `${Number(logEvent.startTime)} [${logEvent.level.levelStr}] ${stringify(logEvent.data[0])}`;
			};
		});
		log4js.configure({
			appenders: {
				default: {
					type:   'stdout',
					layout: {
						type: 'colored',
					},
				},
				simple: {
					type:   'stdout',
					layout: {
						type: 'simple',
					},
				},
				json: {
					type:   'stdout',
					layout: {
						type: 'json',
					},
				},
			},
			categories: {
				default: {
					appenders: ['default'],
					level:     level,
				},
				json: {
					appenders: ['json'],
					level:     level,
				},
				simple: {
					appenders: ['simple'],
					level:     level,
				},
			},
		});

		this.logger = log4js.getLogger(appender);

		this.trace('trace test log');
		this.debug('debug test log');
		this.info('info test log');
		this.warn('warn test log');
		this.error('error test log');
		this.fatal('fatal test log');
	}

	public get traceId (): string {
		return String(this.context.get('traceId') || '');

		if (this.context.active) {
			return String(this.context.get('traceId') || '');

		} else {
			return '';
		}
	}

	public trace (msg: string, data?: object): void {
		return this.logger.trace({
			traceId: this.traceId,
			msg:     msg,
			...data,
		});
	}

	public debug (msg: string, data?: object): void {
		return this.logger.debug({
			traceId: this.traceId,
			msg:     msg,
			...data,
		});
	}

	public info (msg: string, data?: object): void {
		return this.logger.info({
			traceId: this.traceId,
			msg:     msg,
			...data,
		});
	}

	public warn (msg: string, data?: object): void {
		return this.logger.warn({
			traceId: this.traceId,
			msg:     msg,
			...data,
		});
	}

	public error (msg: string, data?: object): void {
		return this.logger.error({
			traceId: this.traceId,
			msg:     msg,
			...data,
		});
	}

	public fatal (msg: string, data?: object): void {
		return this.logger.fatal({
			traceId: this.traceId,
			msg:     msg,
			...data,
		});
	}

	public traceLogsWith (traceId: string, next: () => void): void {
		this.context.run(() => {
			this.context.set('traceId', traceId);

			next();
		});
	}
}
