const axios = require('axios');
const cheerio = require('cheerio');

async function fetchData() {
    try {
        const response = await axios.get('https://lolalytics.com/lol/tierlist/?lane=middle&tier=diamond');
        const htmlString = response.data;
        processHTMLString(htmlString);
    } catch (error) {
        console.error(error);
    }
}

function processHTMLString(htmlString) {
    const $ = cheerio.load(htmlString);

    $('.flex').each((index, element) => {
        const championURL = $(element).find('div > div > a').attr('href');
        if (championURL && championURL.includes('lol/taliyah/build/?lane=middle&tier=diamond')) {
            const championName = championURL.split('/')[2]; // Extrai dinamicamente o nome do campeão da URL
            const laneElement = $(element).find('div[class^="w-"] > img'); // Seleciona o elemento da lane
            const lane = laneElement.attr('alt'); // Extrai o atributo 'alt' do elemento da lane
            const laneRate = $(element).find('div[class^="w-"] > img').parent().text().trim(); // Extrai a taxa de lane do elemento pai do elemento da lane

            const winRate = $(element).find('div.my-auto.justify-center.flex').eq(4).text().trim();
            const tier = $(element).find('div.my-auto.justify-center.flex').eq(2).text().trim();
            const pickRate = $(element).find('div.my-auto.justify-center.flex').eq(5).text().trim(); // Extrai a pick rate corretamente
            const banRate = $(element).find('div.my-auto.justify-center.flex').eq(6).text().trim(); // Extrai a ban rate corretamente

            console.log("Name:", championName);
            console.log("Lane:", lane + " " + laneRate);
            console.log("Win:", winRate);
            console.log("Tier:", tier);
            console.log("Pick:", pickRate);
            console.log("Ban:", banRate);
        }
    });
}

fetchData();
