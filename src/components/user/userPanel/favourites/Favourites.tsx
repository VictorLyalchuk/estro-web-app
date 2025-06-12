import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { APP_ENV } from "../../../../env/config";
import { Link } from "react-router-dom";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { IFavoriteProducts } from "../../../../interfaces/FavoriteProducts/IFavoriteProducts";
import { removeFromFavorite } from "../../../../store/favourites/FavoritesReducer";
import { removeFavoriteProduct } from "../../../../services/userFavoriteProducts/user-favorite-products-services";
import useGetFavoritesEffect from "../../../../useGetFavoritesEffect";
import { useTranslation } from "react-i18next";
import { getLocalizedField } from "../../../../utils/localized/localized";

const Favourites = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [showAllProducts, setShowAllProducts] = useState(false);
  const favoriteProducts = useSelector((state: RootState) => state.favorites.favoriteProducts);
  const baseUrl = APP_ENV.BASE_URL;
  const dispatch = useDispatch();

  const handleLoadAllProducts = () => {
    setShowAllProducts((prevShowAllProducts) => !prevShowAllProducts);
  };
  const displayedProducts = showAllProducts ? favoriteProducts : favoriteProducts.slice(0, 6);

  const favoriteToggle = async (product: IFavoriteProducts, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(removeFromFavorite(product));
    await removeFavoriteProduct(product);
  };

  useGetFavoritesEffect();

  return (
    <>
      <div className="bg-white rounded-md shadow-md mb-8 mt-8">
        <div className="mx-auto max-w-2xl px-8 py-8 sm:px-6 sm:pt-8 lg:max-w-screen-2xl lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div className="px-4 py-6 sm:p-6 lg:pb-8 min-h-[500px]">
              <div className="sm:flex sm:items-baseline sm:justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('Favorites_MyFavorites')}</h2>
                {favoriteProducts.length > 6 && (
                  <button onClick={handleLoadAllProducts} className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
                    {showAllProducts ? t('Favorites_ShowLess') : t('Favorites_BrowseAll')}
                    {showAllProducts ? (<span aria-hidden="true"> &larr;</span>) : (<span aria-hidden="true"> &rarr;</span>)}
                  </button>
                )}
              </div>
              <section
                aria-labelledby="products-heading">
                <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 lg:gap-x-8">
                  {displayedProducts.map((product, index) => (
                    <div key={index} className={`group relative mb-14 pb-7 hover13 ${product.storages?.every(storage => !storage.inStock) ? 'opacity-40' : ''}`}
                    >
                      <Link to={`/product/${product.productId}`} className="group">
                        <div className=" w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2 sm:min-h-auto">
                          <img
                            src={`${baseUrl}/uploads/1200_${product.productImage || '/uploads/default.jpg'}`}
                            className="h-full w-full object-cover object-center"
                          />
                          <div className="absolute top-2 right-2 rounded-full p-2 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100" aria-hidden="true">
                            <XMarkIcon className="w-12 h-12 stroke-1" onClick={(e) => { e.preventDefault(); e.stopPropagation(); favoriteToggle(product, e); }} />
                          </div>
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-gray-900">
                          <span className="inset-0" />
                          {getLocalizedField(product, 'productName', lang)}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{product.productPrice.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴</p>
                      </Link>
                      <div className="flex items-end opacity-0 group-hover:opacity-100" aria-hidden="true">
                        {!product.storages?.every(storage => !storage.inStock) ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <p className="mr-0.5 text-xs border-transparent pointer-events-none -inset-px rounded-md">
                              {t('Favorites_Size')}
                            </p>
                            {product.storages?.map((size) => (
                              size.inStock && (
                                <p key={size.size}
                                  // onClick={() => handleQuickviewOpen(product, size)}
                                  className="cursor-pointer text-xs border-transparent -inset-px rounded-md hover:text-indigo-500">
                                  {size.size}
                                </p>
                              )
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {favoriteProducts.length > 6 && (
                <div className="mt-6 sm:hidden">
                  <button onClick={handleLoadAllProducts} className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                    {showAllProducts ? t('Favorites_ShowLess') : t('Favorites_BrowseAll')}
                    {showAllProducts ? (<span aria-hidden="true"> &larr;</span>) : (<span aria-hidden="true"> &rarr;</span>)}
                  </button>
                </div>
              )}
              <div className="container mx-auto flex relative max-w-screen-2xl lg:flex-row justify-between m-0">
                <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between ">
                  <div>
                    <p className="text-sm text-gray-700">
                      {t('CatalogHome_PaginationShowing')} <span className="font-medium">{displayedProducts.length}
                        {' '}{t('CatalogHome_PaginationOf')}{' '}</span>
                      <span className="font-medium">{favoriteProducts.length}</span> {t('CatalogHome_PaginationResults')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Favourites;