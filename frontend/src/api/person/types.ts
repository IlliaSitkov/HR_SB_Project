import { Generation } from '../generation'

export interface Faculty {
    id: number,
    name: string
}

export interface Specialty {
    id: number,
    name: string
}

export interface StatusUpdateDto {
    status: string,
    date?: Date
}

export interface Person {
    id?: number,
    name: string,
    parental?: string | null,
    surname: string,
    date_birth?: Date | null,
    avatar?: Buffer | null,

    faculty?: Faculty | null,
    specialty?: Specialty | null,
    year_enter?: number | null,

    email?: string | null,
    telephone?: string | null,
    telegram?: string | null,
    facebook?: string | null,

    status: string,
    role?: string | null, //TODO: get from somewhere
    parent?: Person | null,
    generation?: Generation | null,
    about?: string | null,

    date_fill_form?: Date | null,
    date_vysviata?: Date | null,
    date_poshanuvannia?: Date | null,
    date_exclusion?: Date | null
}

export const getFullName = (p: Person) => {
    let parental = '';
    if (p.parental) parental = ' ' + p.parental;
    return p.surname + ' ' + p.name + parental;
}
