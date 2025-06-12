import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IUser } from './interfaces/Auth/IUser';
import { AuthReducerActionType } from './store/accounts/AuthReducer';
import { jwtDecode } from 'jwt-decode'
import { BagReducerActionType } from './store/bag/BagReducer';
import { FavoritesReducerActionType } from './store/favourites/FavoritesReducer';
import { CardReducerActionType } from './store/bag/CardReducer';
import { OrderReducerActionType } from './store/order/OrderReducer';

const useAuthTokenEffect = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleTokenChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const user = jwtDecode(token) as IUser;
        dispatch({
          type: AuthReducerActionType.LOGIN_USER,
          payload: {
            Id: user.Id,
            Email: user.Email,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Role: user.Role,
            ImagePath: user.ImagePath,
            PhoneNumber: user.PhoneNumber,
            AuthType: user.AuthType
          } as IUser
        });


        // const tokenExpiration = new Date().getTime() + 60 * 60 * 1000; // 60 хвилин
        // localStorage.setItem('tokenExpiration', tokenExpiration.toString());
        // const logoutTimer = setTimeout(() => {
        //   // Виклик функції логауту
        //   dispatch({ type: AuthReducerActionType.LOGOUT_USER });
        //   dispatch({ type: BagReducerActionType.DELETE_BAG_ALL });
        //   dispatch({ type: FavoritesReducerActionType.DELETE_FAVORITES_ALL });
        // }, 60 * 60 * 1000); // 60 хвилин
        // localStorage.setItem('logoutTimer', logoutTimer.toString());

      } else {
        dispatch({ type: AuthReducerActionType.LOGOUT_USER });
        dispatch({ type: BagReducerActionType.DELETE_BAG_ALL });
        dispatch({ type: CardReducerActionType.DELETE_CARD_ALL });
        dispatch({ type: FavoritesReducerActionType.DELETE_FAVORITES_ALL });
        dispatch({ type: OrderReducerActionType.DELETE_ORDER_COUNT, });
      }
    };

    // const checkTokenExpiration = () => {
    //   const tokenExpiration = localStorage.getItem('tokenExpiration');
    //   if (tokenExpiration && new Date().getTime() > parseInt(tokenExpiration)) {
    //     // Виклик функції логауту
    //     dispatch({ type: AuthReducerActionType.LOGOUT_USER });
    //     dispatch({ type: BagReducerActionType.DELETE_BAG_ALL });
    //     dispatch({ type: FavoritesReducerActionType.DELETE_FAVORITES_ALL });
    //   }
    // };

    // // Перевірка часу токену кожні 5 секунд
    // const tokenCheckInterval = setInterval(checkTokenExpiration, 5000);

    window.addEventListener('storage', handleTokenChange);

    handleTokenChange();

    return () => {
      // clearInterval(tokenCheckInterval);

      window.removeEventListener('storage', handleTokenChange);
    };
  }, [dispatch]);
};

export default useAuthTokenEffect;
