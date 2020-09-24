import {AbstractConfig} from './base/AbstractConfig';

const WEB_PORT = 3000;
const BODY_LIMIT = 1048576; // 1 MB;


export class Config extends AbstractConfig {
	public rpcServer = {
		port:      this.getNumber('WEB_PORT', WEB_PORT),
		bodyLimit: this.getNumber('BODY_LIMIT', BODY_LIMIT),
	};
	public logger = {
		loggingType: this.getString('LOGGING_TYPE', 'json'),
	};
	public infra = {
		db: {
			host:    this.getString('DB_HOST'),
			port:    this.getNumber('DB_PORT'),
			db:      this.getString('DB_DB'),
			user:    this.getString('DB_USER'),
			pass:    this.getString('DB_PASS'),
			dialect: this.getString('DB_DIALECT'),
			read:    {
				hosts: this.getArrayString('DB_READ_HOSTS', []),
				ports: this.getArrayNumber('DB_READ_PORTS', [])
			}
		}
	};
	public rpc = {};
}
