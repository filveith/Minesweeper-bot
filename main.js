const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({ //launch puppeteer
        headless: false,
        slowMo: 0,
    })
    const page = await browser.newPage(); //open the browser

    await page.setViewport({ width: 1200, height: 720 });

    await page.goto('https://demineur.eu/');
    sleep(2000)

    await page.click("#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-k8o10q")
    sleep(1000)

    let myBoard = []

    let board = await page.$$('#board img')
    // console.log(board);
    let i = 0
    let rowNb = 0
    let row = []
    while (true) {
        for (const el of board) {
            // let img = await el.$('img'); //Get the link to the product page
            let url = await page.evaluate(li => li.getAttribute('src'), el) //get the url for the full res img (url stored in the attribute 'data-old-hires') 
                // console.log(url);
            if (i == 9) {
                myBoard = [...myBoard, row];
                i = 0
                row = []
            }
            switch (url) {
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX/AAAAAAB7e3v///9Ql2ugAAAANElEQVQI12NYBQQMDQxA0MDgACNcQxwYGkRDgaz4UAcI0RoaGsLQEApkAQmwLEQdQhvYFAAmDxJuxV7pRgAAAABJRU5ErkJggg==":
                    row[i] = "X"
                    break;
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEW9vb0AAAB7e3v///9j2HHCAAAANElEQVQI12NYBQQMDQxA0MDgACNcQxwYGkRDgaz4UAcI0RoaGsLQEApkAQmwLEQdQhvYFAAmDxJuxV7pRgAAAABJRU5ErkJggg==":
                    row[i] = "x"
                    break;
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEW9vb17e3tXxGy+AAAAEElEQVQI12P4/5+hgYF4BAAJYgl/JfpRmAAAAABJRU5ErkJggg==":
                    row[i] = "0"
                    break;
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAD1BMVEW9vb3///97e3sAAAD/AABQHuKJAAAAOklEQVQI12MQhAABGIOJQZABDJRADBYHCIPFBcpwcUGIIKsB6zJAZxgbQxjGQIDEQFghoAQBDExQBgCHngoRLPdU8QAAAABJRU5ErkJggg==":
                    row[i] = "F"
                    break;
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb3///97e3uVBMaVAAAAHklEQVQI12MIDQ0NARFBDAEMDFzkEl6rVq1i0AISAIlSC03msuDYAAAAAElFTkSuQmCC":
                    row[i] = "O"
                    break;
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AAP97e3u7pKrVAAAAJUlEQVQI12NYBQQMDQxAACUCgAQjiGAFEaIQLiYhGgojEHqBGAB4Gw2cMF3q+AAAAABJRU5ErkJggg==":
                    row[i] = "1"
                    break;
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AewB7e3vro336AAAANUlEQVQI12NYBQQMDQxAACFCQxkYGkNDHRgaA1gdgGJgIhQowRoCknUAygIZYCVgAqwNQQAA1rsQB7h1rwIAAAAASUVORK5CYII=":
                    row[i] = "2"
                    break;
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb3/AAB7e3uBZQfoAAAAKUlEQVQI12NYBQQMDQxAACYaQ0PBhAOQywojWIFiIAIhBlICJiDaEAQAtlYPHU2zahQAAAAASUVORK5CYII=":
                    row[i] = "3"
                    break;
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AAHt7e3vZn4u5AAAAJklEQVQI12NYBQQMDQxAACFERWFECIxoDA11ABNAJUAuBsGARAAAgHoNeXfAhZYAAAAASUVORK5CYII=":
                    row[i] = "4"
                    break;
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb17AAB7e3sERFEmAAAAKUlEQVQI12NYBQQMDQxAACYaQ0MdoEQAiBsAEYNIAJWwQgi4Oog2BAEA7gEQV+EiCoQAAAAASUVORK5CYII=":
                    row[i] = "5"
                    break;
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0Ae3t7e3tXnVpnAAAAKklEQVQI12NYBQQMDQxAACFCQxkYGsFEAAOMgIo5ALmsEALMBSmGaEMQAOO9EHd34ZsRAAAAAElFTkSuQmCC":
                    row[i] = "6"
                    break;
                default:
                    break;
            }
            i++
        }

        myBoard.forEach(row => {
            console.log(JSON.stringify(row));
        });

        check_tile(myBoard, board, page)



        // console.log(myBoard[1][1]);

        myBoard.forEach(row => {
            console.log(JSON.stringify(row));
        });
        console.log("----------------------------------------------------");
        myBoard = []
        i = 0
        row = []
        sleep(2000)
    }


    // sleep(700)
    // //On cree un objet Date
    // var d = new Date
    // //On prend un screenshot a la fin pour montrer qu'on a bien réussi et on lui donne les minutes actuels en tant que nom de fichier
    // await page.screenshot({path: d.getMinutes()+".png"})
    // //On ferme le navigateur et tout les onglets ouvert
    // browser.close();
})()

