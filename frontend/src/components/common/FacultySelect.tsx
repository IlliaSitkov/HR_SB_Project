import React, { useEffect, useState } from 'react';
import { changeHandler } from '../../shared';
import { Select } from '../../common/Select/SelectComponent';
import { Faculty, getAllFaculties } from '../../api/faculty';

const FacultySelect: React.FC<{
	setFacultyId: Function;
	facultyId: number;
	isRequired?: boolean;
}> = ({ setFacultyId, facultyId, isRequired }) => {
	const [faculties, setFaculties] = useState<Faculty[]>([]);

	useEffect(() => {
		getAllFaculties().then((faculties) => setFaculties(faculties));
	}, []);

	return (
		<Select
			id='selectFaculty'
			noneSelectedOption={true}
			value={facultyId}
			label='Факультет'
			onChange={changeHandler(setFacultyId)}
			data={faculties}
			idSelector={(s) => s.id}
			nameSelector={(s) => s.name}
			isRequired={isRequired}
		/>
	);
};

export default FacultySelect;
