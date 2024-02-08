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
    InputLabel,
    Button,
    TextField,
    Select,
    MenuItem
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

// Componente para formatar os nomes de campeões
const formatChampionNames = (names) => {
    return names.map(name => name.toLowerCase().replace(/\s+/g, ''));
};

const ChampionsPage = () => {
    // Estados
    const [lane, setLane] = useState('middle');
    const [selectedChampions, setSelectedChampions] = useState([]);
    const [tierList, setTierList] = useState(["S+", "S", "S-", "A+", "A", "A-"]);
    const [winRateNumericThreshold, setWinRateNumericThreshold] = useState(40);

    // Manipuladores de eventos
    const handleChangeLane = (event) => setLane(event.target.value);
    const handleChangeSelectedChampions = (event, value) => setSelectedChampions(value || []);
    const handleChangeTiers = (event, value) => setTierList(value || []);
    const handleChangeWinRateNumericThreshold = (event) => setWinRateNumericThreshold(event.target.value);

    const handleSaveSelectedChampions = async () => {
        try {
            console.log('Saving selected champions:', { lane, selectedChampions, tierList, winRateNumericThreshold });
            if (selectedChampions.length > 0) {
                await axios.post('http://localhost:3001/selected-champions', { lane, selectedChampions, tierList, winRateNumericThreshold });
                console.log('Selected champions saved successfully!');
            } else {
                console.log('No champions selected to save.');
            }
        } catch (error) {
            console.error('Error saving selected champions:', error);
        }
    };

    return (
        <div>
            <h1>League of Legends Champion Statistics</h1>
            <FormControl fullWidth>
                <InputLabel id="lane-label">Select Lane</InputLabel>
                <Select
                    labelId="lane-label"
                    value={lane}
                    onChange={handleChangeLane}
                    label="Select Lane"
                >
                    <MenuItem value={'middle'}>Middle</MenuItem>
                    <MenuItem value={'top'}>Top</MenuItem>
                    <MenuItem value={'jungle'}>Jungle</MenuItem>
                    <MenuItem value={'bottom'}>Bottom</MenuItem>
                    <MenuItem value={'support'}>Support</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <Autocomplete
                    multiple
                    id="champion-select"
                    options={formatChampionNames(championNames)}
                    getOptionLabel={(option) => option}
                    onChange={handleChangeSelectedChampions}
                    renderInput={(params) => <TextField {...params} label="Select Champions" />}
                />
            </FormControl>

            <FormControl fullWidth>
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
            />

            <Button variant="contained" onClick={handleSaveSelectedChampions}>Save Selected Champions</Button>
        </div>
    );
};

export default ChampionsPage;
