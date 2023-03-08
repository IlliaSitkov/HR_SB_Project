import React, {FC} from "react";

export const SearchBar: FC<{searchText: string, setSearchText: any}> =
    ({searchText, setSearchText}) => {
        return (
            <div className="m-2">
                <input
                    type='text'
                    placeholder='Шукати людину...'
                    onChange={(event) => {
                        setSearchText(event.target.value);
                    }}
                    value={searchText}
                />
            </div>
        );
    }

