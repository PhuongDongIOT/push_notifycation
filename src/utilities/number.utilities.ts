const toNumber = (item: any) : number => {
    const itemReturn = parseInt(item) ?? 0;
    return itemReturn
}

export {
    toNumber
}