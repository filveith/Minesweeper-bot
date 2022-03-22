import puppeteer from 'puppeteer';

import { get_tile_type } from './tiles.js';

let tiles_clicked = [];

const ONE = 0,
    TWO = 1,
    THREE = 2,
    FOUR = 3,
    FIVE = 4,
    SIX = 5,
    SEVEN = 6,
    EIGHT = 7,
    FLAGS = 8,
    HIDDEN = 9;

let boardSize = [9, 9];
let boardSize_old = [0, 0];

(async() => {
    const browser = await puppeteer.launch({ //launch puppeteer
        headless: false,
        slowMo: 0,
    })
    const page = await browser.newPage(); //open the browser

    await page.setViewport({ width: 1920, height: 720 });

    await page.goto('https://demineur.eu/');
    sleep(1000)

    await page.click("#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-k8o10q")
    sleep(2000)
        // await page.click('#tile32')

    let myBoard = []
    let click = [
        [],
        []
    ]

    let i = 0
    let rowNb = 0
    let row = []
    let board
    boardSize = await get_board_type(page)
    console.log(`Ready to play on a ${boardSize} board`);
    while (true) {

        boardSize = await get_board_type(page)

        if (boardSize != boardSize_old) {
            board = await page.$$('#board img')
        }
        // Get the urls of all the images
        for (const el of board) {
            let url = await page.evaluate(li => li.getAttribute('src'), el) //get the url for the full res img (url stored in the attribute 'data-old-hires') 

            row[i] = get_tile_type(url)

            i++
            if (i === boardSize[0]) {
                myBoard = [...myBoard, row];
                i = 0
                row = []
            }
        }

        boardSize_old = boardSize

        let tiles = get_tiles(myBoard)

        click = check_tiles(myBoard, tiles)
            // console.log("left : ", click[0]);
            // console.log("right : ", click[1]);

        let left_clicks = click[0]
        let right_clicks = click[1]

        if (left_clicks != []) {
            await mouse_click(page, left_clicks, 'left')
        }
        if (right_clicks != []) {
            await mouse_click(page, right_clicks, 'right')

        }

        // /* The above code is clicking on the tiles in the richt_clicks array. */
        // for (let i = 0; i < richt_clicks.length; i++) {
        //     try {
        //         let tileNb = richt_clicks[i][0] * boardSize[0] + richt_clicks[i][1]
        //         await page.click('#tile' + tileNb, { button: 'right' })
        //     } catch (error) {
        //         console.log("Error on mouse click");
        //     }
        // }


        // /* The above code is clicking on the tiles in the left_clicks array. */
        // for (let i = 0; i < left_clicks.length; i++) {
        //     try {
        //         let tileNb = left_clicks[i][0] * boardSize[0] + left_clicks[i][1]
        //         await page.click('#tile' + tileNb, { button: 'left' })
        //     } catch (error) {
        //         console.log("Error on mouse click");
        //     }
        // }

        myBoard.forEach(row => {
            console.log(JSON.stringify(row));
        });

        console.log("----------------------------------------------------");
        myBoard = []
        i = 0
        row = []
    }

    // sleep(700)
    // //On cree un objet Date
    // var d = new Date
    // //On prend un screenshot a la fin pour montrer qu'on a bien réussi et on lui donne les minutes actuels en tant que nom de fichier
    // await page.screenshot({path: d.getMinutes()+".png"})
    // //On ferme le navigateur et tout les onglets ouvert
    // browser.close();
})()

