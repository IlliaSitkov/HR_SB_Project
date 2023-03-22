export interface Event {
	id?: number;
	name: string;
	date_start: Date;
	date_end: Date;
	description?: string | null;
	category_id: number;
	photo?: string | null;
}

export type EventPostDto = Omit<Event, 'id'>;
export type EventPatchDto = Omit<Event, 'id'>;
