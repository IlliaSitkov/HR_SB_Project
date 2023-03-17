import { Status, Role } from '@prisma/client'

export interface Person {
    id?: number,
    name: string,
    parental?: string | null,
    surname: string,
    date_birth?: Date | null,
    avatar?: string | null,

    faculty_id?: number | null,
    specialty_id?: number | null,
    year_enter?: number | null,

    email?: string | null,
    telephone?: string | null,
    telegram?: string | null,
    facebook?: string | null,

    status: Status,
    role?: Role | null,
    parent_id?: number | null,
    generation_id?: number | null,
    about?: string | null,

    date_fill_form?: Date | null,
    date_vysviata?: Date | null,
    date_poshanuvannia?: Date | null,
    date_exclusion?: Date | null
}

export type PersonPostDto = Omit<Person, 'id'>;
export type PersonPatchDto = Omit<Person, 'id'>;
