import React, {useState} from "react";import {PeopleList} from "./components/PeopleList/PeopleList";

export const PeopleManagerDemo = () => {

    // 0 - not yet loaded
    // 1 - started loading
    // 2 - error while loading
    // 3 - loaded successfully
    const [gotData, setGotData] = useState(0);

    return <PeopleList gotData={gotData} setGotData={setGotData}/>

};
