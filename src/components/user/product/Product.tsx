import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Image, message } from 'antd';
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import { IProduct, IStorages } from '../../../interfaces/Product/IProduct';
import { BagReducerActionType } from '../../../store/bag/BagReducer';
import { IAuthReducerState } from '../../../store/accounts/AuthReducer';
import { IBag } from '../../../interfaces/Bag/IBag';
import { APP_ENV } from "../../../env/config";
import { getProductById } from '../../../services/product/product-services';
import { createBag } from '../../../services/bag/bag-services';
import Carousel from 'react-material-ui-carousel';
import Slider from 'react-slick';
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline'
import { RootState } from '../../../store/store';
import { addToFavorite, removeFromFavorite } from '../../../store/favourites/FavoritesReducer';
import { addFavoriteProduct, removeFavoriteProduct } from '../../../services/userFavoriteProducts/user-favorite-products-services';
import { IFavoriteProducts } from '../../../interfaces/FavoriteProducts/IFavoriteProducts';
import Brightness1RoundedIcon from '@mui/icons-material/Brightness1Rounded';
import WomanSizeGuideComponent from './WomanSizeGuideComponent';
import ManSizeGuideComponent from './ManSizeGuideComponent';
import { useTranslation } from 'react-i18next';
import { getLocalizedField, getLocalizedFieldArray } from '../../../utils/localized/localized';
import ProductReview from './UserProductReview';
import classNames from 'classnames';
import { getQuantityUserProductReview, getUserProductRating, getUserProductReview } from '../../../services/userProductReview/user-product-review-services';
import { Link as Scrollink } from 'react-scroll'

