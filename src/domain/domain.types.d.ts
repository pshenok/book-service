
export interface IListData<T> {
	skip?: number;
	limit?: number;
	sort?: Array<{
		field: keyof T;
		order: 'ASC' | 'DESC';
	}>;
}

export interface IListResult<T> {
	total: number;
	items: T[];
}
