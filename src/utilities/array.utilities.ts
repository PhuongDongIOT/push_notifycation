import {toNumber} from './number.utilities'


const checkIsArrayEmpty = (item: any): boolean => {
    const isArrayEmpty: boolean = (item && Array.isArray(item) && item.length) > 0 ? true : false
    return isArrayEmpty
}

const addCharToString = (item: Array<string>): string => {
    let itemReturn: string = ''
    if(checkIsArrayEmpty) itemReturn =item.join()
    return itemReturn
}

type IStringSplit = 'number' | 'string'

const stringSplitToArray = (item: string, type: IStringSplit = 'string', sysBol: string = ','): Array<string | number> => {
    let itemReturn: Array<string | number> = []
    const isCheck = item.indexOf(sysBol)
    if(isCheck) { 
        itemReturn = item.split(sysBol)
    } else {
        itemReturn = [item]
    }
        
    if(type === 'number') {
        itemReturn.map(item => toNumber(item))
        return itemReturn
    }
    return itemReturn

}


export {
    checkIsArrayEmpty,
    addCharToString,
    stringSplitToArray
}