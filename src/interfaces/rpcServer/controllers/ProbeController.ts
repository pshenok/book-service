import {method} from '../decorators';


export class ProbeController {

	@method({
		description:    'Probe liveness',
		path:           '/_probe/liveness',
		realStatusCode: true,
		validate:       {},
	})
	public async liveness (): Promise<object> {
		return {
			ok: true,
		};
	}

	@method({
		description:    'Probe readiness',
		path:           '/_probe/readiness',
		realStatusCode: true,
		validate:       {},
	})
	public async readiness (): Promise<object> {
		return {
			ok: true,
		};
	}
}
