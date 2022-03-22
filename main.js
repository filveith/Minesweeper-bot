const puppeteer = require('puppeteer');

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

    let board = await page.$$('#board img')
    let i = 0
    let rowNb = 0
    let row = []
    boardSize = await get_board_type(page)
    console.log(boardSize[0]);


    while (true) {
        // let temp =
        // boardSize = temp
        // boardSize = await get_board_type(page)
        // console.log(boardSize);

        // Get the urls of all the images
        for (const el of board) {
            let url = await page.evaluate(li => li.getAttribute('src'), el) //get the url for the full res img (url stored in the attribute 'data-old-hires') 

            row[i] = get_tile_type(url)

            i++
            if (i == boardSize[0]) {
                myBoard = [...myBoard, row];
                i = 0
                row = []
            }
        }


        let tiles = get_tiles(myBoard)

        let click = check_tiles(myBoard, tiles)
            // console.log("left : ", click[0]);
            // console.log("right : ", click[1]);

        let left_clicks = click[0]
        let richt_clicks = click[1]

        /* The above code is clicking on the tiles in the richt_clicks array. */
        for (let i = 0; i < richt_clicks.length; i++) {
            try {
                let tileNb = richt_clicks[i][0] * boardSize[0] + richt_clicks[i][1]
                await page.click('#tile' + tileNb, { button: 'right' })
            } catch (error) {
                console.log("Error on mouse click");
            }
        }

        /* The above code is clicking on the tiles in the left_clicks array. */
        for (let i = 0; i < left_clicks.length; i++) {
            try {
                let tileNb = left_clicks[i][0] * boardSize[0] + left_clicks[i][1]
                await page.click('#tile' + tileNb, { button: 'left' })
            } catch (error) {
                console.log("Error on mouse click");
            }
        }

        // myBoard.forEach(row => {
        //     console.log(JSON.stringify(row));
        // });

        // console.log("----------------------------------------------------");
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

/**
 * Given a URL, return the tile type
 * @returns The tile type.
 */
function get_tile_type(url) {
    switch (url) {
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX/AAAAAAB7e3v///9Ql2ugAAAANElEQVQI12NYBQQMDQxA0MDgACNcQxwYGkRDgaz4UAcI0RoaGsLQEApkAQmwLEQdQhvYFAAmDxJuxV7pRgAAAABJRU5ErkJggg==":
            return "X"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEW9vb0AAAB7e3v///9j2HHCAAAANElEQVQI12NYBQQMDQxA0MDgACNcQxwYGkRDgaz4UAcI0RoaGsLQEApkAQmwLEQdQhvYFAAmDxJuxV7pRgAAAABJRU5ErkJggg==":
            return "x"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEW9vb17e3tXxGy+AAAAEElEQVQI12P4/5+hgYF4BAAJYgl/JfpRmAAAAABJRU5ErkJggg==":
            return "0"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAD1BMVEW9vb3///97e3sAAAD/AABQHuKJAAAAOklEQVQI12MQhAABGIOJQZABDJRADBYHCIPFBcpwcUGIIKsB6zJAZxgbQxjGQIDEQFghoAQBDExQBgCHngoRLPdU8QAAAABJRU5ErkJggg==":
            return "F"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEW9vb3///97e3sAAACeVBdNAAAAMklEQVQI12MIDQ0NARFBDAEMDFwMAfwfgISNDYxgABMgMeYDEAKkDoPrtWrVKgYtIAEAf3YRdAzsd6QAAAAASUVORK5CYII=":
            return "?"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb3///97e3uVBMaVAAAAHklEQVQI12MIDQ0NARFBDAEMDFzkEl6rVq1i0AISAIlSC03msuDYAAAAAElFTkSuQmCC":
            return "O"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AAP97e3u7pKrVAAAAJUlEQVQI12NYBQQMDQxAACUCgAQjiGAFEaIQLiYhGgojEHqBGAB4Gw2cMF3q+AAAAABJRU5ErkJggg==":
            return "1"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AewB7e3vro336AAAANUlEQVQI12NYBQQMDQxAACFCQxkYGkNDHRgaA1gdgGJgIhQowRoCknUAygIZYCVgAqwNQQAA1rsQB7h1rwIAAAAASUVORK5CYII=":
            return "2"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb3/AAB7e3uBZQfoAAAAKUlEQVQI12NYBQQMDQxAACYaQ0PBhAOQywojWIFiIAIhBlICJiDaEAQAtlYPHU2zahQAAAAASUVORK5CYII=":
            return "3"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AAHt7e3vZn4u5AAAAJklEQVQI12NYBQQMDQxAACFERWFECIxoDA11ABNAJUAuBsGARAAAgHoNeXfAhZYAAAAASUVORK5CYII=":
            return "4"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb17AAB7e3sERFEmAAAAKUlEQVQI12NYBQQMDQxAACYaQ0MdoEQAiBsAEYNIAJWwQgi4Oog2BAEA7gEQV+EiCoQAAAAASUVORK5CYII=":
            return "5"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0Ae3t7e3tXnVpnAAAAKklEQVQI12NYBQQMDQxAACFCQxkYGsFEAAOMgIo5ALmsEALMBSmGaEMQAOO9EHd34ZsRAAAAAElFTkSuQmCC":
            return "6"
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAWlBMVEW9vb17e3v///8AAAAyMjIeHh4GBgaysrKWlpaMjIwZGRm6urq3t7erq6ujo6Obm5t+fn5xcXFra2teXl5OTk5CQkI8PDwRERELCwu0tLSQkJCPj48lJSUkJCTnYh1HAAAAiUlEQVQoz7XRyxKCMBBE0R4D4aGCovj2/3/TLiKOxpmd3mxSOVW9CcQLkIUdBOLJRDCSn1DTO7Tchbg1aV0ENp6/qTmGqbLPiGNzHFVKY9pYKaUxra1fVKaX02aI6VZkdOuAurVovwKrDjlxDM+G+En3DnMcfSeOaRxVuiDrCvnPV0LswOORK/IAq5MFjXfo9T0AAAAASUVORK5CYII=":
            return [9, 9]
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAdVBMVEW9vb17e3v///8AAAAPDw8TExOJiYlpaWkWFha6urqvr692dnYHBwefn59ubm45OTm3t7e0tLSrq6unp6ednZ2bm5uSkpKDg4NYWFhFRUUrKyshISEdHR2goKCUlJSQkJBbW1taWlpNTU1KSko9PT0yMjIwMDD6GaHeAAAApUlEQVQoz3XSNxIDIRBE0UHNAuu9X3lz/yOKohRphk8VyUs6GFKxiNRJjhSpmAQiIfVHlY1Q9gLqTKKLg89NnCx+WUYJkFwnB2iB6syYrBbI2fQOLKlNGJX9Bt/Wl4xmjZCepRlFnhfyjH0oh/Mu0bPJiyJvHpxMu8K3tobReCB0jIwcgOXmv0SYoQ2R0dKMT0e+7s2pSimUVozEAyAlR/7FKCrqCy/SB4ur07n7AAAAAElFTkSuQmCC":
            return [16, 16]
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAZlBMVEW9vb17e3sAAAD///+6urq0tLRvb28cHBwODg6rq6ukpKRzc3Nra2tgYGBWVlYiIiIWFha3t7e2traxsbGnp6eKiop/f38XFxcUFBQICAigoKCRkZF5eXlubm5jY2NKSko3NzcoKCh7SYwzAAAAnklEQVQoz4XS6Q6DIBAE4N0tKl6I9Wjt3fd/yYamAk4knb9fJhnIEqdCxIf9EAdC+RLthIFuTYqOZ50lKBdpgXxJRGdAvuRqQKqacqMdLeY+VSqQEcjT01hs5VR5orKLpRjjGcM7knK7MPM9W+L410odASm70qKABvG5AF3d5prdK2agXHTTE6naSgs0P34f2zc1EOQ/UeraOAhSUvgDVpgGnnD0dCwAAAAASUVORK5CYII=":
            return [30, 16]
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAyVBMVEV7e3u9vb3//\//tHCT/8gDrHSXuJiLrISnuKSL/8AC+t7jjOkHuIiPwQB7xRh3xShz1fhP4og29u7vFoqPQen30bhb3kxD5qgz7wAj92wTBr6/GmpzJkZTLio7XZ2vXY2jZXGDeTFLhQkjvMCDvOB/wPx7yVhr0dBX2ghP2hxL8zQb81AX80QX+4AP+6QLDqarHnJ3NhIfOg4bSc3bYXWLbVFnlNTzoKjLoJi3tICPvOR/wQx3zXxnzXhn1eRT4nA76tAv7yAf+6gEypmiUAAAA7klEQVQoz53PR3aDQBREUb6ru8lJIirnLDnn7P0vykgGAweY6E3vpEpqjCTpoj5KtFkSopqkfxqB541bBbo11jZOzVYABjn1uetACTb7XSB8wMFNRl3ZcYGIHXMBbFdyNyV9plpAfKLYNM1YnU9S6vFPBZh+BG749f2TeMivUqKhIZBl+Iet4lFGmo5CS+u+ML4tv7/Np+L5zx60ApEndkxlTN1HC8htKhKNXy3YUYI+rqlMnUcAirN8wR2VKKnHLVsRtqFrFaKh2DC2frqkKmm6eQh5n6p0fLAQA6ol8jBpNVBr1KEK5ZWJpKbOkV9Z7RFPbhTK+AAAAABJRU5ErkJggg==":
            return [50, 50]
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAeFBMVEW9vb17e3sAAAD///8dHR1JSUkxMTEODg4FBQWysrKvr6+YmJh3d3dTU1MsLCwiIiK4uLi2traqqqqioqKBgYFycnJkZGRZWVlYWFgmJiYYGBgVFRUSEhIKCgq5ubmkpKScnJyUlJSNjY2GhoZcXFxEREQ8PDw5OTkbfTg2AAAAqElEQVQoz3XNVxKDMAxF0WfFBlND76SX/e8wBFIsyvWHR3NmJIitALFbD4IRk5GwkjDpGEitpfKWlGuaquaU0a8bp6ilfydGGRkFjJRJNaO9STajnswY0Tb1Zfjdpgq+0LrCG+8pB75l0jg6gz2Gr8kZHWQJnIlSuFYXM8KFQpFI6RUd+eCEgD49MaconKRxFwS3fkubYkmIK1vfE3AyYwSxHoa3RUxYL8nOB//PC+1IAAAAAElFTkSuQmCC":
            return [100, 100]
        case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAilBMVEW9vb17e3v///8AAAC6urq3t7e0tLRqampEREQvLy8NDQ0FBQWysrJ/f39SUlJOTk4WFhYUFBSpqamioqKenp6bm5t2dnYqKioPDw+5ubmmpqaNjY2IiIiEhIRhYWFKSkpAQEA9PT02NjY0NDQoKCgjIyMdHR0JCQmrq6uWlpZlZWVZWVlISEgcHBxT10T8AAAA50lEQVQoz43SV47DMAwE0NGO3HtZ2+k92+9/vSX9IdhIDGT0RTwQICjCLAUwb88DA7MkI+FJzIuUHuNzA9gH8nY9WUVri/VhPyPvUJLf2uNXt3RGXyK5CnbcABtHqyAir0kgAsOh3Q6OQpI/H2QAvMfkkOSOsoRXbBNyr9IfA+vImiSDzUhK69mbD1/rBB0lF5EZqaCNhYqxmpBKU5FqVitHFn4XiES52O8KjlRupEiKgmQ47UJXthHLFLCh2MmbUNbA7//GPZ/E8glB91CM83gX3j9nVN9DXwXww/qFX8bStclbokUx/82BC2Sx6WA7AAAAAElFTkSuQmCC":
            return [30, 16]

        default:
            console.log("ALED CASE INCONUS");
            console.log(url);
            break;
    }
}

async function get_board_type(page) {
    let difficulty = await page.$('#difficulty')
    let url = await page.evaluate(dif => dif.getAttribute('src'), difficulty) //get the url of the difficulty logo 
    let board_size = get_tile_type(url)
    return board_size
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

    let one = two = three = four = five = six = seven = height = flags = hidden = []

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
                // console.log(tile, i);
                // The type is the tile value [1...8]
                let tile_type = i
                    // Tile number in the page [1,2] = tile nb 11
                let tile_number = tile[0] * boardSize[0] + tile[1]

                clicks = get_neighbors(tiles, i, tile)

                // console.log("LEFT -------------------------------");
                left_click = array_contains(left_click, clicks[0])
                    // console.log("-------------------------------");
                    // console.log("RIGHT -------------------------------");
                right_clicks = array_contains(right_clicks, clicks[1])
                    // console.log("-------------------------------");

                // left_click = [...left_click, ...clicks[0]]
                // right_clicks = [...right_clicks, ...clicks[1]]
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
    // console.log("ARRAY : ", array);
    // console.log("VALUES : ", values);
    let stop = 0
    let add = false
    let duplicate = false
    let newValues = []
    if (array.length !== 0) {
        values.forEach(val => {
            array.forEach(element => {
                // element.every(el => {
                // console.log("el: ", element, " val: ", val);
                if (element[0] != undefined) {
                    if (!(element[0] == val[0] && element[1] == val[1])) {

                        // console.log("add ", val);
                        add = true

                    } else {
                        duplicate = true
                    }
                } else {
                    // console.log("element undefined : ", val);
                    array = [val]
                }
            });
            if (add && !duplicate) {
                // console.log("addReal : ", val);
                array = [...array, val]
                    // console.log("added : ", array);

                duplicate = false

                add = false
            }
        });

    } else {
        // console.log("Array empty values :", values);

        array = [...values]
    }
    return array
}
// todo : a flag is not counted in the neighbors so if 3 we can have one flag and he can click on three empty tiles
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
    let left_click = right_clicks = [];
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
                    // console.log("FLAGS at ", [newX, newY], " for tile : ", tile);
                    nb_flags++
                    if (nb_flags == tile_type && left_click != undefined) {
                        left_click = [tile]
                    }
                } else if (tiles[HIDDEN].find(flag => flag[0] == newX && flag[1] == newY) != undefined) { // Check the number of hidden tiles
                    nbClick++
                    // console.log("HIDDEN at ", [newX, newY], " for tile : ", tile);
                    nb_hidden++
                    hidden = [...hidden, [newX, newY]]
                }
            } catch (error) {
                // console.log("Out of range");
            }
        }
    }

    // If the number of flags is equal to the tile type and if there are no hidden tiles then do nothing (means that there are no more actions possible there)
    if (nb_flags == tile_type) {
        if (nb_hidden == 0) {
            left_click = []
        }
        right_clicks = []
    }
    // else if (nbClick != tile_type) {
    //     left_click = right_clicks = []
    //  } 
    else if (nb_flags + nb_hidden === tile_type) {
        right_clicks = [...hidden]
    }
    // else if (nb_hidden == tile_type) { // Check if the nb of hidden tiles is the same as the tile type (If yes it means that we can put a flag on all the hidden tiles)

    // console.log("-----------------------------------");
    // console.log(right_clicks);
    // console.log("-----------------------------------");
    // left_click = [tile] // Add the current tile to the left clicks beacause if we add flags to all the hidden tiles so we can click on it 
    // }



    // console.log(left_click, right_clicks);
    return [left_click, right_clicks]
}

