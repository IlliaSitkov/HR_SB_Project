import {Person} from "../../api/person";
import {ADD_PERSON, DELETE_PERSON, GET_PEOPLE, UPDATE_PERSON, UPDATE_PERSON_STATUS} from "./actionTypes";

export const personAdded = (person: Person) => ({
    type: ADD_PERSON,
    payload: person,
});

export const personDeleted = (personId: number) => ({
    type: DELETE_PERSON,
    payload: personId,
});

export const personUpdated = (person: Person) => ({
    type: UPDATE_PERSON,
    payload: person,
});

//There should be person or status???
export const personUpdatedStatus = (person: Person) => ({
    type: UPDATE_PERSON_STATUS,
    payload: person,
});

export const peopleGet = (newPeople: Array<Person>) => ({
    type: GET_PEOPLE,
    payload: newPeople,
});