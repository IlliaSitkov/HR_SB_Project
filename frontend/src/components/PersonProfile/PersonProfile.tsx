import {FC} from 'react';
import {Navigate, useParams} from 'react-router-dom';

export const PersonProfile: FC = () => {
    const params = useParams();

    return (
        !localStorage.getItem('token') ? (
                <Navigate to='/' />
            ) :
            (<div>
                Person id: {params.personId}
            </div>)
    );
}
