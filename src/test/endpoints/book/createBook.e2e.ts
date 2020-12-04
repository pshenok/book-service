import {Tester} from '../../Tester';
const tester = new Tester();

describe('createBook()', function () {
	beforeAll(async () => {
		await tester.start({});
	});

	afterAll(async () => {
		await tester.stop();
	});

	it('should fail on empty request', async () => {
		try {
			await (tester.rpcClient as any).createBook();
			throw new Error('MUST FAIL');
		} catch (error) {
			expect(error.toJSON()).toMatchObject({
				'code': 400,
				'data': {
					'appError': {
						'code':    'VALIDATION ERROR',
						'details': {
							'errors': [
								{
									'key':     'name',
									'message': '"name" is required',
								},
								{
									'key':     'info',
									'message': '"info" is required',
								},
								{
									'key':     'fileUrl',
									'message': '"fileUrl" is required',
								}
							],
							'in': 'data',
						},
						'message': 'Validation failed for data',
						'type':    'AppError',
					},
				},
				'message': 'Request validation failed in data',
				'type':    'RpcError',
			});
		}
	});


	it('should create books', async () => {
		const { bookId } = await tester.rpcClient.createBook({
			name:    'Test Book',
			info:    'Info about book',
			fileUrl: 'http://test-book.test/',
		});

		const currentBook = await tester.db.models.Book.findOne({
			where: { id: bookId },
		});
		expect(bookId).toEqual(currentBook!.id);
	});
});
