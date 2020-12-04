import uuid from 'uuid';


export class Book {
	public id: string;
	public authorId?: string;
	public name: string;
	public releaseDate?: Date;
	public fileUrl: string;
	public createdAt?: Date;
	public readonly updatedAt?: Date;

	constructor (init: Partial<Book>) {
		this.id          = init.id || uuid.v4();
		this.authorId    = init.authorId;
		this.name        = init.name!;
		this.releaseDate = init.releaseDate;
		this.fileUrl     = init.fileUrl!;
		this.createdAt   = init.createdAt;
		this.updatedAt   = init.updatedAt;
	}
}
