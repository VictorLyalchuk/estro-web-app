import axios from 'axios';
import { IStore } from '../../interfaces/Store/IStore';
import { APP_ENV } from '../../env/config';
import { ICity } from '../../interfaces/Address/ICity';
import { ICountry } from '../../interfaces/Address/ICountry';
import { IStoreCreate } from '../../interfaces/Store/IStoreCreate';
import { IStoreEdit } from '../../interfaces/Store/IStoreEdit';

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/Store`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function getStore() {
    try {
        const response = await instance.get<IStore[]>(`StoreAll`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch store data:', error);
        throw error;
    }
};

export async function getCountry() {
    try {
        const response = await instance.get<ICountry[]>(`getCountry`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch country data:', error);
        throw error;
    }
};

export async function getCity() {
    try {
        const response = await instance.get<ICity[]>(`getCity`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch city data:', error);
        throw error;
    }
};

//admin panel Store
export async function getStoreByPage(page: number) {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<IStore[]>(`StoreByPage/${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch store data:', error);
        throw error;
    }
}

export async function getStoreById(id: number) {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<IStore>(`StoreById/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch main category data:', error);
        throw error;
    }
}

export async function getStoreQuantity() {
    const token = localStorage.getItem('token');
    try {
        const resp = await instance.get<number>(`StoreQuantity`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return resp.data;
    } catch (error) {
        console.error('Failed to fetch quantity store data:', error);
        throw error;
    }
}

export async function createStore(model: IStoreCreate) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`CreateStore`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch create store:', error);
        throw error;
    }
}

export async function editStore(model: IStoreEdit) {
    const token = localStorage.getItem('token');
    try {
        await instance.post(`EditStore`, model, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to fetch edit store:', error);
        throw error;
    }
}

export async function deleteStoreByID(id: number) {
    const token = localStorage.getItem('token');
    try {
        await instance.delete(`DeleteStore/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error('Failed to delete store data:', error);
        throw error;
    }
}