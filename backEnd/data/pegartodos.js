const puppeteer = require('puppeteer');

async function fetchData() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('https://lolalytics.com/lol/tierlist/?lane=middle&tier=diamond');

    // Aguarda até que o seletor .flex seja carregado na página
    await page.waitForSelector('.flex');

    // Loop para rolar a página até o final
    while (true) {
      // Rola para o final da página
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });

      // Aguarda um curto período de tempo
      await sleep(100);

      // Verifica se chegou ao final da página
      const isEndReached = await page.evaluate(() => {
        return window.scrollY + window.innerHeight >= document.body.scrollHeight;
      });

      if (isEndReached) {
        break;
      }
    }

    // Aguarda até que todos os elementos .flex estejam presentes na página
    await page.waitForSelector('.flex:last-of-type');

    const htmlString = await page.content();
    processHTMLString(htmlString);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
}

function processHTMLString(htmlString) {
  const cheerio = require('cheerio');
  const $ = cheerio.load(htmlString);

  $('.flex').each((index, element) => {
    const championURL = $(element).find('div > div > a').attr('href');
    const championName = championURL ? championURL.split('/')[2] : ''; // Extrai dinamicamente o nome do campeão da URL
    const laneElement = $(element).find('div[class^="w-"] > img'); // Seleciona o elemento da lane
    const lane = laneElement.attr('alt'); // Extrai o atributo 'alt' do elemento da lane
    const laneRate = $(element).find('div[class^="w-"] > img').parent().text().trim(); // Extrai a taxa de lane do elemento pai do elemento da lane

    const winRate = $(element).find('div.my-auto.justify-center.flex').eq(4).text().trim();
    const tier = $(element).find('div.my-auto.justify-center.flex').eq(2).text().trim();
    const pickRate = $(element).find('div.my-auto.justify-center.flex').eq(5).text().trim(); // Extrai a pick rate corretamente
    const banRate = $(element).find('div.my-auto.justify-center.flex').eq(6).text().trim(); // Extrai a ban rate corretamente

    // Verifica se todas as informações estão disponíveis
    if (championName && lane && winRate && tier && pickRate && banRate) {
      console.log("-----");
      console.log("Name:", championName);
      console.log("Lane:", lane + " " + laneRate);
      console.log("Win:", winRate);
      console.log("Tier:", tier);
      console.log("Pick:", pickRate);
      console.log("Ban:", banRate);
    }
  });
}

// Função para aguardar um curto período de tempo
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

fetchData();
