import {authHost} from "./index";
import {PersonBirthday} from "../models/person";

export const nearestBirthdaysEndpoint: string = 'TODO'

export const getNearestBirthdays = async() => {
    const response = (await authHost.get<PersonBirthday[]>(nearestBirthdaysEndpoint)).data;
    return response.map(r => {
        r.birthday = new Date(r.birthday);
        return r;
    })
}