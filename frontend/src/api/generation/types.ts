import {IItem} from '../common/types';

export interface Generation extends IItem{
    id: number;
    name: string;
}

export const undefinedGeneration: Generation = {
    id: -1,
    name: 'Не встановлено'
}

export type GenerationCreateDTO = Pick<Generation, 'name'>;
export type GenerationUpdateDTO = Pick<Generation, 'name'>;
