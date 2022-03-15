const puppeteer = require('puppeteer');

(async() => {
	console.log("hell");
	const browser = await puppeteer.launch({ //launch puppeteer
		headless: false,
		slowMo: 0,
	})
	const page = await browser.newPage(); //open the browser

	// await page.setViewport({ width: 1200, height: 720 });

	await page.goto('https://www.websudoku.com/');
	sleep(1000000)
})

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