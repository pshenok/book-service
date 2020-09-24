import {Sequelize} from 'sequelize';
import {IAsyncInit} from '../../types';
import {Config} from '../../app/Config';
import {Logger} from '../../app/Logger';
import {BookModel} from './models/BookModel';
import stringify from 'json-stringify-safe';


export class Db implements IAsyncInit {
	private cfg: Config['infra']['db'];
	public sequelize!: Sequelize;

	public models = {
		Book: BookModel,
	};

	constructor (
		private logger: Logger,
		private config: Config,
	) {
		this.cfg = this.config.infra.db;
	}

	public async init (): Promise<void> {
		const {host, port, db, user, pass} = this.cfg;
		const {hosts, ports} = this.cfg.read;
		const write = {
			host:     host,
			port:     port,
			database: db,
			username: user,
			password: pass,
		};
		const read = [];

		if (hosts.length || ports.length) {
			if (hosts.length !== ports.length) {
				throw new TypeError(`Host array length (${hosts.length}) must be equal to port array length (${ports.length})`);
			}
			hosts.forEach((item, i) => {
				read.push({
					host:     item,
					port:     ports[i],
					database: db,
					username: user,
					password: pass,
				});
			});
		} else {
			read.push(write);
		}

		this.sequelize = new Sequelize({
			dialect:     this.cfg.dialect as any,
			replication: {
				write: write,
				read:  read,
			},
			dialectOptions: {
				timezone: 'auto',
			},
			logging: (sql, params: any) => {
				return this.logger.info('SQL Query', {
					sql:  sql,
					bind: params && params.bind,
				});
			},
		});

		Object.keys(this.models).forEach((name) => {
			this.logger.info(`Init model ${name}`);
			((this.models as any)[name]).initWith(this.sequelize);
		});

		try {
			this.logger.info(`Connecting to DB ${this.cfg.user}@${this.cfg.host}:${this.cfg.port}/${this.cfg.db}`);

			await this.sequelize.authenticate();

			this.logger.info('Connected to DB');

		} catch (err) {
			this.logger.error(`Failed to connect to DB: ${stringify(err)}`);

			throw err;
		}
	}

	public async start (): Promise<void> {
		Object.keys(this.models).forEach((name) => {
			((this.models as any)[name]).initRelations();
		});
	}

	public async stop (): Promise<void> {
		this.logger.info('Disconnecting from DB');
		await this.sequelize.close();
		this.logger.info('Disconnected from DB');
	}
}
