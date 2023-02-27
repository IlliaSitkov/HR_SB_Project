import {IItem} from "../common/types";

export interface Generation extends IItem{
    id: number;
    name: string;
}

export type GenerationCreateDTO = Pick<Generation, "name">;
export type GenerationUpdateDTO = Pick<Generation, "name">;