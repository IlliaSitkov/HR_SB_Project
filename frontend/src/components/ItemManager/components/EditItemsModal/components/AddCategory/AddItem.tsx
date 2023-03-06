import React, {useContext, useState} from "react";
import {Input} from "../../../../../../common/Input/Input";
import {changeHandler} from "../../../../../../shared";
import {Button} from "react-bootstrap";
import {plusIcon} from "../../../../../../common/icons/icons";
import {ErrorMessage} from "../../../../../../common/ErrorMessage/ErrorMessage";
import {ItemsContext} from "../../../../ItemManager";

export const AddItem = () => {

    const {refresh, createFunc, placeholder} = useContext(ItemsContext);
    const [name, setName] = useState<string>("");
    const [error, setError] = useState("");

    const create = async () => {
        resetError();
        try {
            await createFunc({name});
            resetName();
            refresh();
        } catch (e) {
            setError((e as any).response.data.message);
        }
    };

    const resetError = () => setError("");
    const resetName = () => setName("");

    return <section className="mb-3">
        <div className='d-flex align-items-center gap-3'>
        <Input placeholder={placeholder} style={{width: '100%'}} type="search" onChange={changeHandler(setName, resetError)} id="categoryName" value={name}/>
        <Button onClick={create}>{plusIcon()}</Button>
    </div>
        <ErrorMessage message={error} />
    </section>

}
