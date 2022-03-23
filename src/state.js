const VAL_0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAXAgMAAACtyC0SAAAACVBMVEUAAAD/AAB7AAA/A8W9AAAAOElEQVQI12MAA9bQEAYGwdBABgaRUFcGBlEgxEqIMLAyMAh0NDIwMCkpgFlgMXw6Ql3BJkPsAAMA5/QIc/EHJvEAAAAASUVORK5CYII=";

/**
 * Given a page, check if the game is over
 * @returns A boolean value.
 */
export async function game_over(page){
    for (let nb of [0,1,2] ){
        let el = await page.$("#dd"+nb)
        let val = await page.evaluate(li => li.getAttribute('src'), el)
        if (val != VAL_0) {
            return false
        }
    }
    return true
};