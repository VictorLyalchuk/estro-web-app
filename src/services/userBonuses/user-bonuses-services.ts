import axios from "axios";
import { APP_ENV } from "../../env/config";


const baseUrl = APP_ENV.BASE_URL;

// Створюємо екземпляр axios
const instance = axios.create({
    baseURL: `${baseUrl}/api/UserBonuses`,
    headers: {
        "Content-Type": "application/json"
    }
});


export async function getUserBonusesByUserId(userId: any,) {
    try {
        // console.log(userId);
        const response = await instance.get<IUserBonuses[]>(`getBonuses`, { params: { userId } } );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch bonuses data:', error);
        throw error;
    }
}