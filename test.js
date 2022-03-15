const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({ //launch puppeteer
        headless: false,
        slowMo: 0,
    })
    const page = await browser.newPage(); //open the browser

    await page.setViewport({ width: 1200, height: 720 });

    await page.goto('https://www.websudoku.com/');
    sleep(5000)

	//
    // await page.click('#onetrust-button-group > div > button')
    sleep(1000)
    let grid = await page.$('#puzzle_grid > tbody')
    let grid2
	await page.evaluate(() => {
		grid2 = document.querySelector('#puzzle_grid > tbody')
	})

    let myBoard = []

    console.log(grid);
    console.log(grid2);

    // grid.forEach(row => {
    //     console.log(row);
    //     myBoard.push(row)
    // })

    // console.log(myBoard);


    //document.querySelector("#puzzle_grid > tbody > tr:nth-child(5)")




})()

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