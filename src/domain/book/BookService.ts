import { IBookRepository } from './IBookRepository';
import { Book } from './Book';

export class BookService {
	constructor (private bookRepository: IBookRepository) {}

	public async createBook (bookData: Partial<Book>): Promise<Book> {
		return this.bookRepository.create(new Book(bookData));
	}
}
