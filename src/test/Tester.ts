import dotenv from 'dotenv';
import {AwilixContainer} from 'awilix';
import {Container} from '../app/di/Container';
import {IInterface} from '../interfaces/interfaces.types';
import {Config} from '../app/Config';
import {App} from '../app/App';
import {Db} from '../infra/db/Db';
import {BookServiceClient} from 'rpc/lib/BookServiceClient';


export class Tester {
	public url!: string;
	public app!: App;
	public rpcServer!: IInterface;
	public config!: Config;
	public data!: any;
	public db!: Db;
	public container!: AwilixContainer;
	public rpcClient!: BookServiceClient;

	public async start (fixtures?: any) {
		jest.setTimeout(60000);

		dotenv.config();

		process.env.NODE_ENV = 'test';
		process.env.WEB_PORT = '0';
		process.env.DB_DB    = `test_${process.env.DB_DB}`;

		this.data = {};

		this.container = Container.create();
		this.app = this.container.cradle.app;

		await this.app.init();
		await this.app.start();

		this.rpcServer = this.container.cradle.rpcServer;
		this.config    = this.container.cradle.config;
		this.db        = this.container.cradle.db;

		this.url = `http://localhost:${this.rpcServer.getPort()}`;
		this.rpcClient = new BookServiceClient(this.container.cradle.logger, {rpc: {BookService: {url: this.url}}});

		await this.db.sequelize.sync({
			force: true,
		});

		if (fixtures) {
			for (const key of Object.keys(fixtures)) {
				await (this.db.models as any)[key].bulkCreate(fixtures[key]);
			}
		}
	}

	public async stop () {
		await this.app.stop();
	}
}
