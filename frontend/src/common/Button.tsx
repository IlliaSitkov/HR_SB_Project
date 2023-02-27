import {FC} from "react";

export const Button: FC<{text: string, onClick: any, id: string}> =
    ({text, onClick, id}) => {
        return <div>{text}</div>;
    }
