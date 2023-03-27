import React, { useEffect, useState } from 'react';
import { changeHandler } from '../../shared';
import { Select } from '../../common/Select/SelectComponent';
import { getAllSpecialties, Specialty } from '../../api/specialty';

const SpecialtySelect: React.FC<{
	setSpecialtyId: Function;
	specialtyId: number;
	isRequired?: boolean;
}> = ({ setSpecialtyId, specialtyId, isRequired }) => {
	const [specialties, setSpecialties] = useState<Specialty[]>([]);

	useEffect(() => {
		getAllSpecialties().then((specialties) => setSpecialties(specialties));
	}, []);

	return (
		<div>
			<Select
				id='selectSpecialty'
				noneSelectedOption={true}
				value={specialtyId}
				label='Спеціальність'
				onChange={changeHandler(setSpecialtyId)}
				data={specialties}
				idSelector={(s) => s.id}
				nameSelector={(s) => s.name}
				isRequired={isRequired}
			/>
		</div>
	);
};

export default SpecialtySelect;
