export function isValidDate(date: string): boolean{
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)){
        return false;
    }
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
}

export function getMonth(incomeDate: string): string{
    const date = new Date(incomeDate);
    const monthFormat = new Date(date.getFullYear(), date.getMonth(), 1);
    return monthFormat.toISOString().split("T")[0];
}