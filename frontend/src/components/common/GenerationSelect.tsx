import React, { Dispatch, SetStateAction } from 'react';
import { ItemManager } from '../ItemManager/ItemManager';
import {
	createGeneration,
	deleteGeneration,
	getAllGenerations,
	updateGeneration,
} from '../../api/generation/generation.service';
import RequiredStar from './RequiredStar';

const GenerationSelect: React.FC<{
	generationId: number;
	setGenerationId: Dispatch<SetStateAction<any>>;
	isRequired?: boolean;
}> = ({ generationId, setGenerationId, isRequired }) => {
	return (
		<div>
			{isRequired && <RequiredStar />}
			<ItemManager
				selectedItem={generationId}
				setSelectedItem={setGenerationId}
				getAllFunc={getAllGenerations}
				updateFunc={updateGeneration}
				deleteFunc={deleteGeneration}
				createFunc={createGeneration}
				selectTitle='Покоління'
				modalTitle='Усі покоління'
				placeholder='Нове покоління'
				isRequired={isRequired}
			/>
		</div>
	);
};

export default GenerationSelect;
