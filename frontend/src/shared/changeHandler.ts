import {ChangeEvent, ChangeEventHandler} from "react";

export const changeHandler = (...setters: Function[]): ChangeEventHandler<HTMLElement> => (event: ChangeEvent) => {
    setters.forEach(setter => setter((event.target as HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement).value));
};
