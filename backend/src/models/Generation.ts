
export interface Generation {
    name: string
}

export type GenerationDto = Pick<Generation, "name">;

export type GenerationForGet = {
    id: number,
    name: string
}
