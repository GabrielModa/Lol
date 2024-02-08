import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Button, TextField, Select, MenuItem } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const nomes_herois = [
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

// Função para formatar os nomes de campeões
function formatarNomesHerois(nomes) {
    return nomes.map(nome => {
        // Converte para minúsculas e remove espaços e caracteres especiais
        const nomeFormatado = nome.toLowerCase().replace(/\s/g, '').replace(/[^a-zA-Z]/g, '');
        return nomeFormatado;
    });
}

function ChampionsPage() {
    const [lane, setLane] = useState('middle');
    const [champions, setChampions] = useState([]);
    const [selectedChampions, setSelectedChampions] = useState([]);

    // Formatando os nomes dos campeões
    const nomesHeroisFormatados = formatarNomesHerois(nomes_herois);

    // Função para lidar com a mudança de lane
    const handleChangeLane = (event) => {
        setLane(event.target.value);
    };

    // Função para lidar com a mudança dos campeões selecionados
    const handleChangeSelectedChampions = (event, value) => {
        setSelectedChampions(value);
    };

    // Função para lidar com o clique no botão Save Selected Champions
    const handleSaveSelectedChampions = async () => {
        try {
            if (selectedChampions.length > 0) {
                await axios.post('http://localhost:3001/selected-champions', { lane, selectedChampions });
                console.log('Selected champions saved successfully!');
            } else {
                console.log('No champions selected to save.');
            }
        } catch (error) {
            console.error('Error saving selected champions:', error);
        }
    };


    // Função para renderizar a tabela de campeões
    const renderChampionsTable = () => {
        return (
            <TableContainer component={Paper}>
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
                        {champions.map((champion, index) => (
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
        );
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

            {/* Select para escolher os campeões */}
            <FormControl fullWidth>
                <Autocomplete
                    multiple
                    id="champion-select"
                    options={nomesHeroisFormatados}
                    onChange={handleChangeSelectedChampions}
                    renderInput={(params) => <TextField {...params} label="Select Champions" />}
                />
            </FormControl>

            {/* Botão para salvar os campeões selecionados */}
            <Button variant="contained" onClick={handleSaveSelectedChampions}>Save Selected Champions</Button>

            {/* Tabela de campeões */}
            {renderChampionsTable()}
        </div>
    );
}

export default ChampionsPage;
