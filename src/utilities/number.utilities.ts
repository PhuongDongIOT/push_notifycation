const toNumber = (item: any) : number => {
    if(!item) return 0
    const itemReturn: number = parseInt(item) ?? 0;
    return itemReturn
}

const numberToBoolean = (item: string | boolean): boolean => {
    const itemReturn = typeof item === 'boolean' ? item : toNumber(item) ? true : false
    return itemReturn
}

export {
    toNumber,
    numberToBoolean
}