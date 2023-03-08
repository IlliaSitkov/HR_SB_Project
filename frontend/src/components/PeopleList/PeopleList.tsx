import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {getAllPeople, getFullName, Person} from "../../api/person";
import {useSelector, useDispatch} from "react-redux";
import {Navigate, useNavigate} from "react-router-dom";
import { peopleGet } from '../../store/people/actionCreators';
import {SearchBar} from "../../common/SearchBar/SearchBar";
import {PersonItem} from "./components/PersonItem/PersonItem";
import {Button, Col, Row} from "react-bootstrap";

export const PeopleList: FC<{gotData: number, setGotData: Dispatch<SetStateAction<number>>}> =
    ({gotData, setGotData}) => {

        const [searchText, setSearchText] = useState('');
        const suitsSearch = (person: Person) => {
            console.log(searchText);
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

        const addPerson = () => {
            //OR open popup
            navigate('/people/add', { replace: true });
        };

        return !localStorage.getItem('token') ? (
            <Navigate to='/login' />
        ) : (
            <>
                <h2 className='text-center'>Люди СБ</h2>
                <Button variant="primary" onClick={addPerson} id='addPerson' className="m-2">Додати людину</Button>
                <SearchBar searchText={searchText} setSearchText={setSearchText}/>
                <Row xs={1} sm={2} md={4} lg={6} className="m-2">
                    {people.map((person: Person) => (
                            <Col className="d-flex" style={{minWidth: '210px'}} key={person.id} >
                                <PersonItem person={person}/>
                            </Col>
                        )
                    )}
                </Row>
            </>
        );
    }
