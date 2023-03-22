export interface EventPostDto {
	name: string;
	description?: string;
	date_start: Date;
	date_end: Date;
	category_id: number;
	photo?: string;
}
