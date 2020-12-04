import { Book } from './Book';
import { IListResult } from '../domain.types';

export interface IFindBookInput {
	id?: string;
	name?: string;
	fileUrl?: string;
	authorIds?: Array<string>;
	releaseDate?: Date;
}

export interface IBookRepository {
	create (bookData: Book): Promise<Book>;
	get (input: IFindBookInput): Promise<Book | null>;
	list (input: IFindBookInput): Promise<IListResult<Book>>;
}
