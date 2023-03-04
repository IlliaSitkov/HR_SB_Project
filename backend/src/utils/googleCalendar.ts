import {google} from "googleapis";

const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    process.env.SCOPES
);


export const calendar = google.calendar({
    version: "v3",
    auth: jwtClient
});

export const clearAllBirthdays = async () => {
    const result = await calendar.events.list({
        calendarId: process.env.BIRTHDAY_CALENDAR_ID as string,
    });

    const allBirthdayId = result.data.items!.map((item:any) => item.id);
    for (const id of allBirthdayId) {
        await calendar.events.delete({
            calendarId: process.env.BIRTHDAY_CALENDAR_ID as string,
            eventId: id
        });
    }
}

export const createBirthday = async (name: string, day: number, month: number) => {
    const currentDate = new Date();
    //Find the closest birthday date
    const closestBirthday = new Date(currentDate.getFullYear(), month, day);
    if (currentDate.getMonth() > month && currentDate.getDate()) {
        closestBirthday.setFullYear(currentDate.getFullYear() + 1);
    }
    console.log(closestBirthday.toString());

    //Birthday as full-day event
    const birthday = {
        summary: `${name} birthday`,
        start: {
            dateTime: `${closestBirthday.getFullYear()}-${closestBirthday.getMonth()}-${closestBirthday.getDate()}T09:00:00`,
            timeZone: 'Europe/Kyiv'
        },
        end: {
            dateTime: `${closestBirthday.getFullYear()}-${closestBirthday.getMonth()}-${closestBirthday.getDate()}T21:00:00`,
            timeZone: 'Europe/Kyiv'
        },
        recurrence: ['RRULE:FREQ=YEARLY'],
        visibility: 'public',
        transparency: 'transparent'
    }
    const result = await calendar.events.insert({
        calendarId: process.env.BIRTHDAY_CALENDAR_ID as string,
        requestBody: birthday
    })

    console.log(result);
}

