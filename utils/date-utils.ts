import { addDays, format } from "date-fns";
export function addDaysToProvidedDate (date: Date, days: number){
    return addDays(date, days);;
}

export function formatDateToMMMDDYYYY(date: Date){
    const formattedDate = format(date, 'MMMM d, yyyy');
    return formattedDate;
}