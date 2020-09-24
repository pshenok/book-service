import {SchemaLike} from 'joi';


export interface IMethodData {
	description: string;
	validate: {
		data?: SchemaLike;
		context?: SchemaLike;
	};
	path?: string; // Path for some probe requests
	realStatusCode?: boolean;
	method?: (req: any, context: any) => any;
	processReq?: (data: any, context: any, next: (err?: Error, result?: any) => void) => any;
}

export function method (methodData: IMethodData) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		Reflect.defineMetadata('method:data', methodData, target, propertyKey);
	};
}
