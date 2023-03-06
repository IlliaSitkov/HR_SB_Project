import React, {createContext, Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {Select} from "../../common/Select/SelectComponent";
import {Button} from "react-bootstrap";
import {addIcon} from "../../common/icons/icons";
import {EditItemsModal} from "./components/EditItemsModal/EditItemsModal";
import {changeHandler} from "../../shared";
import {IItem} from "../../api/common/types";

export const ItemsContext = createContext<{ refresh: Function, updateFunc: Function, deleteFunc: Function, createFunc: Function, placeholder: string}>({
    refresh: () => {},
    createFunc: () => {},
    deleteFunc: () => {},
    updateFunc: () => {},
    placeholder: ""
});

export const ItemManager: FC<{
    selectedItem: any,
    setSelectedItem: Dispatch<SetStateAction<any>>,
    getAllFunc: Function,
    updateFunc: Function,
    deleteFunc: Function,
    createFunc: Function,
    selectTitle: string,
    modalTitle: string,
    placeholder: string
}> = ({selectedItem, setSelectedItem, getAllFunc, updateFunc, deleteFunc, createFunc, selectTitle, modalTitle, placeholder}) => {

    const [items, setItems] = useState<IItem[]>([]);

    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const items = await getAllFunc();
        setItems(items);
    }

    return <ItemsContext.Provider value={{refresh: fetchData, deleteFunc, updateFunc, createFunc, placeholder}} >
        <section className="d-flex gap-2 align-items-end m-2">
            <Select id="select"
                    noneSelectedOption={true}
                    value={selectedItem}
                    label={selectTitle}
                    onChange={changeHandler(setSelectedItem)}
                    data={items}
                    idSelector={(d) => d.id} nameSelector={(d) => d.name}/>
            <Button onClick={() => setShowModal(!showModal)} className="d-flex align-content-center">{addIcon()}</Button>
            <EditItemsModal title={modalTitle} listItems={items} setShow={setShowModal} show={showModal}/>
        </section>
    </ItemsContext.Provider>
}