export default function Product() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const baseUrl = APP_ENV.BASE_URL;
  const { Id } = useParams();
  const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const [product, setProduct] = useState<IProduct>();
  const [selectedSize, setSelectedSize] = useState<IStorages | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favoriteProducts = useSelector((state: RootState) => state.favorites.favoriteProducts);
  const isFavorite = (productId: number) => favoriteProducts.some((product: { productId: number }) => product.productId === productId);
  const [isQuickviewOpen, setQuickviewOpen] = useState(false);
  const [reviews, setReviews] = useState<IUserProductReview[]>([]);
  const [ratings, setRatings] = useState<IUserProductRating>();
  const [page, setPage] = useState(1);
  const [countPage, setCountPage] = useState(0);

  const loadReviews = async (page: number) => {
    await getUserProductReview(Id, page).then(data => setReviews(data)).catch(error => console.error('Error fetching reviews data:', error));
    await getUserProductRating(Id).then(data => setRatings(data)).catch(error => console.error('Error fetching ratings data:', error));
    await getQuantityUserProductReview(Id).then(data => setCountPage(data)).catch(error => console.error('Error fetching count data:', error));
  }

  useEffect(() => {
    if (Id) {
      getProductById(Id).then(data => setProduct(data)).catch(error => console.error('Error fetching product data:', error));
      loadReviews(page);
    }
  }, [Id, page]);

  if (!product) {
    return <p></p>
  }

  const addToBag = async () => {
    if (!isAuth) {
      navigate("/auth");
    }
    else {
      const model: IBag = {
        UserId: user?.Id || "",
        UserEmail: user?.Email || "",
        productId: selectedSize?.productId || 0,
        size: selectedSize?.size || "",
      };

      try {
        await createBag(model);
        setSelectedSize(null);
        dispatch({
          type: BagReducerActionType.PRODUCT_BAG_COUNT,
          payload: {
            pluscount: 1
          }
        });
      }
      catch (ex) {
        message.error(t('Product_ErrorAddingToBag'));
      }
    }
  }

  const favoriteToggle = async (product: IProduct, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    if (user) {
      const favoriteProduct: IFavoriteProducts = {
        userId: user?.Id,
        productId: product.id,
        productName_en: product.name_en,
        productName_uk: product.name_uk,
        productName_es: product.name_es,
        productName_fr: product.name_fr,
        productPrice: product.price,
        productImage: product.imagesPath?.[0] ?? '',
        storages: product.storages || null
      };
      if (!isFavorite(product.id)) {
        dispatch(addToFavorite(favoriteProduct));
        await addFavoriteProduct(favoriteProduct);
      } else {
        dispatch(removeFromFavorite(favoriteProduct));
        await removeFavoriteProduct(favoriteProduct);
      }
    }
  };

  const renderSizeGuide = (isQuickviewOpen: boolean) => {
    if (!isQuickviewOpen || typeof product.mainCategoryName_en !== 'string') {
      return null;
    }

    switch (product.mainCategoryName_en) {
      case 'Women':
        return (
          <WomanSizeGuideComponent
            isOpen={isQuickviewOpen}
            setOpen={setQuickviewOpen}
          />
        );
      case 'Men':
        return (
          <ManSizeGuideComponent
            isOpen={isQuickviewOpen}
            setOpen={setQuickviewOpen}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden rounded-sm border-stroke bg-gray-100 shadow-default dark:border-strokedark dark:bg-boxdark text-body">

      <nav aria-label="Breadcrumb" className="pt-6">
        <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-screen-2xl lg:px-8">
          <li key={`${product.id}-mainCategory`}>
            <div className="flex items-center">
              <Link to={`/catalog-home/${product.urlMainCategoryName}`} className="mr-2 text-sm font-medium text-gray-900">
                {getLocalizedField(product, 'mainCategoryName', lang)}
              </Link>
              <svg
                width={16}
                height={20}
                viewBox="0 0 16 20"
                fill="currentColor"
                aria-hidden="true"
                className="h-5 w-4 text-gray-300"
              >
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>

          <li key={`${product.id}-subCategory`}>

            <div className="flex items-center">
              <Link to={`/catalog/${product.urlSubCategoryName}`} className="mr-2 text-sm font-medium text-gray-900">
                {getLocalizedField(product, 'subCategoryName', lang)}
              </Link>
              <svg
                width={16}
                height={20}
                viewBox="0 0 16 20"
                fill="currentColor"
                aria-hidden="true"
                className="h-5 w-4 text-gray-300"
              >
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>
          <li key={`${product.id}-category`}>
            <div className="flex items-center">
              <Link to={`/catalog/${product.urlSubCategoryName}/${product.urlCategoryName}`} className="mr-2 text-sm font-medium text-gray-900">
                {getLocalizedField(product, 'categoryName', lang)}
              </Link>
              <svg
                width={16}
                height={20}
                viewBox="0 0 16 20"
                fill="currentColor"
                aria-hidden="true"
                className="h-5 w-4 text-gray-300"
              >
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>

          </li>
          <li className="text-sm">
          </li>
        </ol>
      </nav>

      <main className="mx-auto mt-8 max-w-2xl px-4 pb-4  lg:max-w-screen-2xl lg:px-8">

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 mb-8">

          {/* Image gallery */}
          <div className="mt-8 lg:col-span-6 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-8">
              <Slider>
                {product.images && product.images.length > 0 ? (
                  <Carousel swipe animation="fade" duration={500} autoPlay={true} indicatorIconButtonProps={{ style: { width: '35px', height: '35px', }, }}
                    IndicatorIcon={<Brightness1RoundedIcon fontSize='small' />}
                    indicators={true} className="h-full w-full rounded-lg overflow-hidden" >
                    {product.images?.map((image, index) => (
                      <div key={index} className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
                        <Image
                          src={`${baseUrl}/uploads/1200_${image?.imagePath || '/uploads/imagenot.webp'}`}
                          alt={getLocalizedField(product, 'name', lang)}
                          className="w-full h-full object-contain cursor-pointer rounded-lg"
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
                    <Image
                      src={`${baseUrl}/uploads/imagenot.webp`}
                      alt="Image Not Available"
                      className="w-full h-full object-contain cursor-pointer rounded-lg"
                    />
                  </div>
                )}
              </Slider >
            </div>
          </div>

          {/* Product */}
          <div className="lg:col-span-6 lg:col-start-7">
            {/* Options */}
            <div className="justify-between">
              <h1 className="text-xl font-medium text-gray-900">{getLocalizedField(product, 'name', lang)}</h1>
              <p className="text-2xl font-medium text-gray-900">{product.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} €</p>
            </div>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">{t('Product_Reviews')}</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating, index) => (
                    <StarIcon
                      key={index}
                      className={classNames(
                        ratings && ratings?.averageRating > rating ? 'text-yellow-400' : 'text-gray-300',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{ratings?.averageRating} {t('Product_OutOf')} 5 {t('Product_Stars')}</p>
                <Scrollink to="product-reviews" smooth={true} className="cursor-pointer ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {ratings?.totalCount} {t('Product_Reviews')}
                </Scrollink>
              </div>
            </div>
          </div>

          <div className="mt-8 lg:col-span-4 lg:col-start-7">
            <form>

              {/* Size picker */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-900">{t('Product_Size')}</h2>
                  <a onClick={() => setQuickviewOpen(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                    {t('Product_SizeGuide')}
                  </a>
                </div>

                {renderSizeGuide(isQuickviewOpen)}

                <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-2">
                  <RadioGroup.Label className="sr-only">{t('Product_ChooseASize')}</RadioGroup.Label>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {product.storages?.map((size) => (
                      <RadioGroup.Option
                        key={size.size}
                        value={size}
                        disabled={!size.inStock}
                        className={({ active, checked }) =>
                          classNames(
                            size.inStock
                              ? 'cursor-pointer bg-gray-100 text-gray-900 shadow-sm'
                              : 'cursor-not-allowed bg-gray-50 text-gray-200',
                            active ? 'bg-indigo-600 text-white' : '',
                            checked ? 'bg-indigo-600 text-white' : '',
                            'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-indigo-600 hover:text-white focus:outline-none sm:flex-1 '
                          )
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <RadioGroup.Label as="span">{size.size}</RadioGroup.Label>
                            {size.inStock ? (
                              <span
                                className={classNames(
                                  active ? 'border' : 'border-2',
                                  checked ? 'border-indigo-500' : 'border-transparent',
                                  'pointer-events-none absolute -inset-px rounded-md '
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                              >
                                <svg
                                  className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                  viewBox="0 0 100 100"
                                  preserveAspectRatio="none"
                                  stroke="currentColor"
                                >
                                  <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                </svg>
                              </span>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  disabled={!selectedSize}
                  onClick={addToBag}
                  className={`p-2 mr-3 flex w-full items-center justify-center rounded-md border ${!selectedSize ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'
                    } px-8 py-3 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  {selectedSize ? t('Product_AddToBag') : t('Product_SelectASize')}
                </button>

                <div className="cursor-pointer">
                  <div className={classNames(
                    isFavorite(product.id) ? 'text-red-600' : 'text-gray-400 hover:text-gray-500',
                    'ml-3 text-gray-400 hover:text-gray-500'
                  )}>

                    {isFavorite(product.id) ? (
                      <HeartIcon className="w-9 h-9 stroke-1" onClick={(e) => favoriteToggle(product, e)} />
                    ) : (
                      <OutlineHeartIcon className="w-9 h-9 stroke-1" onClick={(e) => favoriteToggle(product, e)} />
                    )}
                  </div>
                </div>
              </div>
            </form>

            {/* Product details */}

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 inline">{t('Product_Article')}: </h3>
              <span className='prose prose-sm text-sm text-gray-500'>{product.article}</span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 inline">{t('Product_Color')}: </h3>
              <span className='prose prose-sm text-sm text-gray-500'>{getLocalizedField(product, 'color', lang)}</span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 inline">{t('Product_Material')}: </h3>
              <span className='prose prose-sm text-sm text-gray-500'>{getLocalizedField(product, 'material', lang)}</span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 inline">{t('Product_Season')}: </h3>
              <span className='prose prose-sm text-sm text-gray-500'>{getLocalizedField(product, 'season', lang)}</span>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-sm font-medium text-gray-900">{t('Product_Description')}</h2>
              <div
                className="prose prose-sm mt-4 text-gray-500"
                dangerouslySetInnerHTML={{ __html: getLocalizedField(product, 'description', lang) }}
              />
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-sm font-medium text-gray-900">{t('Product_Highlights')}</h2>

              <div className="prose prose-sm mt-4 text-gray-500">
                <ul role="list" className="list-disc space-y-2 pl-4 ">
                  {getLocalizedFieldArray(product, 'highlights', lang).map((highlight: string, index: number) => (
                    <li
                      key={index}
                      className="text-gray-400">
                      <span className="text-sm text-gray-500">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div id="product-reviews">
          <ProductReview
            userId={user?.Id}
            productId={product.id}
            reviews={reviews}
            ratings={ratings}
            loadReviews={() => loadReviews(page)}
            page={page}
            setPage={setPage}
            countPage={countPage}
            isAuth={isAuth}
          />
        </div>

      </main>
    </div>
  )
}