async function mouse_click(page, clicks, mouse_button) {
    /* The above code is clicking on the tiles in the left_clicks array. */
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
 * Given a URL, return the tile type
 * @returns The tile type.
 */
// function get_tile_type(url) {
//     switch (url) {
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX/AAAAAAB7e3v///9Ql2ugAAAANElEQVQI12NYBQQMDQxA0MDgACNcQxwYGkRDgaz4UAcI0RoaGsLQEApkAQmwLEQdQhvYFAAmDxJuxV7pRgAAAABJRU5ErkJggg==":
//             return "X"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEW9vb0AAAB7e3v///9j2HHCAAAANElEQVQI12NYBQQMDQxA0MDgACNcQxwYGkRDgaz4UAcI0RoaGsLQEApkAQmwLEQdQhvYFAAmDxJuxV7pRgAAAABJRU5ErkJggg==":
//             return "x"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEW9vb17e3tXxGy+AAAAEElEQVQI12P4/5+hgYF4BAAJYgl/JfpRmAAAAABJRU5ErkJggg==":
//             return "0"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAD1BMVEW9vb3///97e3sAAAD/AABQHuKJAAAAOklEQVQI12MQhAABGIOJQZABDJRADBYHCIPFBcpwcUGIIKsB6zJAZxgbQxjGQIDEQFghoAQBDExQBgCHngoRLPdU8QAAAABJRU5ErkJggg==":
//             return "F"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEW9vb3///97e3sAAACeVBdNAAAAMklEQVQI12MIDQ0NARFBDAEMDFwMAfwfgISNDYxgABMgMeYDEAKkDoPrtWrVKgYtIAEAf3YRdAzsd6QAAAAASUVORK5CYII=":
//             return "?"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb3///97e3uVBMaVAAAAHklEQVQI12MIDQ0NARFBDAEMDFzkEl6rVq1i0AISAIlSC03msuDYAAAAAElFTkSuQmCC":
//             return "O"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AAP97e3u7pKrVAAAAJUlEQVQI12NYBQQMDQxAACUCgAQjiGAFEaIQLiYhGgojEHqBGAB4Gw2cMF3q+AAAAABJRU5ErkJggg==":
//             return "1"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AewB7e3vro336AAAANUlEQVQI12NYBQQMDQxAACFCQxkYGkNDHRgaA1gdgGJgIhQowRoCknUAygIZYCVgAqwNQQAA1rsQB7h1rwIAAAAASUVORK5CYII=":
//             return "2"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb3/AAB7e3uBZQfoAAAAKUlEQVQI12NYBQQMDQxAACYaQ0PBhAOQywojWIFiIAIhBlICJiDaEAQAtlYPHU2zahQAAAAASUVORK5CYII=":
//             return "3"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AAHt7e3vZn4u5AAAAJklEQVQI12NYBQQMDQxAACFERWFECIxoDA11ABNAJUAuBsGARAAAgHoNeXfAhZYAAAAASUVORK5CYII=":
//             return "4"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb17AAB7e3sERFEmAAAAKUlEQVQI12NYBQQMDQxAACYaQ0MdoEQAiBsAEYNIAJWwQgi4Oog2BAEA7gEQV+EiCoQAAAAASUVORK5CYII=":
//             return "5"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0Ae3t7e3tXnVpnAAAAKklEQVQI12NYBQQMDQxAACFCQxkYGsFEAAOMgIo5ALmsEALMBSmGaEMQAOO9EHd34ZsRAAAAAElFTkSuQmCC":
//             return "6"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AAAB7e3tloawkAAAAKUlEQVQI12NYBQQMDQxAACYaQ0MdwASQywonRBlgRAiMYAwAExBtCAIAoJQN/Vp/RC0AAAAASUVORK5CYII=":
//             return "7"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEW9vb17e3tXxGy+AAAAJklEQVQI12P4/5+hgQGE+j8wzP/BMMcCiIBsIIKwgYJANlABBAEAuf8Q+fimVN8AAAAASUVORK5CYII=":
//             return "8"
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAWlBMVEW9vb17e3v///8AAAAyMjIeHh4GBgaysrKWlpaMjIwZGRm6urq3t7erq6ujo6Obm5t+fn5xcXFra2teXl5OTk5CQkI8PDwRERELCwu0tLSQkJCPj48lJSUkJCTnYh1HAAAAiUlEQVQoz7XRyxKCMBBE0R4D4aGCovj2/3/TLiKOxpmd3mxSOVW9CcQLkIUdBOLJRDCSn1DTO7Tchbg1aV0ENp6/qTmGqbLPiGNzHFVKY9pYKaUxra1fVKaX02aI6VZkdOuAurVovwKrDjlxDM+G+En3DnMcfSeOaRxVuiDrCvnPV0LswOORK/IAq5MFjXfo9T0AAAAASUVORK5CYII=":
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAVFBMVEW9vb17e3sAAAAyMjIfHx8ZGRkGBgaysrKWlpaMjIy6urq3t7erq6ujo6Obm5uQkJB+fn5xcXFra2teXl5CQkI8PDwkJCQRERELCwu0tLRPT09NTU3ziK3aAAAAeklEQVQoz8XRxw6AIBBF0RFFsff+///pKMgQylZvWBBO8jZAFAqIXMPj70fKmwAVI0t7L1Uxw6bdpXxlT7whesdUOEqkxqgpI5JjFBeaEvmydUMqb7FFSw0guI+OErBstgnHQIWjJt1jOsFNOkuSe5SoBav2619GC3QBU+cEJodccrEAAAAASUVORK5CYII=":
//             return [9, 9]
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAdVBMVEW9vb17e3v///8AAAAPDw8TExOJiYlpaWkWFha6urqvr692dnYHBwefn59ubm45OTm3t7e0tLSrq6unp6ednZ2bm5uSkpKDg4NYWFhFRUUrKyshISEdHR2goKCUlJSQkJBbW1taWlpNTU1KSko9PT0yMjIwMDD6GaHeAAAApUlEQVQoz3XSNxIDIRBE0UHNAuu9X3lz/yOKohRphk8VyUs6GFKxiNRJjhSpmAQiIfVHlY1Q9gLqTKKLg89NnCx+WUYJkFwnB2iB6syYrBbI2fQOLKlNGJX9Bt/Wl4xmjZCepRlFnhfyjH0oh/Mu0bPJiyJvHpxMu8K3tobReCB0jIwcgOXmv0SYoQ2R0dKMT0e+7s2pSimUVozEAyAlR/7FKCrqCy/SB4ur07n7AAAAAElFTkSuQmCC":
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAclBMVEW9vb17e3sAAAAPDw8TExO5ubmvr6+fn5+JiYl2dnZZWVmbm5tubm5oaGgWFhYICAi3t7e0tLSrq6unp6eSkpKIiIiDg4NqampLS0tFRUU8PDw5OTkrKyshISEdHR0YGBigoKCUlJSQkJAyMjIwMDAHBwfyJwQeAAAAnUlEQVQoz63SNw7DMBBEUXuYRCrnLDne/4qmQHe7quxpWDyA+MVerme7BOLtYHZ/oaQ/IT0Bk+bovsMvayil+C4lJAH5aDJAMDTrqNUzQ3uqHOBULwmZeoHfUhtCnQgVouMycmtzPmM1Jr6tHA2Fzd+2GChF5Qi/sYwIxVvI2GJCGQDnAEgmQ7T+W8FlvKrjqZ6UEhVelfx2G+eH+AFR5AaB09ThtAAAAABJRU5ErkJggg==":
//             return [16, 16]
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAZlBMVEW9vb17e3sAAAD///+6urq0tLRvb28cHBwODg6rq6ukpKRzc3Nra2tgYGBWVlYiIiIWFha3t7e2traxsbGnp6eKiop/f38XFxcUFBQICAigoKCRkZF5eXlubm5jY2NKSko3NzcoKCh7SYwzAAAAnklEQVQoz4XS6Q6DIBAE4N0tKl6I9Wjt3fd/yYamAk4knb9fJhnIEqdCxIf9EAdC+RLthIFuTYqOZ50lKBdpgXxJRGdAvuRqQKqacqMdLeY+VSqQEcjT01hs5VR5orKLpRjjGcM7knK7MPM9W+L410odASm70qKABvG5AF3d5prdK2agXHTTE6naSgs0P34f2zc1EOQ/UeraOAhSUvgDVpgGnnD0dCwAAAAASUVORK5CYII=":
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAY1BMVEW9vb17e3sAAAC6urpvb28VFRW0tLQODg6pqamkpKRzc3MiIiIbGxu3t7e2traxsbGsrKyKiop/f39sbGxhYWFbW1tUVFQXFxcICAigoKCRkZFqampjY2NKSko3NzcoKCgfHx9jPwO+AAAAlUlEQVQoz63S2Q6EIAwFUCiboI7b6Di7//+VYqIUGnnzhoSHk0saUsZzYTFR8+c8lxAfcnRTRmdIAtxTwhKA0SlhKdSQhO3kZDaaJ9lZgTQCyTdQsaTysPhgW8ZSFfEYzZ8IEtOhp1o6/O+gkhES6qBZEGog5Enotc3seOWvnpAEM9T+XadgJNR/9o+t3w7p2t3IL+IKQAMFDjaI1OsAAAAASUVORK5CYII=":
//             return [30, 16]
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAyVBMVEV7e3u9vb3//\//tHCT/8gDrHSXuJiLrISnuKSL/8AC+t7jjOkHuIiPwQB7xRh3xShz1fhP4og29u7vFoqPQen30bhb3kxD5qgz7wAj92wTBr6/GmpzJkZTLio7XZ2vXY2jZXGDeTFLhQkjvMCDvOB/wPx7yVhr0dBX2ghP2hxL8zQb81AX80QX+4AP+6QLDqarHnJ3NhIfOg4bSc3bYXWLbVFnlNTzoKjLoJi3tICPvOR/wQx3zXxnzXhn1eRT4nA76tAv7yAf+6gEypmiUAAAA7klEQVQoz53PR3aDQBREUb6ru8lJIirnLDnn7P0vykgGAweY6E3vpEpqjCTpoj5KtFkSopqkfxqB541bBbo11jZOzVYABjn1uetACTb7XSB8wMFNRl3ZcYGIHXMBbFdyNyV9plpAfKLYNM1YnU9S6vFPBZh+BG749f2TeMivUqKhIZBl+Iet4lFGmo5CS+u+ML4tv7/Np+L5zx60ApEndkxlTN1HC8htKhKNXy3YUYI+rqlMnUcAirN8wR2VKKnHLVsRtqFrFaKh2DC2frqkKmm6eQh5n6p0fLAQA6ol8jBpNVBr1KEK5ZWJpKbOkV9Z7RFPbhTK+AAAAABJRU5ErkJggg==":
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAvVBMVEW9vb17e3vtHCT/8gDrHSTrHifuJiLuKSLwQB71fhO+t7jqIyrxRh3xShy9u7vFoqPZXGHjPUPuIyPvOB/0bhb2hRL3kxD4ow35qgz80QX91gTBr6/GmpzJkZTLio7OhIfQen7XZ2vXY2jeTFLjOT/tISPvMCDwPx7zXhn0dBX4ng77vwn8ywb93AT+4AP+6QLDqarHnJ3QeXzSc3bbVFngRUvlNTzoKjLuJSPyUxvyWRr1eRT6tAv7wQj+6gF5k4xXAAAA6ElEQVQoz6WSxXbDMBBF02ehme1gAw1Tmdv//6zKPnbjgFa5Ryvdxcy8mdaNjpZSWqfeZa5UPkgFpXTiNtTTNHFQEiUARgc1IJkETze7dspiQOK2Vj1LZsCPUbAC0JG0V6kgMmz1UaqtEGJrzINK9cmKA7OvNMu/N7/K5/ShrjUO31ETxvsOH/63Yd6hwdJ+bjTvWYvFfMamKHk1myMPWdso2K0/YHnHQU2EDWetZKyGOlbdNwBcLiP4Z/H2ie1w5oSBeZ78uCiXWPenyZcTiH1OBhf35dFPNtKs8hEvrka5fvf629Af4h+V1g9Ka6YK4QAAAABJRU5ErkJggg==":
//             return [50, 50]
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAeFBMVEW9vb17e3sAAAD///8dHR1JSUkxMTEODg4FBQWysrKvr6+YmJh3d3dTU1MsLCwiIiK4uLi2traqqqqioqKBgYFycnJkZGRZWVlYWFgmJiYYGBgVFRUSEhIKCgq5ubmkpKScnJyUlJSNjY2GhoZcXFxEREQ8PDw5OTkbfTg2AAAAqElEQVQoz3XNVxKDMAxF0WfFBlND76SX/e8wBFIsyvWHR3NmJIitALFbD4IRk5GwkjDpGEitpfKWlGuaquaU0a8bp6ilfydGGRkFjJRJNaO9STajnswY0Tb1Zfjdpgq+0LrCG+8pB75l0jg6gz2Gr8kZHWQJnIlSuFYXM8KFQpFI6RUd+eCEgD49MaconKRxFwS3fkubYkmIK1vfE3AyYwSxHoa3RUxYL8nOB//PC+1IAAAAAElFTkSuQmCC":
//             return [100, 100]
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAilBMVEW9vb17e3v///8AAAC6urq3t7e0tLRqampEREQvLy8NDQ0FBQWysrJ/f39SUlJOTk4WFhYUFBSpqamioqKenp6bm5t2dnYqKioPDw+5ubmmpqaNjY2IiIiEhIRhYWFKSkpAQEA9PT02NjY0NDQoKCgjIyMdHR0JCQmrq6uWlpZlZWVZWVlISEgcHBxT10T8AAAA50lEQVQoz43SV47DMAwE0NGO3HtZ2+k92+9/vSX9IdhIDGT0RTwQICjCLAUwb88DA7MkI+FJzIuUHuNzA9gH8nY9WUVri/VhPyPvUJLf2uNXt3RGXyK5CnbcABtHqyAir0kgAsOh3Q6OQpI/H2QAvMfkkOSOsoRXbBNyr9IfA+vImiSDzUhK69mbD1/rBB0lF5EZqaCNhYqxmpBKU5FqVitHFn4XiES52O8KjlRupEiKgmQ47UJXthHLFLCh2MmbUNbA7//GPZ/E8glB91CM83gX3j9nVN9DXwXww/qFX8bStclbokUx/82BC2Sx6WA7AAAAAElFTkSuQmCC":
//             return [30, 16]
//         case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAD1BMVEW9vb0AAAD/AAB7e3v///9UaJa4AAAAS0lEQVQI11WNwQnAMAwDRSawPIEjOkCg++9Wq4SG6nX4sIR7Bws7hnhBhlFYo8iQlcgsQ15UGKichhYtoy+Gn8KYFM67CxHQmfjWH/GqCYCzIeZyAAAAAElFTkSuQmCC":
//             return "N"
//         default:
//             console.log("ALED CASE INCONUS");
//             console.log(url);
//             break;
//     }
// }

/**
 * Given a page, find the difficulty and return the board size
 * @param {puppeteer.page} page
 * @returns The type of tile (i.e. 'easy', 'medium', 'hard')
 */
async function get_board_type(page) {
    let difficulty = await page.$('#difficulty')
    let url = await page.evaluate(dif => dif.getAttribute('src'), difficulty) //get the url of the difficulty logo 
    return get_tile_type(url)
}

/**
 * Given a board, it returns a list of lists of coordinates
 * @returns an array of arrays. Each array contains the coordinates of the tiles of the corresponding
 * type.
 */
function get_tiles(myBoard) {
    let nb = 0
    let nbRows = Object.keys(myBoard).length
    let coord = [0, 0]

    let one = [],
        two = [],
        three = [],
        four = [],
        five = [],
        six = [],
        seven = [],
        height = [],
        flags = [],
        hidden = []



    for (let nb_row in myBoard) {
        let i = 0
        for (let field of myBoard[parseInt(nb_row)]) {
            coord = [parseInt(nb_row), i]

            switch (field) {
                case "1":
                    one = [...one, coord]
                    break;
                case "2":
                    two = [...two, coord]
                    break;
                case "3":
                    three = [...three, coord]
                    break;
                case "4":
                    four = [...four, coord]
                    break;
                case "5":
                    five = [...five, coord]
                    break;
                case "6":
                    six = [...six, coord]
                    break;
                case "7":
                    seven = [...seven, coord]
                    break;
                case "8":
                    height = [...height, coord]
                    break;
                case "F":
                    flags = [...flags, coord]
                    break;
                case "O":
                    hidden = [...hidden, coord]
                    break;
                default:
                    break;
            }
            i++
        }
    }
    return [one, two, three, four, five, six, seven, height, flags, hidden]
}

/**
 * Given a board and a list of tiles, return a list of the tiles that are neighbors of the tiles in the
 * list
 * @param board - the board object
 * @param tiles - an array of tiles
 * @returns an array of two arrays. The first array contains the left clicks and the second array
 * contains the right clicks.
 */
function check_tiles(board, tiles) {
    let clicks = []
    let left_click = [],
        right_clicks = []

    tiles.forEach((tile_cat, i) => {
        i++
        if (i <= 8) {
            tile_cat.forEach(tile => {
                // The type is the tile value [1...8]
                let tile_type = i
                    // Tile number in the page [1,2] = tile nb 11
                let tile_number = tile[0] * boardSize[0] + tile[1]

                clicks = get_neighbors(tiles, i, tile)

                left_click = array_contains(left_click, clicks[0])
                right_clicks = array_contains(right_clicks, clicks[1])

            });
        }
    });

    // Click[0] are the left click and clicks[1] the right clicks
    return [left_click, right_clicks]
}


/**
 * Given an array of arrays, return a new array of arrays that contains all the values from the
 * original array, 
 * but with no duplicates
 * 
 * @param {array} array 
 * @param {array} values 
 * @returns An array of arrays.
 */
function array_contains(array, values) {
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
 * Given a tile, return the tiles that can be clicked on and the tiles that can be flagged
 * @param tiles - the tiles object
 * @param tile_type - The number of mines around the tile
 * @param tile - the current tile that the user has clicked on
 * @returns an array containing two arrays. The first array contains the tiles that can be left clicked
 * and the second array contains the tiles that can be right clicked.
 */
function get_neighbors(tiles, tile_type, tile) {
    // Only one left click possible per case but mutliple right clicks
    let left_click = [],
        right_clicks = [];
    let X = tile[0],
        Y = tile[1];
    let newX, newY
    let nb_flags = 0
    let nb_hidden = 0
    let hidden = []
    let nbClick = 0

    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            newX = x + X
            newY = y + Y
            try {

                if (tiles[FLAGS].find(flag => flag[0] == newX && flag[1] == newY) != undefined) { // Check if a neighbor is a flag
                    nbClick++
                    nb_flags++
                    if (nb_flags == tile_type && left_click != undefined) {
                        left_click = [tile]
                    }
                } else if (tiles[HIDDEN].find(flag => flag[0] == newX && flag[1] == newY) != undefined) { // Check the number of hidden tiles
                    nbClick++
                    nb_hidden++
                    hidden = [...hidden, [newX, newY]]
                }
            } catch (error) {}
        }
    }

    // If the number of flags is equal to the tile type and if there are no hidden tiles then do nothing (means that there are no more actions possible there)
    if (nb_flags == tile_type) {
        if (nb_hidden == 0) {
            left_click = []
        }
        right_clicks = []
    } else if (nb_flags + nb_hidden === tile_type) {
        right_clicks = [...hidden]
    }

    return [left_click, right_clicks]
}

/**
 * Ajoute une methode sleep a JS 
 * 
 * @param milliseconds la duree d'attente
 */
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}