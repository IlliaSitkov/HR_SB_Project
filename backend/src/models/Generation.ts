
export interface Generation {
    name: string
}

export type GenerationDto = Pick<Generation, 'name'>;
