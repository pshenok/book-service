import {method} from '../decorators';
import joi from '../../../app/Validator';
import {
	ICreateBookData, ICreateBookResult,
} from 'rpc/lib/types/book-service.types';
import { BookService } from '../../../domain/book/BookService';


export class MainController {

	constructor (
		private bookService: BookService
	) {}

	@method({
		description: 'Create book',
		validate:    {
			data: joi.object().keys({
				name:        joi.string().required(),
				info:        joi.string().required(),
				fileUrl:     joi.string().required(),
				authorId:    joi.string().allow(null),
				releaseDate: joi.string().allow(null),
			})
		}
	})
	public async createBook (data: ICreateBookData): Promise<ICreateBookResult> {
		const result = await this.bookService.createBook(data);

		return {
			bookId: result.id
		};
	}
}
