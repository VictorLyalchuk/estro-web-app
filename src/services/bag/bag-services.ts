import axios from "axios";
import { APP_ENV } from "../../env/config";
import { IBag } from "../../interfaces/Bag/IBag";
import { BagReducerActionType } from "../../store/bag/BagReducer";
import { BagItems, IBagUser } from "../../interfaces/Bag/IBagUser";
import { CardReducerActionType } from "../../store/bag/CardReducer";
import moment from "moment";

const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/Bag`,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function createBag(bag: IBag) {
    try {
        await instance.post(`CreateBag`, bag)
    } catch (error) {
        console.error('Failed to create bag product data:', error);
        throw error;
    }
}

export async function getCountBagByEmail(email: string, dispatch: any) {
    try {
        const response = await instance.get<number>(`GetCountBagByEmail/${email}`);
        dispatch({
            type: BagReducerActionType.GET_PRODUCT_BAG_COUNT,
            payload: {
                count: response.data
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch bag product data:', error);
        throw error;
    }
}

export async function getBagItemsByEmail(email: string, dispatch: any) {
    try {
        const response = await instance.get<BagItems[]>(`GetBagItemsByEmail/${email}`);
        dispatch({
            type: CardReducerActionType.SET,
            payload: {
                items: response.data
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch bag product data:', error);
        throw error;
    }
}

export async function getBagByEmail(email: string) {
    try {
        const response = await instance.get<IBagUser>(`GetBagByEmail/${email}`);
        const formattedData: IBagUser = {
            id: response.data.id,
            countProduct: response.data.countProduct,
            userEmail: response.data.userEmail,
            userId: response.data.userId,
            orderDate: moment(response.data.orderDate, 'YYYY-MM-DD').format('DD MMMM YYYY'),
        };

        return formattedData;
    } catch (error) {
        console.error('Failed to fetch bag product data:', error);
        throw error;
    }
}

export async function increase(item: BagItems, email: string, dispatch: any) {
    try {
        if (item.quantity < 10) {
            await instance.post(`SetIncrease/${item.id}`);
            await refreashCount(email, dispatch);
        }
    } catch (error) {
        console.error('Failed to fetch bag product data:', error);
        throw error;
    }
}
export async function decrease(item: BagItems, email: string, dispatch: any) {
    try {
        if (item.quantity > 1) {
            await instance.post(`SetDecrease/${item.id}`)
            await refreashCount(email, dispatch);
        }
    }
    catch (error) {
        console.error('Failed to fetch bag product data:', error);
        throw error;
    }
}

export async function deleteItems(item: BagItems, email: string, dispatch: any) {
    const itemId = item.id
    if (itemId) {
        try {
            await instance.delete(`DeleteBagItem/${itemId}`)
            dispatch({
                type: CardReducerActionType.DELETE,
                payload: {
                    itemId: itemId
                }
            });
            await refreashCount(email, dispatch);
        } catch (error) {
            console.error("Error deleting bag items:", error);
        }
    }
}

export async function refreashCount(email: string, dispatch: any) {
    try {
        const resp = await instance.get<number>(`GetCountBagByEmail/${email}`)
        dispatch({
            type: BagReducerActionType.GET_PRODUCT_BAG_COUNT,
            payload: {
                count: resp.data
            }
        });
    } catch (error) {
        console.error('Failed to fetch bag product data:', error);
        throw error;
    }
}