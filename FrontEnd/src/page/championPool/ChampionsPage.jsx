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

// Lista de campeões
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

// Opções para o campo de tier list
const tierListOptions = [
    "S+", "S", "S-", "A+", "A", "A-",
    "B+", "B", "B-", "C+", "C", "C-",
    "D+", "D", "D-"
];

// Lista de opções de lane
const laneOptions = ["middle", "support", "bottom", "jungle", "top"];

// Função para formatar os nomes de campeões
const formatChampionNames = (names) => {
    return names.map(name => name.toLowerCase().replace(/\s+/g, ''));
};

const ChampionsPage = () => {
    // Estados
    const [lane, setLane] = useState('middle');
    const [selectedChampions, setSelectedChampions] = useState(['anivia', 'annie', 'cassiopeia', 'syndra', 'viktor', 'vex', 'lux', 'malzahar', 'malphite', 'kled', 'orianna', 'ekko', 'cho`gath', 'kassadin', 'sylas', 'azir',
        'ornn', 'maokai', 'kled', 'malphite', 'irelia', 'cho`gath', 'gwen', 'mordekaiser', 'shen', 'singed', 'anivia', 'garen', 'nasus', 'wukong', 'volibear',
        'jarvaniv', 'kayn', 'karthus', 'maokai', 'ekko', 'warwick', 'nocturne', 'vi', 'volibear',
        'karthus', 'cassiopeia', 'jhin', 'ashe', 'missfortune', 'swain', 'jinx', 'syndra', 'kog`maw', 'tristana', 'caitlyn', 'lucian',
        'janna', 'soraka', 'annie', 'zilean', 'maokai', 'lux', 'leona', 'orianna'
    ]);
    const [tierList, setTierList] = useState(["S+", "S", "S-", "A+", "A", "A-"]);
    const [winRateNumericThreshold, setWinRateNumericThreshold] = useState(51);
    const [insertedChampions, setInsertedChampions] = useState([]);

    // Manipuladores de eventos
    const handleChangeLane = (event, value) => setLane(value); // Atualize o estado da lane quando uma opção for selecionada
    const handleChangeSelectedChampions = (event, value) => setSelectedChampions(value || []);
    const handleChangeTiers = (event, value) => setTierList(value || []);
    const handleChangeWinRateNumericThreshold = (event) => setWinRateNumericThreshold(event.target.value);

    const handleSaveSelectedChampions = async () => {
        try {
            console.log('Saving selected champions:', { lane, selectedChampions, tierList, winRateNumericThreshold });
            if (selectedChampions.length > 0) {
                const response = await axios.post('http://localhost:3001/selected-champions', { lane, selectedChampions, tierList, winRateNumericThreshold });
                console.log('Selected champions saved successfully!');
                setInsertedChampions(response.data.champions); // Atualiza a lista de campeões inseridos
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

            <FormControl fullWidth style={{ marginBottom: '10px' }}>
                <Autocomplete
                    multiple
                    id="champion-select"
                    options={formatChampionNames(championNames)}
                    getOptionLabel={(option) => option}
                    onChange={handleChangeSelectedChampions}
                    renderInput={(params) => <TextField {...params} label="Select Champions" />}
                />
            </FormControl>

            <FormControl fullWidth style={{ marginBottom: '10px' }}>
                <Autocomplete
                    multiple
                    id="tiers-select"
                    options={tierListOptions}
                    value={tierList}
                    onChange={handleChangeTiers}
                    renderInput={(params) => <TextField {...params} label="Select Tiers" />}
                />
            </FormControl>

            <TextField
                fullWidth
                type="number"
                id="winRateNumericThreshold"
                label="Win Rate Numeric Threshold"
                value={winRateNumericThreshold}
                onChange={handleChangeWinRateNumericThreshold}
                style={{ marginBottom: '10px' }}
            />

            <Button variant="contained" onClick={handleSaveSelectedChampions} style={{ backgroundColor: '#FFA500', color: '#fff' }}>Save Selected Champions</Button>

            {/* Exibindo a tabela de campeões inseridos */}
            {insertedChampions.length > 0 && (
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Lane</TableCell>
                                <TableCell>Win Rate</TableCell>
                                <TableCell>Tier</TableCell>
                                <TableCell>Pick Rate</TableCell>
                                <TableCell>Ban Rate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {insertedChampions.map((champion, index) => (
                                <TableRow key={index}>
                                    <TableCell>{champion.name}</TableCell>
                                    <TableCell>{champion.lane}</TableCell>
                                    <TableCell>{champion.winRate}</TableCell>
                                    <TableCell>{champion.tier}</TableCell>
                                    <TableCell>{champion.pickRate}</TableCell>
                                    <TableCell>{champion.banRate}</TableCell>
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
