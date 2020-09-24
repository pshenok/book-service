import {method} from '../decorators';


export class PingController {

	@method({
		description: 'Simple ping',
		validate:    {},
	})
	public async ping (): Promise<object> {
		return {
			ping: 'pong',
			time: new Date().toISOString(),
		};
	}
}
