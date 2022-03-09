const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({ //launch puppeteer
        headless: false,
        slowMo: 0,
    })
    const page = await browser.newPage(); //open the browser

    await page.setViewport({ width: 1200, height: 720 });

    await page.goto('https://demineur.eu/');
    sleep(1000)

    await page.click("#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-k8o10q")
    sleep(500)

    let myBoard = []

    let board = await page.$$('#board img')
    await page.click('#tile' + 1,{
        button: 'right',
      });
    


    // sleep(700)
    // //On cree un objet Date
    // var d = new Date
    // //On prend un screenshot a la fin pour montrer qu'on a bien réussi et on lui donne les minutes actuels en tant que nom de fichier
    // await page.screenshot({path: d.getMinutes()+".png"})
    // //On ferme le navigateur et tout les onglets ouvert
    // browser.close();
})()


async function click_on(page, board, tile_coord){
    console.log("click on ");
    let tile_nb = tile_coord[0] * 9 + tile_coord[1]
    console.log("click on tilenb: ",tile_nb);
    console.log('#board img #tile' + tile_nb);
    try {
        // const preview_coordinates = await field.boundingBox()
        // await field.click({ button: 'left' });
        console.log("Try Click on tile " + tile_nb);
        await page.click('#tile' + tile_nb,{
            button: 'right',
          });
        // await page.click('#tile' + tile_nb)
        console.log("Clicked on tile " + tile_nb);

    } catch (error) {
        console.log("Mouse click error : " + error);
    }
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