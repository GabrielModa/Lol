const { fetchData } = require('../utils/puppeteerUtils');
const Champion = require('../models/Champion');

async function fetchAndSaveChampions(req, res, next) {
    try {
        const lane = req.body.lane;
        const selectedChampions = req.body.selectedChampions;
        const championData = await fetchData(lane, selectedChampions);
        console.log('Dados processados:');
        console.log(championData);
        console.log('Inserindo dados no banco de dados...');
        const insertedChampions = [];
        for (const champion of championData) {
            try {
                await Champion.insert(champion); // Alterado de Champion.create para Champion.insert
                console.log('Campeão inserido:', champion);
                insertedChampions.push(champion);
            } catch (error) {
                console.error('Erro ao inserir campeão:', error);
            }
        }
        console.log('Dados inseridos no banco de dados com sucesso!');
        res.status(200).json({ champions: insertedChampions });
    } catch (error) {
        console.error('Erro ao inserir campeões:', error);
        next(error);
    }
}

module.exports = {
    fetchAndSaveChampions
};
