import axios from "axios";
import { APP_ENV } from "../../env/config";
import { IStorages } from "../../interfaces/Product/IProduct";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/Storage`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function addQuantityStorage(storagesList: IStorages[]) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`AddQuantityStorage`, storagesList, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to add quantity storage data:', error);
        throw error;
    }
}

