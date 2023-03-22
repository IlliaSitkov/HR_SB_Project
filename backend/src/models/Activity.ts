export interface Activity {
    person_id: number,
    event_id: number,
    hours: number,
    position?: string | null,
    contribution: string
}