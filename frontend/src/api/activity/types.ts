export class Activity {
	person_id: number;
	event_id: number;
	hours: number;
	position: string;
	contribution: string;
	event: { name: string; date_start: string };
	year: number;
	person: { name: string; parental: string; surname: string; status: string };

	constructor(
		person_id: number,
		event_id: number,
		hours: number,
		position: string,
		contribution: string,
		event: { name: string; date_start: string },
		person: { name: string; parental: string; surname: string; status: string }
	) {
		this.person_id = person_id;
		this.event_id = event_id;
		this.hours = hours;
		this.position = position;
		this.contribution = contribution;
		this.event = event;
		this.year = new Date(this.event.date_start).getFullYear();
		this.person = person;
	}
}

export type ActivityUpdate = Pick<
	Activity,
	'position' | 'contribution' | 'hours' | 'person_id' | 'event_id'
>;

export type ActivityPost = Pick<Activity, 'person_id' | 'event_id'>;
