
const apartDayinDate = (dateNumber: number | Date, index: number = 0): Date => {
    let date: Date
    if (typeof dateNumber === 'number') {
        date = new Date(dateNumber)
    } else {
        date = dateNumber
    }
    date.setDate(date.getDate() - index);
    return date
}

export {
    apartDayinDate
}