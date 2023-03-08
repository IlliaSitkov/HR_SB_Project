import {FC} from "react";
import {useParams} from "react-router-dom";

export const PersonProfile: FC = () => {
    const params = useParams();

    return <div>Person id: {params.personId}</div>
}
