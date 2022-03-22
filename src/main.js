import puppeteer from 'puppeteer';

import { get_tile_type, check_tiles, get_tiles } from './tiles.js';
import { sleep, mouse_click, get_difficulty } from './utils.js';


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
    let row = []
    let board
    boardSize = await get_difficulty(page)
    // console.log(`Ready to play on a ${boardSize} board`);
    while (true) {

        boardSize = await get_difficulty(page)

        if (boardSize[0] != boardSize_old[0]) {
            console.log(`Ready to play on a ${boardSize} board`);
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

        click = check_tiles(myBoard, tiles, boardSize)

        let left_clicks = click[0]
        let right_clicks = click[1]

        if (left_clicks != []) {
            await mouse_click(page, left_clicks, 'left', boardSize)
        }
        if (right_clicks != []) {
            await mouse_click(page, right_clicks, 'right', boardSize)
        }

        // myBoard.forEach(row => {
        //     console.log(JSON.stringify(row));
        // });

        // console.log("----------------------------------------------------");
        myBoard = []
        i = 0
        row = []
    }

    // var d = new Date
    // await page.screenshot({path: d.getMinutes()+".png"})
    // browser.close();
})()