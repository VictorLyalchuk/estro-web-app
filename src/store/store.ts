import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import AuthReducer from "./accounts/AuthReducer";
import productReducer from './product/productReducer';
import bagReducer from "./bag/BagReducer";
import cardReducer from "./bag/CardReducer";
import favoritesReducer from "./favourites/FavoritesReducer";
import orderReducer from "./order/OrderReducer";

export const rootReducer = combineReducers({
    auth: AuthReducer,
    bag: bagReducer,
    card: cardReducer,
    favorites: favoritesReducer,
    products: productReducer,
    orders: orderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
   reducer: rootReducer,
   devTools: true,
   middleware: [thunk] 
});