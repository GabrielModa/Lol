const { fetchData, processHTMLString } = require('../utils/puppeteerUtils');
const Champion = require('../models/Champion');

async function fetchAndSaveChampions(req, res, next) {
    try {
        // Validar a existência e integridade dos dados da requisição
        const { lane, selectedChampions, tierList, winRateNumericThreshold } = req.body;
        console.log('Dados recebidos na requisição:', { lane, selectedChampions, tierList, winRateNumericThreshold }); // Adicionando um log aqui

        if (!lane || !selectedChampions || !Array.isArray(selectedChampions) || !tierList || !winRateNumericThreshold) {
            return res.status(400).json({ error: 'Dados de requisição inválidos.' });
        }

        // Formatando os nomes dos campeões
        const formattedSelectedChampions = selectedChampions.map(name => name.replace(/\s+/g, ''));

        // Buscar dados dos campeões e inserir no banco de dados
        const championData = await fetchData(lane, formattedSelectedChampions, tierList, winRateNumericThreshold);
        console.log('Dados processados:', championData);

        console.log('Inserindo dados no banco de dados...');
        const insertedChampions = [];
        for (const champion of championData) {
            try {
                await Champion.insert(champion);
                console.log('Campeão inserido:', champion);
                insertedChampions.push(champion);
            } catch (error) {
                console.error('Erro ao inserir campeão:', error);
                // Retornar um erro interno do servidor
                return res.status(500).json({ error: 'Erro ao inserir campeão.' });
            }
        }

        console.log('Dados inseridos no banco de dados com sucesso!');
        // Retornar os campeões inseridos com sucesso
        res.status(200).json({ champions: insertedChampions });
    } catch (error) {
        console.error('Erro ao inserir campeões:', error);
        // Repassar o erro para o próximo middleware de tratamento de erros
        next(error);
    }
}


module.exports = {
    fetchAndSaveChampions
};
