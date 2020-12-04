import 'reflect-metadata';
import {asClass, asValue, AwilixContainer, createContainer, InjectionMode} from 'awilix';
import {App} from '../App';
import {Logger} from '../Logger';
import {Config} from '../Config';
import {Db} from '../../infra/db/Db';
import {RpcServer} from '../../interfaces/rpcServer/RpcServer';
import {BookService} from '../../domain/book/BookService';
import {BookRepository} from '../../infra/db/repositories/BookRepository';

export class Container {

	public static create (): AwilixContainer {
		const container = createContainer({
			injectionMode: InjectionMode.CLASSIC,
		});

		container.register({
			container: asValue(container),

			// App
			app:    asClass(App).singleton(),
			config: asClass(Config).singleton(),
			logger: asClass(Logger).singleton(),

			// Domain
			bookService: asClass(BookService).singleton(),

			// Infrastructure
			db:             asClass(Db).singleton(),
			bookRepository: asClass(BookRepository).singleton(),

			// Interfaces
			rpcServer: asClass(RpcServer).singleton(),

			// Libs

			// rpc
		});

		return container;
	}

	private constructor () {
		// Do nothing
	}
}
