declare module 'nock' {
	const nock: {
		[k: string]: any;
		(...args: any[]): any;
	};

	export default nock;
}
