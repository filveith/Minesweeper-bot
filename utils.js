/**
 * Given an array of arrays, return a new array of arrays that contains all the values from the
 * original array, 
 * but with no duplicates
 * 
 * @param {array} array 
 * @param {array} values 
 * @returns An array of arrays.
 */
export function array_contains(array, values) {
    let add = false
    let duplicate = false
    if (array.length !== 0) {
        values.forEach(val => {
            array.forEach(element => {
                if (element[0] != undefined) {
                    if (!(element[0] == val[0] && element[1] == val[1])) {
                        add = true
                    } else {
                        duplicate = true
                    }
                } else {
                    array = [val]
                }
            });
            if (add && !duplicate) {
                array = [...array, val]
                duplicate = false
                add = false
            }
        });

    } else {
        array = [...values]
    }
    return array
}