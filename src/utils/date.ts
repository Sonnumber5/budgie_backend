// Returns true if the given string is a valid YYYY-MM-DD date.
export function isValidDate(date: string): boolean{
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)){
        return false;
    }
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
}

//returns the string format of YYYY-MM-DD
export function getMonth(incomeDate: string): string {
    const [year, month] = incomeDate.split('-');
    return `${year}-${month}-01`;
}