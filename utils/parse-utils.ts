export function parsePriceInteger(price : string){
    if (!price || price.length == 0) {
        throw new Error('Error the price is empty or null');
    }
    return parseInt(price.replace('$', ''), 10);
}

export function parsePrice(price : string){
    if (!price || price.length == 0) {
        throw new Error('Error the price is empty or null');
    }
    return parseFloat(price.replace('$', ''));
}