const checkIsArrayEmpty = (item: any): boolean => {
    const isArrayEmpty: boolean = (item && Array.isArray(item) && item.length) > 0 ? true : false
    return isArrayEmpty
}

const addCharToString = (item: Array<string>): string => {
    let itemReturn: string = ''
    if(checkIsArrayEmpty) itemReturn =item.join()
    return itemReturn
}


export {
    checkIsArrayEmpty,
    addCharToString
}