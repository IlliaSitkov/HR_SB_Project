export interface Event {
    id: number;
    name: string;
    date_start: Date;
    date_end: Date;
    description: string;
    category_id: number;
    photo: Buffer;
}