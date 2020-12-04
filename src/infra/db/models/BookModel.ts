import {Model, DataTypes, Sequelize} from 'sequelize';
import {Book} from '../../../domain/book/Book';

export class BookModel extends Model {
	public id!: string;
	public authorId?: string;
	public name!: string;
	public releaseDate?: Date;
	public fileUrl!: string;
	public createdAt?: Date;
	public readonly updatedAt?: Date;


	static fromEntity (file: Book): BookModel {
		return new BookModel(file);
	}

	public toEntity (): Book {
		return new Book(this);
	}

	public static initWith (sequelize: Sequelize): void {
		BookModel.init({
			id: {
				type:         DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey:   true,
			},
			authorId: {
				type:      DataTypes.UUID,
				allowNull: true
			},
			name: {
				type:      DataTypes.STRING,
				allowNull: false,
			},
			releaseDate: {
				type:      DataTypes.DATE,
				allowNull: true,
			},
			fileUrl: {
				type:      DataTypes.STRING,
				allowNull: false,
			},
			createdAt: {
				type:         DataTypes.DATE,
				defaultValue: new Date(),
				allowNull:    false,
			},
			updatedAt: {
				type:         DataTypes.DATE,
				defaultValue: new Date(),
				allowNull:    false,
			},
		}, {
			tableName: 'books',
			sequelize: sequelize,
		});
	}

	public static initRelations (): void {
		// relations
	}
}
