import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {getAllPeople, getFullName, Person} from "../../api/person";
import {useSelector, useDispatch} from "react-redux";
import {Navigate, useNavigate} from "react-router-dom";
import { peopleGet } from '../../store/people/actionCreators';
import {SearchBar} from "../../common/SearchBar/SearchBar";
import {PersonItem} from "./components/PersonItem/PersonItem";
import {Button} from "../../common/Button/Button";

export const PeopleList: FC<{gotData: number, setGotData: Dispatch<SetStateAction<number>>}> =
    ({gotData, setGotData}) => {

    const [searchText, setSearchText] = useState('');
    const suitsSearch = (person: Person) => {
        let sT = searchText.trim();
        if (sT === '') return true;
        sT = sT.toLowerCase();
        return (
            getFullName(person).toLowerCase().includes(sT) ||
            person.email?.toLowerCase().includes(sT) ||
            person.telegram?.toLowerCase().includes(sT)
        );
    };
    const people = useSelector((state: any) =>
        state.people.filter((person: Person) => suitsSearch(person))
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        //if (user.token !== '' && user.role === '') {
        //    dispatch(getUserMe());
        //}
        async function fetchData() {
            const peopleRes = await getAllPeople();
            if (peopleRes) {
                dispatch(peopleGet(peopleRes));
            } else {
                alert('Error!');
                setGotData(2);
            }
        }
        if (gotData === 0 || gotData === 2) {
            setGotData(1);
            fetchData();
        }
    });

    const search = () => {};

    const addPerson = () => {
        navigate('/people/add', { replace: true });
    };

    return !localStorage.getItem('token') ? (
        <Navigate to='/login' />
    ) : (
        <div className='courses'>
        <div className='rowWithSearch'>
        <SearchBar search={search} searchText={searchText} setSearchText={setSearchText}/>
    <Button text='Add person' onClick={addPerson} id='addPerson'/>
    </div>
    <ul className='ulMarginLeft'>
        {people.map((person: Person) => (
                <PersonItem key={person.id} person={person}/>
))}
    </ul>
    </div>
);
}
