// api.js
import axios from 'axios';

export async function saveSelectedChampions(lane, selectedChampions) {
    try {
        await axios.post('http://localhost:3001/selected-champions', { lane, selectedChampions });
        console.log('Selected champions saved successfully!');
    } catch (error) {
        console.error('Error saving selected champions:', error);
        throw error;
    }
}
