import {Express, Response} from 'express';
import stringify from 'json-stringify-safe';
import {Logger} from '../../../app/Logger';


export async function registerLogger (app: Express): Promise<void> {
	const prefix = Math.random().toString(36).toUpperCase().substr(-4);
	let counter = 0;

	// Register logger for every request
	app.use((req: any, res: Response, next: () => void) => {
		const logger: Logger = app.locals.logger;

		counter += 1;
		const count = counter.toString(36).toUpperCase().padStart(6, '0');
		req.id = req.body.id || `${prefix}_${count}`;
		req.createdAt = req.createdAt || Date.now();

		res.setHeader('X-Trace-Id', req.id);

		logger.traceLogsWith(req.id, () => {
			const doLog = !req.path.startsWith('/_probe/');

			if (!doLog) {
				return next();
			}

			const method = req.body.method;

			logger.info('Request <<<', {
				method: method,
			});

			logger.debug('Request data:', {
				query:   stringify(req.query),
				body:    String(stringify(req.body)).substr(0, 1000),
				headers: String(stringify(req.headers)).substr(0, 1000),
			});

			res.on('finish', () => {
				if (res.locals.error) {
					if (res.locals.error.code === 400) {
						logger.warn('Response >>>', {
							method:        method,
							result:        'ERROR',
							errCode:       res.locals.error.code,
							errMessage:    res.locals.error.message,
							contentLength: res.getHeader('content-length') || 0,
							duration:      Date.now() - req.createdAt,
						});
					} else {
						logger.error('Response >>>', {
							method:        method,
							result:        'FAIL',
							errCode:       res.locals.error.code,
							errMessage:    res.locals.error.message,
							contentLength: res.getHeader('content-length') || 0,
							duration:      Date.now() - req.createdAt,
						});
					}
				} else {
					logger.info('Response >>>', {
						method:        method,
						result:        'OK',
						errCode:       0,
						errMessage:    null,
						contentLength: res.getHeader('content-length') || 0,
						duration:      Date.now() - req.createdAt,
					});
				}
			});

			return next();
		});
	});
}
