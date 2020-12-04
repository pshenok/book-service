import {Express} from 'express';
import {AwilixContainer} from 'awilix';
import {applyControllers} from './controller-helper';
import {MainController} from '../controllers/MainController';
import {PingController} from '../controllers/PingController';
import {ProbeController} from '../controllers/ProbeController';


export async function registerControllers (app: Express, container: AwilixContainer) {
	app.locals.controllers = [
		container.build(PingController),
		container.build(ProbeController),
		container.build(MainController),
	];

	app.locals.methods = {};

	applyControllers(app);
}
