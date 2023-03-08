import React, {Dispatch, FC, SetStateAction} from 'react';

export const SearchBar: FC<{searchText: string, setSearchText: Dispatch<SetStateAction<string>>, placeholder?: string}> =
    ({searchText, setSearchText, placeholder= ''}) => {
        return (
            <div className='m-2'>
                <input
                    type='text'
                    placeholder={placeholder}
                    onChange={(event) => {
                        setSearchText(event.target.value);
                    }}
                    value={searchText}
                />
            </div>
        );
    }

