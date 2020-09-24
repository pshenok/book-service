import {IAsyncInit} from '../types';
import stringify from 'json-stringify-safe';
import {Config} from './Config';
import {Logger} from './Logger';


export class App {
	private asyncInitList: IAsyncInit[] = [];

	/* eslint max-params: 0 */
	constructor (
		private logger: Logger,
		private config: Config,
		private rpcServer: IAsyncInit,
		private db: IAsyncInit,
	) {
		this.asyncInitList = [
			this.rpcServer,
			this.db,
		];
	}

	public async init (): Promise<void> {
		this.logger.info('app.init()');
		this.logger.debug(`Config: ${stringify(this.config)}`);

		for (const obj of this.asyncInitList) {
			this.logger.info(`initializing ${obj.constructor.name}`);
			await obj.init();
			this.logger.info(`initialized ${obj.constructor.name}`);
		}
	}

	public async start (): Promise<void> {
		this.logger.info('app.start()');

		for (const obj of this.asyncInitList) {
			this.logger.info(`starting ${obj.constructor.name}`);
			await obj.start();
			this.logger.info(`started ${obj.constructor.name}`);
		}
	}

	public async stop (messages: string[] = []): Promise<void> {
		messages.forEach((message) => {
			this.logger.info(String(message));
		});

		this.logger.info('app.stop()');

		for (const obj of this.asyncInitList) {
			this.logger.info(`stopping ${obj.constructor.name}`);
			await obj.stop();
			this.logger.info(`stopped ${obj.constructor.name}`);
		}
	}
}
