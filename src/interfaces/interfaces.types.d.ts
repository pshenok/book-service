import {IAsyncInit} from '../types';

export interface IInterface extends IAsyncInit {
	getPort (): number;
}
