export const Authors = [
	{
		id:        '44444444-3333-3333-0000-000000000001',
		firstName: 'Chuck',
		lastName:  'Palahniuk',
		birthDate: new Date('1962-02-21'),
		createdAt: new Date(),
	}
];
export const Books = [
	{
		id:        '33333333-3333-3333-0000-000000000001',
		name:      'Fight Club',
		authotId:  Authors[0].id,
		createdAt: new Date(),
	},
];
