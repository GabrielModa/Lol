const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function fetchData(lane, championPool, tiersToFilter, winRateNumericThreshold) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const championData = []; // Array para armazenar os dados dos campeões

    try {
        console.log(`Acessando a página de estatísticas para a lane ${lane}...`);
        await page.goto(`https://lolalytics.com/lol/tierlist/?lane=${lane}&tier=diamond`);

        console.log('Aguardando o carregamento da página...');
        await page.waitForSelector('.flex');

        console.log('Rolando a página até o final...');
        while (true) {
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });
            await sleep(150);
            const isEndReached = await page.evaluate(() => {
                return window.scrollY + window.innerHeight >= document.body.scrollHeight;
            });
            if (isEndReached) {
                break;
            }
        }

        console.log('Aguardando a finalização do carregamento...');
        await page.waitForSelector('.flex:last-of-type');

        const htmlString = await page.content();
        championData.push(...processHTMLString(htmlString, lane, championPool, tiersToFilter, winRateNumericThreshold)); // Adiciona os dados processados ao array championData
    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
        return championData; // Retorna o array com os dados dos campeões
    }
}

function processHTMLString(htmlString, lane, championPool, tiersToFilter, winRateNumericThreshold) {
    const $ = cheerio.load(htmlString);
    const processedData = [];

    const winRateRegex = /(\d+(\.\d+)?)%?/;

    $('.flex').each((index, element) => {
        const championURL = $(element).find('div > div > a').attr('href');
        const championName = championURL ? championURL.split('/')[2] : '';
        const laneElement = $(element).find('div[class^="w-"] > img');
        const laneRate = laneElement.parent().text().trim();

        const winRate = $(element).find('div.my-auto.justify-center.flex').eq(4).text().trim();
        const tier = $(element).find('div.my-auto.justify-center.flex').eq(2).text().trim();
        const pickRate = $(element).find('div.my-auto.justify-center.flex').eq(5).text().trim();
        const banRate = $(element).find('div.my-auto.justify-center.flex').eq(6).text().trim();

        const winRateMatch = winRateRegex.exec(winRate);
        const winRateNumeric = winRateMatch ? parseFloat(winRateMatch[1]) : 0;

        if (championName && winRateNumeric && tier && pickRate && banRate) {
            if (championPool.includes(championName) && tierInThreshold(tier, tiersToFilter) && winRateNumeric >= winRateNumericThreshold) {
                processedData.push({
                    name: championName,
                    lane: lane + " " + laneRate,
                    winRate: winRateNumeric,
                    tier,
                    pickRate,
                    banRate
                });
            }
        }
    });

    return processedData;
}

function tierInThreshold(tier, tiersToFilter) {
    return tiersToFilter.includes(tier);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    fetchData,
    processHTMLString
};
