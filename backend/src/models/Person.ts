import { Status, Role, Generation, Faculty, Specialty } from '@prisma/client'

export interface Person {
    id?: number,
    name: string,
    parental?: string,
    surname: string,
    date_birth?: Date,
    avatar?: Buffer,

    faculty?: Faculty,
    specialty?: Specialty,
    year_enter?: number,

    email?: string,
    telephone?: string,
    telegram?: string,
    facebook?: string,

    status: Status,
    role?: Role,
    parent?: Person,
    generation?: Generation,
    about?: string,

    date_fill_form?: Date,
    date_vysviata?: Date,
    date_poshanuvannia?: Date,
    date_exclusion?: Date
}

export type PersonPostDto = Omit<Person, "id">;
export type PersonPatchDto = Omit<Person, "id">;
// export type NewcomerPostDto = Pick<Person, "name" | "parental" | "surname" | "year_enter" | "faculty" | "specialty" | "email" | "telegram" | "about" | "date_fill_form">;
