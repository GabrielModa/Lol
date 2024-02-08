const puppeteer = require('puppeteer');
const mysql = require('mysql');

async function fetchData() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const championData = []; // Array para armazenar os dados dos campeões

    try {
        const lane = 'middle'; // Defina a lane desejada
        const championPools = {
            middle: ['anivia', 'Anivia', 'Annie', 'Cassiopeia', 'Syndra', 'Viktor', 'Vex', 'Lux', 'Malzahar', 'Malphite', 'Kled', 'Orianna', 'Ekko', 'Cho`Gath', 'Kassadin', 'Sylas', 'Azir', 'Smolder', 'smolder'],// Adicione os campeões para a lane "middle"
            top: ['Cassiopeia', 'Ornn', 'Maokai', 'Kled', 'Malphite', 'Irelia', 'Cho`Gath', 'Gwen', 'Mordekaiser', 'Shen', 'Singed', 'Anivia', 'Garen', 'Nasus', 'Wukong', 'Volibear'], // Adicione os campeões para a lane "top"
            jungle: ['Jarvan IV', 'Kayn', , 'kayn', 'Karthus', 'Maokai', 'Ekko', 'Warwick', 'Nocturne', 'Vi', 'Volibear'], // Adicione os campeões para a lane "jungle"
            bottom: ['Karthus', 'Cassiopeia', 'Jhin', 'Ashe', 'Miss Fortune', 'Swain', 'Jinx', 'Syndra', 'Kog`Maw', 'Tristana', 'Caitlyn', 'Lucian'], // Adicione os campeões para a lane "bottom"
            support: ['Janna', 'Soraka', 'Annie', 'Zilean', 'Maokai', 'Lux', 'Leona', 'Orianna'] // Adicione os campeões para a lane "support"
        };

        const championPool = championPools[lane];

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
        championData.push(...processHTMLString(htmlString, lane, championPool)); // Adiciona os dados processados ao array championData
    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
        return championData; // Retorna o array com os dados dos campeões
    }
}

function processHTMLString(htmlString, lane, championPool) {
    const cheerio = require('cheerio');
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
            if (championPool.includes(championName) && tierInThreshold(tier) && winRateNumeric >= 40) {
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

function tierInThreshold(tier) {
    const tiersToFilter = ['S', 'S+', 'S-', 'A+', 'A', 'A-', 'D-'];
    return tiersToFilter.includes(tier);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function insertDataIntoDB(data) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'S@gu1204',
        database: 'league_of_legends'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            return;
        }
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
    });

    const values = data.map(champion => [champion.name, champion.lane, champion.winRate.toFixed(2), champion.tier, champion.pickRate, champion.banRate]);

    const sql = `INSERT INTO champions (name, lane, win_rate, tier, pick_rate, ban_rate) VALUES ?`;

    connection.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return;
        }
        console.log('Dados inseridos no banco de dados.');
    });

    connection.end();
}

async function main() {
    const championData = await fetchData();
    console.log('Dados processados:');
    console.log(championData);
    console.log('Conectando ao banco de dados...');
    await insertDataIntoDB(championData);
}

main();
