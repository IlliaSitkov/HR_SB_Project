import React, { FC } from 'react';
import { Input } from '../Input/Input';

export const TextField: FC<{
    label?: string;
    id?: string;
    placeholder?: string;
    value: string;
    style?: object;
    textStyle?: object;
}> = ({ label, id, placeholder = '', value, style, textStyle }) => {
    // @ts-ignore
    if (textStyle && !textStyle.background) {
        // @ts-ignore
        textStyle.background = 'white';
    } else if (!textStyle) textStyle = { background: 'white' };

    return (
        <Input
            id={id}
            placeholder={placeholder}
            type='text'
            onChange={() => {}}
            value={value}
            label={label}
            disabled={true}
            style={style}
            inputStyle={textStyle}
        />
    );
};