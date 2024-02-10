import React, { useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    TextField,
    Button
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import './ChampionsPage.css';

const ChampionsPage = () => {
    const [lane, setLane] = useState('middle');
    const [selectedChampions, setSelectedChampions] = useState([
        'anivia', 'annie', 'cassiopeia', 'syndra', 'viktor', 'vex', 'lux', 'malzahar', 'malphite', 'kled', 'orianna', 'ekko', 'cho`gath', 'kassadin', 'sylas', 'azir',
        'ornn', 'maokai', 'kled', 'malphite', 'irelia', 'cho`gath', 'gwen', 'mordekaiser', 'shen', 'singed', 'anivia', 'garen', 'nasus', 'wukong', 'volibear',
        'jarvaniv', 'kayn', 'karthus', 'maokai', 'ekko', 'warwick', 'nocturne', 'vi', 'volibear',
        'karthus', 'cassiopeia', 'jhin', 'ashe', 'missfortune', 'swain', 'jinx', 'syndra', 'kog`maw', 'tristana', 'caitlyn', 'lucian',
        'janna', 'soraka', 'annie', 'zilean', 'maokai', 'lux', 'leona', 'orianna'
    ]);
    const [tierList, setTierList] = useState(["S+", "S", "S-", "A+", "A", "A-"]);
    const [selectedTiers, setSelectedTiers] = useState(tierList); // Ajuste aqui
    const [winRateNumericThreshold, setWinRateNumericThreshold] = useState(51);
    const [insertedChampions, setInsertedChampions] = useState([]);
    const [sortBy, setSortBy] = useState({ column: null, direction: 'asc' });
    // eslint-disable-next-line
    const [selectedChampionNames, setSelectedChampionNames] = useState([]);

    const championNames = [
        "Aatrox", "Ahri", "Akali", "Akshan", "Alistar", "Amumu", "Anivia", "Annie", "Aphelios", "Ashe",
        "Aurelion Sol", "Azir", "Bardo", "Bel'Veth", "Blitzcrank", "Brand", "Braum", "Briar", "Caitlyn",
        "Camille", "Cassiopeia", "Cho'Gath", "Corki", "Darius", "Diana", "Dr. Mundo", "Draven", "Ekko",
        "Elise", "Evelynn", "Ezreal", "Fiddlesticks", "Fiora", "Fizz", "Galio", "Gangplank", "Garen",
        "Gnar", "Gragas", "Graves", "Gwen", "Hecarim", "Heimerdinger", "Illaoi", "Irelia", "Ivern",
        "Janna", "Jarvan IV", "Jax", "Jayce", "Jhin", "Jinx", "K'Sante", "Kai'Sa", "Kalista", "Karma",
        "Karthus", "Kassadin", "Katarina", "Kayle", "Kayn", "Kennen", "Kha'Zix", "Kindred", "Kled",
        "Kog'Maw", "LeBlanc", "Lee Sin", "Leona", "Lillia", "Lissandra", "Lucian", "Lulu", "Lux", "Malphite",
        "Malzahar", "Maokai", "Master Yi", "Milio", "Miss Fortune", "Mordekaiser", "Morgana", "Naafiri",
        "Nami", "Nasus", "Nautilus", "Neeko", "Nidalee", "Nilah", "Nocturne", "Nunu e Willump", "Olaf",
        "Orianna", "Ornn", "Pantheon", "Poppy", "Pyke", "Qiyana", "Quinn", "Rakan", "Rammus", "Rek'Sai",
        "Rell", "Renata Glasc", "Renekton", "Rengar", "Riven", "Rumble", "Ryze", "Samira", "Sejuani", "Senna",
        "Seraphine", "Sett", "Shaco", "Shen", "Shyvana", "Singed", "Sion", "Sivir", "Skarner", "Sona", "Smolder", "Soraka",
        "Swain", "Sylas", "Syndra", "Tahm Kench", "Taliyah", "Talon", "Taric", "Teemo", "Thresh", "Tristana",
        "Trundle", "Tryndamere", "Twisted Fate", "Twitch", "Udyr", "Urgot", "Varus", "Vayne", "Veigar", "Vel'Koz",
        "Vex", "Vi", "Viego", "Viktor", "Vladimir", "Volibear", "Warwick", "Wukong", "Xayah", "Xerath", "Xin Zhao",
        "Yasuo", "Yone", "Yorick", "Yuumi", "Zac", "Zed", "Zeri", "Ziggs", "Zilean", "Zoe", "Zyra"
    ];

    const laneOptions = ["middle", "support", "bottom", "jungle", "top"];
    const tierListOptions = [
        "S+", "S", "S-", "A+", "A", "A-",
        "B+", "B", "B-", "C+", "C", "C-",
        "D+", "D", "D-"
    ];

    const formatChampionNames = (names) => {
        return names.map(name => name.toLowerCase().replace(/\s+/g, ''));
    };

    const handleSort = (column) => {
        setSortBy(prevSort => ({
            column,
            direction: prevSort.column === column && prevSort.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortChampions = (champions, column, direction) => {
        if (!column) return champions;

        const sortedChampions = [...champions];
        sortedChampions.sort((a, b) => {
            if (column === 'tier') {
                const tierOrder = ["S+", "S", "S-", "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-"];
                return direction === 'asc' ? tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier) : tierOrder.indexOf(b.tier) - tierOrder.indexOf(a.tier);
            } else {
                return direction === 'asc' ? a[column] > b[column] ? 1 : -1 : a[column] < b[column] ? 1 : -1;
            }
        });

        return sortedChampions;
    };

    const handleSelectAllChampions = () => {
        const formattedChampionNames = formatChampionNames(championNames);
        setSelectedChampions(formattedChampionNames);
        setSelectedChampionNames(championNames);
    };

    const handleClearAllChampions = () => {
        setSelectedChampions([]);
        setSelectedChampionNames([]);
    };

    const handleSelectAllTiers = () => {
        setSelectedTiers(tierListOptions);
        setTierList(tierListOptions);
    };

    const handleClearAllTiers = () => {
        setSelectedTiers([]);
        setTierList([]);
    };

    const handleChangeLane = (event, value) => setLane(value);

    const handleChangeSelectedChampions = (event, value) => {
        setSelectedChampions(value || []);
        setSelectedChampionNames(value.map(name => name.toLowerCase().replace(/\s+/g, '')) || []);
    };

    const handleChangeTiers = (event, value) => {
        setSelectedTiers(value || []);
        setTierList(value || []);
    };
    const handleChangeWinRateNumericThreshold = (event) => setWinRateNumericThreshold(event.target.value);

    const handleSaveSelectedChampions = async () => {
        try {
            console.log('Saving selected champions:', { lane, selectedChampions, tierList, winRateNumericThreshold });
            if (selectedChampions.length > 0) {
                const response = await axios.post('http://localhost:3001/selected-champions', { lane, selectedChampions, tierList, winRateNumericThreshold });
                console.log('Selected champions saved successfully!');
                setInsertedChampions(response.data.champions);
            } else {
                console.log('No champions selected to save.');
            }
        } catch (error) {
            console.error('Error saving selected champions:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: '#FFA500', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>League of Legends Champion Statistics</h1>
            <FormControl fullWidth style={{ marginBottom: '10px' }}>
                <Autocomplete
                    id="lane-select"
                    options={laneOptions}
                    value={lane}
                    onChange={handleChangeLane}
                    renderInput={(params) => <TextField {...params} label="Select Lane" />}
                />
            </FormControl>
            <TextField
                fullWidth
                type="number"
                id="winRateNumericThreshold"
                label="Win Rate Threshold (%)"
                value={winRateNumericThreshold}
                onChange={handleChangeWinRateNumericThreshold}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
                className="win-rate-input" // Adiciona a classe para aplicar o padding
                style={{ marginBottom: '10px' }}
            />
            <div className="container">
                <FormControl fullWidth className="select-container">
                    <Autocomplete
                        className=''
                        multiple
                        id="champion-select"
                        options={formatChampionNames(championNames)}
                        value={selectedChampions}
                        onChange={handleChangeSelectedChampions}
                        renderInput={(params) => (
                            <div > {/* Defina o tamanho máximo e adicione o scroll */}
                                <TextField  {...params} label="Select Champions" />

                                <div className="button-container">
                                    <Button variant="outlined" onClick={handleSelectAllChampions}>Select All</Button>
                                    <Button variant="outlined" onClick={handleClearAllChampions}>Clear All</Button>
                                </div>
                            </div>
                        )}
                    />
                </FormControl>
                <FormControl fullWidth className="select-container">
                    <Autocomplete
                        className=''
                        multiple
                        id="tiers-select"
                        options={tierListOptions}
                        value={selectedTiers}
                        onChange={handleChangeTiers}
                        renderInput={(params) => (
                            <div>
                                <TextField  {...params} label="Select Tiers" />

                                <div className="button-container">
                                    <Button variant="outlined" onClick={handleSelectAllTiers}>Select All</Button>
                                    <Button variant="outlined" onClick={handleClearAllTiers}>Clear All</Button>
                                </div>
                            </div>
                        )}
                    />
                </FormControl>
            <Button variant="contained" onClick={handleSaveSelectedChampions} style={{ backgroundColor: '#FFA500', color: '#fff' }}>Save Selected Champions</Button>
            </div>
            {insertedChampions.length > 0 && (
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell onClick={() => handleSort('name')}>Name</TableCell>
                                <TableCell onClick={() => handleSort('lane')}>Lane</TableCell>
                                <TableCell onClick={() => handleSort('winRate')}>Win Rate</TableCell>
                                <TableCell onClick={() => handleSort('tier')}>Tier</TableCell>
                                <TableCell onClick={() => handleSort('pickRate')}>Pick Rate</TableCell>
                                <TableCell onClick={() => handleSort('banRate')}>Ban Rate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortChampions(insertedChampions, sortBy.column, sortBy.direction).map((champion, index) => (
                                <TableRow key={index}>
                                    <TableCell className="champion-cell">
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <img src={`https://cdn5.lolalytics.com/champx46/${champion.name}.webp`} alt={champion.name} style={{ width: '50px', marginBottom: '5px' }} />
                                            <span style={{ textAlign: 'center', fontSize: '14px' }}>{champion.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="lane-cell">
                                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                            <img src={`https://cdn5.lolalytics.com/lane54/${champion.lane.split(' ')[0]}.webp`} alt={champion.lane} style={{ width: '30px', marginRight: '5px' }} />
                                            <span>{champion.lane.split(' ')[1]}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{champion.winRate}</TableCell>
                                    <TableCell>{champion.tier}</TableCell>
                                    <TableCell>{champion.pickRate}%</TableCell>
                                    <TableCell>{champion.banRate}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default ChampionsPage;
