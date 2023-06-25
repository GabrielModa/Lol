const puppeteer = require('puppeteer');

const lane = 'middle';
const championPool = ['Anivia', 'Annie', 'Cassiopeia', 'Syndra', 'Viktor', 'Vex', 'Lux', 'Malzahar', 'Malphite', 'Kled', 'Orianna', 'Ekko', 'Cho`Gath', 'Kassadin', 'Sylas', 'Azir'];
const winRateThreshold = 51; // Taxa de vitória mínima desejada
const tiersToFilter = ['S', 'S+', 'S-', 'A+', 'A']; // Tiers para filtrar
const pickRateThreshold = 2; // Taxa de escolha mínima desejada (em %)
// const banRateThreshold = 10; // Taxa de banimento mínima desejada (em %)

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(`https://lolalytics.com/lol/tierlist/?lane=${lane}`);

    await page.waitForTimeout(2000);

    // Aguarda a div principal que contém as linhas de campeões
    await page.waitForSelector('.TierList_list__j33gd');

    // Obter todas as linhas de campeões
    const championRows = await page.$$('.ListRow_name__b5btO a');

    // Filtrar campeões ocultos e obter a numeração original
    const filteredChampionRows = [];
    const championIndices = [];
    for (let i = 0; i < championRows.length; i++) {
        const championRow = championRows[i];
        const championName = await page.evaluate((row) => row.textContent, championRow);

        if (championPool.includes(championName)) {
            filteredChampionRows.push(championRow);
            championIndices.push(i);
        };
    };

    // Iterar sobre a lista de campeões filtrada
    for (let i = 0; i < filteredChampionRows.length; i++) {
        const championRow = filteredChampionRows[i];
        const championName = await page.evaluate((row) => row.textContent, championRow);

        // Obter as informações da linha do campeão
        const championInfo = await page.evaluate((row, index) => {
            const rowElements = Array.from(row.parentElement.parentElement.querySelectorAll('.ListRow_name__b5btO ~ *'), el => el.textContent.trim());
            const tier = rowElements[0];
            const winRate = parseFloat(rowElements[2].split('+')[0]);
            const pickRate = parseFloat(rowElements[3]);
            const banRate = parseFloat(rowElements[4]);

            return {
                rank: index + 1,
                tier,
                winRate,
                pickRate,
                banRate,
            };
        }, championRow, championIndices[i]);

        // Verifica se os filtros estão definidos
        const isWinRateFiltered = typeof winRateThreshold !== 'undefined';
        const isTiersFiltered = typeof tiersToFilter !== 'undefined' && tiersToFilter.length > 0;
        const isPickRateFiltered = typeof pickRateThreshold !== 'undefined';
        const isBanRateFiltered = typeof banRateThreshold !== 'undefined';

        // Aplica os filtros se estiverem definidos ou exibe todas as informações se não estiverem definidos
        if ((!isWinRateFiltered || championInfo.winRate >= winRateThreshold) &&
            (!isTiersFiltered || tiersToFilter.includes(championInfo.tier)) &&
            (!isPickRateFiltered || championInfo.pickRate >= pickRateThreshold) &&
            (!isBanRateFiltered || championInfo.banRate >= banRateThreshold)) {
            console.log(`Informações de ${championName}:`, championInfo);
        };
    };

    await browser.close();
})();
