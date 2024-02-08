const db = require('../config/dbConfig');

class Champion {
    static insert(champion) {
        const { name, lane, winRate, tier, pickRate, banRate } = champion;

        // Validar os dados de entrada
        if (!name || !lane || !winRate || !tier || !pickRate || !banRate) {
            return Promise.reject(new Error('Todos os campos do campeão são obrigatórios.'));
        }

        const sql = `INSERT INTO champions (name, lane, win_rate, tier, pick_rate, ban_rate) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [name, lane, winRate.toFixed(2), tier, pickRate, banRate];

        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error('Erro ao inserir campeão no banco de dados:', err);
                    reject(new Error('Erro ao inserir campeão.'));
                    return;
                }
                resolve(result);
            });
        });
    }
}

module.exports = Champion;
