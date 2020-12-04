import {Db} from '../Db';
import {Book} from '../../../domain/book/Book';
import {BookModel} from '../models/BookModel';
import {IListResult} from 'rpc/lib/types/types';
import { IBookRepository, IFindBookInput } from '../../../domain/book/IBookRepository';
import { Op } from 'sequelize';

export class BookRepository implements IBookRepository {

	constructor (private db: Db) {}

	public async create (bookData: Book): Promise<Book> {
		const book = BookModel.fromEntity(bookData);

		await book.save();

		return book.toEntity();
	}

	public async list (input: IFindBookInput): Promise<IListResult<Book>> {
		const where = this.generateWhereFromInput(input);
		const books = await this.db.models.Book.findAll({ where });

		return {
			total: books.length,
			items: books
		};
	}

	public async get (input: IFindBookInput): Promise<Book | null> {
		const where = this.generateWhereFromInput(input);
		const book = await this.db.models.Book.findOne({ where });

		return book ? book.toEntity() : null;
	}

	private generateWhereFromInput (input: IFindBookInput): any {
		const where: any = {};
		if (input.id) {
			Object.assign(where, {
				id: input.id,
			});
			return where;
		}
		if (input.name) {
			Object.assign(where, {
				name: { [Op.iLike]: `%${input.name}%` }
			});
		}
		if (input.authorIds) {
			Object.assign(where, {
				authorId: { [Op.in]: input.authorIds }
			});
		}
		if (input.releaseDate) {
			Object.assign(where, {
				releaseDate: input.releaseDate
			});
		}
		return where;
	}

}
