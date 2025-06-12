import { IFavoriteProducts } from '../../interfaces/FavoriteProducts/IFavoriteProducts';

export enum FavoritesReducerActionType {
  SET = "SET_FAVORITE_PRODUCTS",
  ADD = "ADD_TO_FAVORITE",
  REMOVE = "REMOVE_FROM_FAVORITE",
  DELETE_FAVORITES_ALL = "DELETE_FAVORITES_ALL"
}

export interface IFavoriteProductsState {
  favoriteProducts: IFavoriteProducts[];
  count: number,
}

interface SetFavoritesAction {
  type: FavoritesReducerActionType.SET;
  payload: IFavoriteProducts[];
}

interface AddFavoriteAction {
  type: FavoritesReducerActionType.ADD;
  payload: IFavoriteProducts;
}

interface RemoveFavoriteAction {
  type: FavoritesReducerActionType.REMOVE;
  payload: IFavoriteProducts;
}

interface DeleteAllFavoriteAction {
  type: FavoritesReducerActionType.DELETE_FAVORITES_ALL;
  payload: IFavoriteProducts;
}
type FavoritesReducerAction = SetFavoritesAction | AddFavoriteAction | RemoveFavoriteAction | DeleteAllFavoriteAction;

const initState: IFavoriteProductsState = {
  favoriteProducts: [],
  count: 0,
};
export const setFavoriteProducts = (products: IFavoriteProducts[]) => ({
  type: FavoritesReducerActionType.SET,
  payload: products,
});

export const addToFavorite = (product: IFavoriteProducts) => ({
  type: FavoritesReducerActionType.ADD,
  payload: product,
});

export const removeFromFavorite = (product: IFavoriteProducts) => ({
  type: FavoritesReducerActionType.REMOVE,
  payload: product,
});
export const deleteAllFromFavorite = (product: IFavoriteProducts) => ({
  type: FavoritesReducerActionType.DELETE_FAVORITES_ALL,
  payload: product,
});

const favoritesReducer = (state = initState, action: FavoritesReducerAction): IFavoriteProductsState => {
  switch (action.type) {
    case FavoritesReducerActionType.SET:
      return {
        ...state,
        favoriteProducts: action.payload,
        count: action.payload.length
      };
    case FavoritesReducerActionType.ADD:
      return {
        ...state,
        favoriteProducts: [...state.favoriteProducts, action.payload],
        count: state.count + 1
      };
    case FavoritesReducerActionType.REMOVE:
      return {
        ...state,
        favoriteProducts: state.favoriteProducts.filter(product => product.productId !== action.payload.productId),
        count: state.count - 1
      };
    case FavoritesReducerActionType.DELETE_FAVORITES_ALL:
      return {
        ...state,
        count: 0,
        favoriteProducts: []
      };
    default:
      return state;
  }
};

export default favoritesReducer;