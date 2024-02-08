const db = require('../config/dbConfig');

class Champion {
    static insert(champion) {
        const sql = `INSERT INTO champions (name, lane, win_rate, tier, pick_rate, ban_rate) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [champion.name, champion.lane, champion.winRate.toFixed(2), champion.tier, champion.pickRate, champion.banRate];

        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
}

module.exports = Champion;
