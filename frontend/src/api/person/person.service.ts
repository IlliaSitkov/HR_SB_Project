import {AxiosInstance} from "axios";
import {authHost} from "../../http";
import {Person, StatusUpdateDto} from "./types";

const axios: AxiosInstance = authHost;
const url: string = "http://localhost:8000/api/people"

const urlById = (id: number): string => `${url}/${id}`;

export const getAllPeople = async (): Promise<Person[]> => {
    return (await axios.get(url)).data;
};

export const createPerson = async (person: Person): Promise<Person> => {
    return (await axios.post(url, person)).data;
};

export const deletePerson = async (id: number): Promise<Person> => {
    return (await axios.delete(urlById(id))).data;
};

export const updatePerson = async (id: number, person: Person): Promise<Person> => {
    return (await axios.patch(urlById(id), person)).data;
};

export const updatePersonStatus = async (id: number, status: StatusUpdateDto): Promise<Person> => {
    return (await axios.patch(urlById(id), status)).data;
};
