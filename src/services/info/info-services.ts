import axios from "axios";
import { APP_ENV } from "../../env/config";
// import { IInfo } from "../../interfaces/Info/IInfo";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/Info`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getInfoList() {
    try {
        const resp = await instance.get<any[]>(`GetInfo`,);
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function getSeasonList() {
    try {
        const resp = await instance.get<any[]>(`GetSeason`,);
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch season data:', error);
        throw error;
    }
}

export async function getColorsList() {
    try {
        const resp = await instance.get<any[]>(`GetColors`,);
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch colors data:', error);
        throw error;
    }
}

export async function getMaterialsList() {
    try {
        const resp = await instance.get<any[]>(`GetMaterials`,);
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch materials data:', error);
        throw error;
    }
}

export async function getSizesList() {
    try {
        const resp = await instance.get<any[]>(`GetSizes`,);
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch sizes data:', error);
        throw error;
    }
}