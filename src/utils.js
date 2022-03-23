import { get_tile_type } from "./tiles.js";

const VAL_0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAXAgMAAACtyC0SAAAACVBMVEUAAAD/AAB7AAA/A8W9AAAAOElEQVQI12MAA9bQEAYGwdBABgaRUFcGBlEgxEqIMLAyMAh0NDIwMCkpgFlgMXw6Ql3BJkPsAAMA5/QIc/EHJvEAAAAASUVORK5CYII=";
const LOST = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaBAMAAABbZFH9AAAAD1BMVEW9vb17e3v//wD///8AAABXk1meAAAAaUlEQVQY043PwQnAMAgFUAMZIJINxAECXSCI+89UE2wVmkM/Xh6R4AdMadCvSMkaCH3Ak3JUVQ1VIdJXQpbpqrTCLmEmm+kiWxVXtYc9rp1/YlVX/OniteeKW753Rofod+xeMAINs0rWDW08IHwPjv9jAAAAAElFTkSuQmCC"

/**
 * Given a page, check if the game is over
 * @returns A boolean value.
 */
export async function game_over(page){
    let game_over = true

    for (let nb of [0,1,2] ){
        let val = await page.evaluate(li => li.getAttribute('src'), await page.$("#dd"+nb))
        if (val != VAL_0) {
            game_over = false
        }
    }

    if (await page.evaluate(li => li.getAttribute('src'), await page.$("#face")) === LOST) {
        game_over = true
    }
    
    return game_over
};

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

/**
 * Given a page, find the difficulty and return the board size
 * @param {puppeteer.page} page
 * @returns The type of tile (i.e. 'easy', 'medium', 'hard')
 */
export async function get_difficulty(page) {
    let difficulty = await page.$('#difficulty')
    let url = await page.evaluate(dif => dif.getAttribute('src'), difficulty) //get the url of the difficulty logo 
    return get_tile_type(url)
}

/**
 * It clicks on the tiles in the board from the values in an array
 */
export async function mouse_click(page, clicks, mouse_button, boardSize) {
    for (let i = 0; i < clicks.length; i++) {
        try {
            let tileNb = clicks[i][0] * boardSize[0] + clicks[i][1]
            await page.click('#tile' + tileNb, { button: mouse_button })
        } catch (error) {
            console.log("Error on mouse click :", error);
        }
    }
}

/**
 * Ajoute une methode sleep a JS 
 * 
 * @param milliseconds la duree d'attente
 */
export function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}