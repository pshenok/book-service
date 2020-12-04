import express from 'express';
import http from 'http';
import {AddressInfo} from 'net';
import {Express} from 'express';
import * as jayson from 'jayson';
import {IInterface} from '../interfaces.types';
import {AwilixContainer} from 'awilix';
import {registerLogger} from './plugins/logger';
import {Config} from '../../app/Config';
import {Logger} from '../../app/Logger';
import {registerControllers} from './plugins/controllers';


export class RpcServer implements IInterface {
	private readonly app: Express;
	private server!: http.Server;
	private cfg!: Config['rpcServer'];
	private readonly rpcServer!: jayson.Server;

	constructor (
		private logger: Logger,
		private config: Config,
		private container: AwilixContainer,
	) {
		this.cfg = this.config.rpcServer;
		this.app = express();
		this.rpcServer = new jayson.Server(undefined, {useContext: true});
	}

	public async init (): Promise<void> {
		this.app.locals.logger    = this.logger;
		this.app.locals.config    = this.config;
		this.app.locals.container = this.container;
		this.app.locals.rpcServer = this.rpcServer;

		this.app.set('trust proxy', true);

		this.app.use(express.json({
			limit: this.config.rpcServer.bodyLimit,
		}));

		const scope = this.container.createScope();
		await registerLogger(this.app);
		await registerControllers(this.app, scope);
	}

	public async start (): Promise<void> {
		await new Promise((resolve, reject) => {
			this.logger.info(`rpcServer: starting ${this.cfg.port}`);

			this.server = this.app
			.listen(this.cfg.port)
			.on('listening', () => {
				const address = this.server.address() as AddressInfo;

				this.logger.info(`rpcServer: started ${address.port}`);

				return resolve();
			})
			.on('error', (err) => {
				this.logger.error('rpcServer: failed');

				return reject(err);
			});
		});
	}

	public async stop (): Promise<void> {
		if (this.server) {
			this.logger.info('rpcServer: closing');
			this.server.close();
			this.logger.info('rpcServer: closed');
		}
	}

	public getPort (): number {
		const address = this.server.address() as AddressInfo;

		if (address) {
			return address.port;
		} else {
			return 0;
		}
	}
}
