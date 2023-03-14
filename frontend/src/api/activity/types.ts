export class Activity {
	person_id: number;
	event_id: number;
	hours: number;
	position: string;
	contribution: string;
	event: { name: string; date_start: string };
	year: number;

	constructor(
		person_id: number,
		event_id: number,
		hours: number,
		position: string,
		contribution: string,
		event: { name: string; date_start: string }
	) {
		this.person_id = person_id;
		this.event_id = event_id;
		this.hours = hours;
		this.position = position;
		this.contribution = contribution;
		this.event = event;
		this.year = new Date(this.event.date_start).getFullYear();
	}
}
