const puppeteer = require('puppeteer');



(async () => {
    const browser = await puppeteer.launch({    //launch puppeteer
        headless: false,
        slowMo: 0,
    })
    const page = await browser.newPage();       //open the browser

    await page.setViewport({ width: 1200, height: 720 });

    await page.goto('https://demineur.eu/');
    sleep(2000)

    await page.click("#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-k8o10q")
    sleep(1000)

    let myBoard = []

    let board = await page.$$('#board img')
    // console.log(board.length)
    let i = 0
    let row = ['0','0','0','0','0','0','0','0','0',]
    for (const el of board) {
        // let img = await el.$('img'); //Get the link to the product page
        let url = await page.evaluate(li => li.getAttribute('src'), el) //get the url for the full res img (url stored in the attribute 'data-old-hires') 
        console.log(url);
        if (i == 8) {
            myBoard = row;
            i = 0
        } else {
            switch (url) {
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb3///97e3uVBMaVAAAAHklEQVQI12MIDQ0NARFBDAEMDFzkEl6rVq1i0AISAIlSC03msuDYAAAAAElFTkSuQmCC":
                    row[i] = "0"
                    break;
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AAP97e3u7pKrVAAAAJUlEQVQI12NYBQQMDQxAACUCgAQjiGAFEaIQLiYhGgojEHqBGAB4Gw2cMF3q+AAAAABJRU5ErkJggg==":
                    row[i] = "1"
                    break;       
                case "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEW9vb0AewB7e3vro336AAAANUlEQVQI12NYBQQMDQxAACFCQxkYGkNDHRgaA1gdgGJgIhQowRoCknUAygIZYCVgAqwNQQAA1rsQB7h1rwIAAAAASUVORK5CYII=":
                    row[i] = "2"
                    break;    
                default:
                    break;
            }
            i++
        }
    }

    


    // let res = 0;
    // for (let index = 0; index < 20; index++) {
    //     //On recupere la "valeur" 
    //     var value = await page.$eval('html body center div.container h1.question', ele => ele.textContent);
    //     //On prend la string et on la split au niveau des espaces = " "  Ex : "5 + 4" --->  ['5','+','4']
    //     var listEntier = value.split(" ")
    //     //On assigne la valeur de l'element 0 de listeEntier a entier1 
    //     var entier1 = parseInt(listEntier[0])
    //     //On assigne la valeur de l'element 2 de listeEntier a entier2, c'est le deuxieme vue qu'on a le plus a l'element 1
    //     var entier2 = parseInt(listEntier[2])

    //     //On ragrde quel type de calcul on doit faire 
    //     switch (listEntier[1]) {
    //         case "+":
    //             res = entier1 + entier2
    //             break;
    //         case "-":
    //             res = entier1 - entier2
    //             break;
    //         case "x":
    //             res = entier1 * entier2
    //             break;
    //         case "/":
    //             res = entier1 / entier2
    //             break;
    //     }

    //     //Print le calcul avec le resultat
    //     console.log(entier1 + " " + listEntier[1] + " " + entier2 + " = " + res);

    //     //On ecrit le resultat dans la case de texte ayant l'ID #attempt
    //     await page.type('#attempt', res.toString())
    //     //On appuie sur la touche Entrer du clavier
    //     await page.keyboard.press('Enter');
    //     sleep(10)
    // }

    // sleep(700)
    // //On cree un objet Date
    // var d = new Date
    // //On prend un screenshot a la fin pour montrer qu'on a bien réussi et on lui donne les minutes actuels en tant que nom de fichier
    // await page.screenshot({path: d.getMinutes()+".png"})
    // //On ferme le navigateur et tout les onglets ouvert
    // browser.close();
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