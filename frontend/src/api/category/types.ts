import { IItem } from '../common/types';

export interface Category extends IItem {
	id: number;
	name: string;
}

export type CategoryCreateDTO = Pick<Category, 'name'>;
export type CategoryUpdateDTO = Pick<Category, 'name'>;