async function click_on_all(page, board, coords) {

    let i = 0
    for (const coord of coords) {
        let tile_nb = coord[0] * boardSize[0] + coord[1]
        console.log(tile_nb);
        if (i == tile_nb) {
            try {
                // const preview_coordinates = await field.boundingBox()
                // await field.click({ button: 'left' });
                await page.click('#tile' + tile_nb)
                console.log("Clicked on tile " + tile_nb);

            } catch (error) {
                console.log("Mouse click error : " + error);
            }
            i = 0
        }
        i++
    }
}


/**
 * Click on the tile with the given coordinates
 * 
 * @param {puppeteer.page} page 
 * @param {[x,y]} tile_coord the coordinates of the tile to click on
 */
function click_on(page, tile_coord) {
    let tile_nb = tile_coord[0] * boardSize[0] + tile_coord[1]
        // console.log("click on tilenb: ",tile_nb);
    try {
        if (!tiles_clicked.includes(tile_nb)) {
            page.click('#tile' + tile_nb)
            console.log("Clicked on tile " + tile_nb);
            tiles_clicked = [...tiles_clicked, tile_nb]
        } else {
            console.log("Already clicked ", tile_nb);
        }
    } catch (error) {
        console.log("Mouse click error on tile : " + tile_nb + " \n err : " + error);
    }
}



