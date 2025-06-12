import axios from "axios";
import { APP_ENV } from "../../env/config";
import { IFavoriteProducts } from "../../interfaces/FavoriteProducts/IFavoriteProducts";
import { ICreateFavoriteProductDTO } from "../../interfaces/FavoriteProducts/ICreateFavoriteProductDTO";
import { IRemoveFavoriteProduct } from "../../interfaces/FavoriteProducts/IRemoveFavoriteProduct";


const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/UserFavoriteProducts`,
    headers: {
        "Content-Type": "application/json"
    }
});


export async function getFavoriteProductById(userId: any,) {
    try {
        const response = await instance.get<IFavoriteProducts[]>(`getFavorite`, { params: { userId } } );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function addFavoriteProduct(createFavoriteProductDTO: ICreateFavoriteProductDTO) {
    try {
        await instance.post(`addFavorite`, createFavoriteProductDTO)
        } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}

export async function removeFavoriteProduct(removeFavoriteProduct: IRemoveFavoriteProduct) {
    try {
        await instance.delete(`deleteFavorite`, {
            data: removeFavoriteProduct
        });
        } catch (error) {
        console.error('Failed to fetch product data:', error);
        throw error;
    }
}