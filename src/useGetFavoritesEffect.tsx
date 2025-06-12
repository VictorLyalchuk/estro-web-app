import { useEffect } from "react";
import { getFavoriteProductById } from "./services/userFavoriteProducts/user-favorite-products-services";
import { setFavoriteProducts } from "./store/favourites/FavoritesReducer";
import { useDispatch, useSelector } from "react-redux";
import { IAuthReducerState } from "./store/accounts/AuthReducer";

const useGetFavoritesEffect = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);

    useEffect(() => {
        const fetchFavoriteProducts = async () => {
            if (user) {
                try {
                    const data = await getFavoriteProductById(user?.Id);
                    dispatch(setFavoriteProducts(data));
                } catch (error) {
                    console.error('Error fetching favorite products:', error);
                }
            }
        };

        fetchFavoriteProducts();
    }, [dispatch, user]);

}
export default useGetFavoritesEffect;