function add_flags(page, board, hidden_tiles) {
    // console.log("click on tilenb: ",tile_nb);
    hidden_tiles.forEach(tile_coord => {
        let tile_nb = tile_coord[0] * boardSize[0] + tile_coord[1]
            // let tile = get_tile_type(await page.$('#tile'+tile_nb))
        try {
            if (board[tile_coord[0]][tile_coord[1]] == "O") {
                // console.log("Try RIGHT click on tile "+tile_nb);
                page.click('#tile' + tile_nb, { button: 'right', delay: 100 });
                console.log("RIGHT Clicked on tile " + tile_nb);
            }
        } catch (error) {
            console.log("Mouse click error on tile : " + tile_nb + " \n err : " + error);
        }
    });
}


/**
 * Given a coordinate, find all the hidden cells around it and return them
 * @returns -1 if the number of flags is equal to the number of hidden cells.
 */
function find_hidden(myBoard, coord, type, page) {
    let newCoord = []
    let hidden = []
        // console.log(coord);
    let coord_X = coord[0]
    let coord_Y = coord[1]
    let new_X, new_Y
    let nb_flags = 0
    let nb_hidden = 0

    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {

            new_X = coord_X + x
            new_Y = coord_Y + y
                // console.log(coord_X, coord_Y, new_X, coord_Y);
            if (!(new_X < 0 || new_Y < 0 || new_X > 8 || new_Y > 8 || myBoard[new_X][new_Y] === undefined)) {

                // console.log("x: ", x, "  y: ", y, " old coord: ", coord_X,coord_Y, "  boardV: ", myBoard[coord_X][coord_Y]);
                // console.log("x: ", x, "  y: ", y, " new coord: ", new_X,new_Y, "  boardV: ", myBoard[new_X][new_Y]);
                try {
                    if (myBoard[new_X][new_Y] == ("F" || "?")) {
                        // console.log("FOUND FLAG AT ",new_X, new_Y, myBoard[new_X][new_Y]);
                        nb_flags++
                        newCoord = [...newCoord, [new_X, new_Y]]
                    } else if (myBoard[new_X][new_Y] == ("O")) {
                        hidden = [...hidden, [new_X, new_Y]]
                        nb_hidden++
                    } else if (myBoard[new_X][new_Y] == "0") {
                        // newCoord = [...newCoord, [new_X, new_Y]]
                    }
                } catch (error) {
                    console.log("Out of range");
                }
            }
            // console.log("nb flags: ", nb_flags);

            if ((nb_flags) == type) {
                click_on(page, coord)
                return -1
            }
        }
    }
    // console.log("nb hidden : ",nb_hidden);
    if (nb_hidden == type && nb_flags != type) {
        add_flags(page, myBoard, hidden)

        return -1
    }
    return newCoord;
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