function check_tile(myBoard, board, page) {
    let nb = 0
    let nbRows = Object.keys(myBoard).length
    let coord = [0, 0]
    let hidden
    let i = 0
    for (let nb_row in myBoard) {
        for (let field of myBoard[parseInt(nb_row)]) {
            coord = [parseInt(nb_row), i]


            switch (field) {
                case "1":
                    hidden = find_hidden(myBoard, coord, 1, page)

                    if (Object.keys(hidden).length == 1) {
                        click_on_all(page, board, hidden)
                    }

                    break;
                case "2":
                    break;
                default:
                    break;
            }
            i++
        }
    }
}

// 2 8
// 1 2
async function click_on_all(page, board, coords) {

    let i = 0
    for (const coord of coords) {
        let tile_nb = coord[0] * 9 + coord[1]
        console.log(tile_nb);
        if (i == tile_nb) {
            try {
                // const preview_coordinates = await field.boundingBox()
                // await field.click({ button: 'left' });
                await page.click('#board img #tile' + tile_nb)
                console.log("Clicked on tile " + tile_nb);

            } catch (error) {
                console.log("Mouse click error : " + error);
            }
            i = 0
        }
        i++
    }
}

async function click_on(page, board, tile_coord){
    let tile_nb = tile_coord[0] * 9 + tile_coord[1]
    console.log(tile_nb);
    try {
        // const preview_coordinates = await field.boundingBox()
        // await field.click({ button: 'left' });
        await page.click('#board img #tile' + tile_nb)
        console.log("Clicked on tile " + tile_nb);

    } catch (error) {
        console.log("Mouse click error : " + error);
    }
}

function find_hidden(myBoard, coord, type, page) {
    let newCoord = []
    let coord_X = coord[0]
    let coord_Y = coord[1]
    let new_X, new_Y
    let nb_flags = 0
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            new_X = coord_X + x
            new_Y = coord_Y + y
            console.log(coord_X, coord_Y, new_X, coord_Y);
            if (!(new_X < 0 || new_Y < 0 || new_X > 64 || new_Y > 64 || myBoard[new_X][new_Y])) {   
                 
                console.log("x: ", x, "  y: ", y, " old coord: ", coord_X,coord_Y, "  boardV: ", myBoard[coord_X][coord_Y]);
                console.log("x: ", x, "  y: ", y, " new coord: ", new_X,new_Y, "  boardV: ", myBoard[new_X][new_Y]);
                console.log("nb flags: ", nb_flags);
                try {
                    if (myBoard[new_X][new_Y] == "F") {
                        nb_flags++
                        newCoord = [...newCoord, [new_X, new_Y]]
                    } else if (myBoard[new_X][new_Y] == ("0" || "O")) {
                        newCoord = [...newCoord, [new_X, new_Y]]
                    }
                } catch (error) {
                    console.log("Out of range");
                }
            }
            if (nb_flags == type) {
                click_on(page, myBoard, coord)
            }
        }
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