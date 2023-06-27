const puppeteer = require('puppeteer');

const championName = 'Malzahar';
const championNameLowercase = championName.toLowerCase();
const selectedButton = 'Weak Against'; // Escolha entre 'Strong Against', 'Weak Against', 'Good Synergy' ou 'Bad Synergy'
const positionNames = ['TOP', 'JG', 'MID', 'ADC', 'SUP'];
let currentPositionIndex = 0;

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(`https://lolalytics.com/lol/${championNameLowercase}/build/`);

        await page.waitForSelector('.Panel_data__dtE8F');

        const counterButtonsContainer = await page.$('.CounterButtons_set__99iaF');

        if (counterButtonsContainer) {
            const selectedButtonSelector = await page.evaluate(
                (container, buttonName) => {
                    const buttonSet = container.querySelector('.ButtonSet_wrapper__33xGK');
                    const buttons = Array.from(buttonSet.children);
                    const selectedButtonIndex = buttons.findIndex(button => button.innerText === buttonName);
                    if (selectedButtonIndex !== -1) {
                        const selectedButton = buttons[selectedButtonIndex];
                        return `[data-id="${selectedButtonIndex}"]`;
                    }
                    return null;
                },
                counterButtonsContainer,
                selectedButton
            );

            if (selectedButtonSelector) {
                const selectedButtonElement = await page.$(`.CounterButtons_set__99iaF .ButtonSet_wrapper__33xGK ${selectedButtonSelector}`);
                await selectedButtonElement.click();
                console.log(`Botão "${selectedButton}" clicado com sucesso.`);

                // Aguardar um atraso de 2 segundos para permitir a atualização do conteúdo
                await page.waitForTimeout(2000);

                // Pegar os counters por cada lane
                let counters = [];
                let seenCounters = {};

                const panelDataElements = await page.$$('.Panel_data__dtE8F');

                for (const panelDataElement of panelDataElements) {
                    let scrollCounters = [];

                    while (true) {
                        const counterElements = await panelDataElement.$$('.CountersPanel_counters__U8zc5 .Cell_cell__383UV');

                        for (let i = 0; i < counterElements.length; i++) {
                            const counterElement = counterElements[i];
                            const championNameElement = await counterElement.$('img');
                            const winRateElement = await counterElement.$('.Cell_cell__383UV > div:nth-child(2)');
                            const delta1Element = await counterElement.$('.Cell_cell__383UV > div:nth-child(3)');
                            const delta2Element = await counterElement.$('.Cell_cell__383UV > div:nth-child(4)');
                            const pickRateElement = await counterElement.$('.Cell_cell__383UV > div:nth-child(5)');
                            const gamesElement = await counterElement.$('.Cell_cell__383UV > div:nth-child(6)');

                            const championName = championNameElement ? await (await championNameElement.getProperty('alt')).jsonValue() : null;
                            const winRate = winRateElement ? `${await (await winRateElement.getProperty('textContent')).jsonValue()} %` : null;
                            const delta1 = delta1Element ? `${await (await delta1Element.getProperty('textContent')).jsonValue()} %` : null;
                            const delta2 = delta2Element ? `${await (await delta2Element.getProperty('textContent')).jsonValue()} %` : null;
                            const pickRate = pickRateElement ? `${await (await pickRateElement.getProperty('textContent')).jsonValue()} %` : null;
                            const games = gamesElement ? await (await gamesElement.getProperty('textContent')).jsonValue() : null;

                            // Verificar se o contador já foi registrado anteriormente com base nas mesmas propriedades
                            const isDuplicate = seenCounters[`${championName}_${winRate}_${delta1}_${delta2}_${pickRate}_${games}`];
                            if (!isDuplicate) {
                                counters.push({
                                    championName,
                                    winRate,
                                    delta1,
                                    delta2,
                                    pickRate,
                                    games
                                });
                                seenCounters[`${championName}_${winRate}_${delta1}_${delta2}_${pickRate}_${games}`] = true;
                            }
                        }

                        const panelWidth = await panelDataElement.evaluate(element => element.scrollWidth);
                        const viewportWidth = await page.viewport().width;

                        if (await panelDataElement.evaluate(element => element.scrollLeft + element.clientWidth >= element.scrollWidth)) {
                            break; // Sai do loop quando atingir o final do scroll
                        }

                        await panelDataElement.evaluate((element, vw) => {
                            element.scrollBy(vw, 0); // Movimentar o scroll para a direita para carregar mais elementos
                        }, viewportWidth);

                        // Aguardar um atraso de 2 segundos para permitir a atualização do conteúdo
                        await page.waitForTimeout(2000);
                    }

                    scrollCounters.push(...counters);
                    counters = [];

                    if (scrollCounters.length > 0) {
                        console.log(`Total de counters no Scroll (${getNextPositionName()}):`, scrollCounters.length);
                        console.table(scrollCounters);
                        console.log('-----------------------');
                    }
                }

            } else {
                console.log(`Botão "${selectedButton}" não encontrado.`);
            }
        } else {
            console.log('Container dos botões de contador não encontrado.');
        }

        await browser.close();
    } catch (error) {
        console.error('Ocorreu um erro:', error);
    }
})();

function getNextPositionName() {
    const positionName = positionNames[currentPositionIndex];
    currentPositionIndex = (currentPositionIndex + 1) % positionNames.length;
    return positionName;
}
