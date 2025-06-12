import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { ArrowLongLeftIcon, ArrowLongRightIcon, XMarkIcon, HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { IProduct, IStorages } from '../../../interfaces/Product/IProduct.ts';
import { Link, useParams, useNavigate } from "react-router-dom";
import qs, { ParsedQs } from 'qs';
import { IMainCategory } from '../../../interfaces/Category/Main-Category/IMainCategory.ts';
import { IInfo, IOptions } from '../../../interfaces/Info/IInfo.ts';
import { APP_ENV } from "../../../env/config.ts";
import { getProductsist, getQuantityProducts } from '../../../services/product/product-services.ts';
import { updateFilters, createQueryParams, onPageChangeQueryParams, onSortChangeQueryParams } from '../../../utils/catalog/filterUtils.ts';
import ProductQuickview from '../product/ProductQuickview.tsx';
import { ISortOptions } from '../../../interfaces/Catalog/ISortOptions.ts';
import { getMainCategories } from '../../../services/category/category-services.ts';
import { getInfoList } from '../../../services/info/info-services.ts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store.ts';
import { IAuthReducerState } from '../../../store/accounts/AuthReducer.ts';
import { addToFavorite, removeFromFavorite } from '../../../store/favourites/FavoritesReducer.ts';
import { ArrowUpIcon, HeartIcon } from '@heroicons/react/24/solid';
import { addFavoriteProduct, removeFavoriteProduct } from '../../../services/userFavoriteProducts/user-favorite-products-services.ts';
import { IFavoriteProducts } from '../../../interfaces/FavoriteProducts/IFavoriteProducts.ts';
import i18next, { t } from "i18next";
import { getLocalizedField } from '../../../utils/localized/localized.ts';
import { useTranslation } from 'react-i18next';
import { Link as Scrollink } from 'react-scroll'
import classNames from 'classnames';
import Loader from '../../../common/Loader/loader.tsx';
import SimpleCarousel from '../../../ui/carousel/SimpleCarousel.tsx';

export default function CatalogNavigation() {
  const initialSortOptions: ISortOptions[] = [
    { name: t('Sort_Newest'), url: 'newest', current: false },
    { name: t('Sort_Popular'), url: 'most_popular', current: false },
    { name: t('Sort_Rating'), url: 'best_rating', current: false },
    { name: t('Sort_LowToHigh'), url: 'price_low_to_high', current: false },
    { name: t('Sort_HighToLow'), url: 'price_high_to_low', current: false },
  ];
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const baseUrl = APP_ENV.BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subName, urlName } = useParams();
  const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const favoriteProducts = useSelector((state: RootState) => state.favorites.favoriteProducts);
  const isFavorite = (productId: number) => favoriteProducts.some((product: { productId: number }) => product.productId === productId);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [productList, setProduct] = useState<IProduct[]>([]);
  const [mainCategoryList, setMainCategoryList] = useState<IMainCategory[]>([]);
  const [filterOptionsList, setFilterOptionsList] = useState<IInfo[]>([]);
  const [filters, setFilters] = useState<{ name: string; values: string[] }[]>([]);
  const [gridView, setGridView] = useState<string>("3");
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [page, setPage] = useState(1);
  const [countPage, setCountPage] = useState(0);
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(countPage / itemsPerPage);
  const visiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);
  const [focusedProduct, setFocusedProduct] = useState<IProduct | null>(null);
  const [isQuickviewOpen, setQuickviewOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<IStorages | null>(null);
  const [activeSortOption, setActiveSortOption] = useState<ISortOptions | null>(null);
  const [sortOptions, setSortOptions] = useState<ISortOptions[]>(initialSortOptions);
  const [activeOption, setActiveOption] = useState('');
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  };

  const onViewModeChange = () => {
    setLoading(true);
    const newGridView = gridView === "3" ? "4" : "3";
    const newItemsPerPage = gridView === "3" ? 8 : 6;

    setGridView(newGridView);
    setItemsPerPage(newItemsPerPage);
    onPageChange(1);
  }

  const onSortModeChange = (selectedOption: ISortOptions) => {
    // setLoading(true);
    setActiveSortOption(selectedOption);
    const updatedSortOptions = sortOptions.map(option =>
      option.name === selectedOption.name
        ? { ...option, current: true }
        : { ...option, current: false }
    );
    setSortOptions(updatedSortOptions);

    const queryParams = onSortChangeQueryParams(selectedOption.url, filters);
    const newQueryString = qs.stringify(queryParams, { encodeValuesOnly: true, delimiter: ';' });
    navigate({ search: newQueryString });
  };

  const onSortModeLoad = (selectedOption: string | null) => {
    setLoading(true);
    const updatedSortOptions = sortOptions.map(option =>
      option.url === selectedOption
        ? { ...option, current: true }
        : { ...option, current: false }
    );
    setSortOptions(updatedSortOptions);
    setActiveSortOption(updatedSortOptions.find(option => option.current) || null);
  };

  const onPageChange = (newPage: number) => {
    setLoading(true);
    setPage(newPage);
    const queryParams = onPageChangeQueryParams(newPage, filters);
    const newQueryString = qs.stringify(queryParams, { encodeValuesOnly: true, delimiter: ';' });
    navigate({ search: newQueryString });
  };

  const createFilters = async (name: string, value: string) => {
    setLoading(true);
    const newFilters = updateFilters(filters, name, value);
    setFilters(newFilters);
    setPage(1);

    const queryParams = createQueryParams(newFilters);
    const newQueryString = qs.stringify(queryParams, { encodeValuesOnly: true, delimiter: ';' });
    navigate({ search: newQueryString });
  };

  const resetFilters = () => {
    const newQueryString = ""
    navigate({ search: newQueryString });
    setFilters([]);
    setPage(1);
    setActiveSortOption(null);
  };

  const parseUrlQuery = (): { name: string; values: string[] }[] => {
    // завантаження даних з url, їх перетворення та присвоєння у filters 
    const queryParams: ParsedQs = qs.parse(location.search, { ignoreQueryPrefix: true, delimiter: ';' });

    if (queryParams['Page']) {
      setPage(parseInt(queryParams['Page'] as string) || 1);
    }
    const newFilters = Object.keys(queryParams).map((name) => {
      let values: string[] = [];
      if (Array.isArray(queryParams[name])) {
        values = queryParams[name] as string[];
      } else if (typeof queryParams[name] === 'string') {
        values = [(queryParams[name] as string)];
      }
      values = values.flatMap((value) => value.split('_'));
      return {
        name,
        values,
      };
    });
    return newFilters;
  };

  const loadFromURL = async () => {
    try {
      // створення і відправка даних на сервер
      const newFilters = parseUrlQuery();
      setFilters(newFilters);

      const filterDTO: IFilterDTO = {
        Size: newFilters.find(f => f.name === 'Size')?.values || undefined,
        Material: newFilters.find(f => f.name === 'Material')?.values || undefined,
        Color: newFilters.find(f => f.name === 'Color')?.values || undefined,
        Season: newFilters.find(f => f.name === 'Season')?.values || undefined,
        Page: newFilters.find(f => f.name === 'Page')?.values || page,
        ItemsPerPage: newFilters.find(f => f.name === 'ItemsPerPage')?.values || itemsPerPage,
        Sort: newFilters.find(f => f.name === 'Sort')?.values?.join('_') || undefined,
        SubName: subName,
        UrlName: urlName,
      };

      onSortModeLoad(newFilters.find(f => f.name === 'Sort')?.values?.join('_') || null);

      const responseQuantity = await getQuantityProducts(filterDTO);
      const quantity = responseQuantity;
      setCountPage(quantity);

      const responseProduct = await getProductsist(filterDTO);
      setProduct(responseProduct);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleQuickviewOpen = (product: IProduct, size: IStorages) => {
    setFocusedProduct(product);
    setQuickviewOpen(true);
    setSelectedSize(size);
  };

  const getMainCategory = async () => {
    try {
      const mainCategories = await getMainCategories();
      setMainCategoryList(mainCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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

  const transformToOptions = (options: any[], language: string): IOptions[] => {
    return options.map(option => ({
      id: option.id.toString(),
      label: (() => {
        switch (language) {
          case 'uk':
            return option.name_uk;
          case 'es':
            return option.name_es;
          case 'fr':
            return option.name_fr;
          case 'en':
            return option.name_en;
          default:
            return option.name_en;
        }
      })(),
      value: option.value
    }));
  };

  const getInfo = async () => {
    try {
      const infos = await getInfoList();

      const transformedInfos: IInfo[] = infos.map(info => {
        const allOptions = [
          ...transformToOptions(info.colors || [], i18next.language),
          ...transformToOptions(info.season || [], i18next.language),
          ...transformToOptions(info.sizes || [], i18next.language),
          ...transformToOptions(info.materials || [], i18next.language),
        ];

        return {
          id: info.id,
          name_en: info.name_en,
          name_es: info.name_es,
          name_fr: info.name_fr,
          name_uk: info.name_uk,
          value: info.value,
          options: allOptions.length > 0 ? allOptions : null
        };
      });

      setFilterOptionsList(prevFilters => [...prevFilters, ...transformedInfos]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    setPage(1);
    getMainCategory();
    getInfo()
  }, []);

  useEffect(() => {
    loadFromURL().then(() => {
      setLoading(false);
    });
  }, [subName, urlName, location.search, page, itemsPerPage]);

  return (
    <div className="bg-gray-100 ">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-gray-100 py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">{t('CatalogNavigation_Filters')}</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">{t('CatalogNavigation_CloseMenu')}</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    <ul role="list" className="space-y-4 px-3 py-4 text-sm font-medium text-gray-500">
                      {mainCategoryList.map((mainCategory) =>
                        mainCategory.subCategories.map((subCategory) => (
                          <div key={subCategory.id}>
                            <div className={`block text-xl ${subCategory.urlName === subName ? "font-bold py-3 text-gray-700" : "text-gray-400 hover:text-indigo-500"}`}>
                              <Link
                                to={`/catalog/${subCategory.urlName}`}
                                className={`block ${subCategory.urlName === subName ? "font-bold text-gray-700 " : "text-gray-500 hover:text-indigo-500"}`}
                              >
                                {i18next.language === 'uk' ? subCategory.name_uk : null}
                                {i18next.language === 'en' ? subCategory.name_en : null}
                                {i18next.language === 'es' ? subCategory.name_es : null}
                                {i18next.language === 'fr' ? subCategory.name_fr : null}
                              </Link>
                            </div>
                            <div className="space-y-4 mb-5 border-b border-gray-200 pb-6 text-sm font-medium text-gray-500">
                              {subCategory.urlName === subName && (
                                <ul role="list" className="space-y-4 pb-6 text-sm font-medium text-gray-500">
                                  {subCategory.categories.map((category) => (
                                    <li key={category.id}>
                                      <Link
                                        to={`/catalog/${subCategory.urlName}/${category.urlName}`}
                                        className={`block ${category.urlName === urlName ? "font-bold text-gray-700" : "text-gray-400 hover:text-indigo-500"}`}
                                      >
                                        {i18next.language === 'uk' ? category.name_uk : null}
                                        {i18next.language === 'en' ? category.name_en : null}
                                        {i18next.language === 'es' ? category.name_es : null}
                                        {i18next.language === 'fr' ? category.name_fr : null}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </ul>
                    <div className="space-y-6 px-3 py-4 pt-6 space-y-4 border-b border-gray-200 pb-6 text-lg font-medium">
                      <button type="button" className='rounded border-gray-300 hover:text-indigo-500 focus:ring-indigo-500'
                        onClick={resetFilters}>
                        {t('CatalogNavigation_ResetFilters')}
                      </button>
                    </div>
                    {filterOptionsList.map((section) => (
                      <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-gray-100 px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900 hover:text-indigo-500">
                                  {i18next.language === 'uk' ? section.name_uk : null}
                                  {i18next.language === 'en' ? section.name_en : null}
                                  {i18next.language === 'es' ? section.name_es : null}
                                  {i18next.language === 'fr' ? section.name_fr : null}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                  ) : (
                                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options?.map((option, optionIdx) => (
                                  <div key={option.value} className="flex items-center">
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      value={option.value}
                                      type="checkbox"
                                      checked={filters.some((filter) => filter.name === section.name_en && filter.values.includes(option.value))}
                                      onChange={() => {
                                        createFilters(section.name_en, option.value);
                                      }}

                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        <main className="mx-auto max-w-screen-2xl px-2 sm:px-2 lg:px-2 product-start">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-2 pt-4 px-4 lg:px-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 pb-4">{t('CatalogNavigation_Catalog')}</h1>

            {/* Sort */}
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-indigo-500 transform transition-transform duration-300 hover:scale-110">
                    {activeSortOption ? activeSortOption.name : t('CatalogNavigation_Sort')}
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-indigo-500 transform transition-transform duration-300 hover:scale-110"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="cursor-pointer absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-gray-100 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              onClick={() => onSortModeChange(option)}
                              className={classNames(
                                option.current || (active && activeSortOption && activeSortOption.name === option.name)
                                  ? 'font-medium text-gray-900' : 'text-gray-500 hover:text-indigo-500',
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              <span className='inline-block transform transition-transform duration-300 hover:scale-110'>
                                {option.name}
                              </span>
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button type="button" onClick={onViewModeChange} className="-m-2 ml-5 p-2 text-gray-400 hover:text-indigo-600 sm:ml-7">
                <span className="sr-only">{t('CatalogNavigation_ViewGrid')}</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">{t('CatalogNavigation_Filters')}</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <h2 id="products-heading" className="sr-only">
            {t('CatalogNavigation_Products')}
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
            {/* Filters */}
            <form className="hidden lg:block">
              <div className=' px-2 py-8 '
              // style={{ minWidth: '280px' }}
              >
                <h3 className="sr-only">{t('CatalogNavigation_Categories')}</h3>
                <ul role="list" className="space-y-4  text-sm font-medium text-gray-500">
                  {mainCategoryList.map((mainCategory) =>
                    mainCategory.subCategories.map((subCategory) => (
                      <div key={subCategory.id}>
                        <div className={`block text-xl ${subCategory.urlName === subName ? "font-bold py-3 text-gray-700 " : "text-gray-400 hover:text-indigo-500"}`}>
                          <Link
                            to={`/catalog/${subCategory.urlName}`}
                            onClick={() => setPage(1)}
                            className={`block ${subCategory.urlName === subName ? "font-bold text-gray-700" : "text-gray-500 hover:text-indigo-500 transform transition-transform duration-300 ease-in-out hover:scale-110 origin-left"}`}
                          >
                            {getLocalizedField(subCategory, 'name', lang)}
                          </Link>
                        </div>
                        <div className="space-y-4 mb-5 border-b border-gray-200 pb-6 text-sm font-medium text-gray-500">
                          {subCategory.urlName === subName && (
                            <ul role="list" className="space-y-4 pb-6 text-sm font-medium text-gray-500">
                              {subCategory.categories.map((category) => (
                                <li key={category.id}>
                                  <Link
                                    to={`/catalog/${subCategory.urlName}/${category.urlName}`}
                                    className={`block ${category.urlName === urlName ? "font-bold text-gray-700" : "text-gray-400 hover:text-indigo-500 transform transition-transform duration-300 hover:scale-110 origin-left"}`}
                                    onClick={() => setPage(1)}
                                  >
                                    {i18next.language === 'uk' ? category.name_uk : null}
                                    {i18next.language === 'en' ? category.name_en : null}
                                    {i18next.language === 'es' ? category.name_es : null}
                                    {i18next.language === 'fr' ? category.name_fr : null}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </ul>
                <div className="pt-6 space-y-4 border-b border-gray-200 pb-6">
                  <button type="button" className='rounded border-gray-300 hover:text-indigo-500 focus:ring-indigo-500 transform transition-transform duration-300 hover:scale-110 origin-left'
                    onClick={resetFilters}>
                    {t('CatalogNavigation_ResetFilters')}
                  </button>
                </div>
                {filterOptionsList.map((section) => (
                  <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6"
                  // defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button
                            className="flex w-full items-center justify-between bg-gray-100 py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900 hover:text-indigo-500 transform transition-transform duration-300 hover:scale-110 origin-left">
                              {i18next.language === 'uk' ? section.name_uk : null}
                              {i18next.language === 'en' ? section.name_en : null}
                              {i18next.language === 'es' ? section.name_es : null}
                              {i18next.language === 'fr' ? section.name_fr : null}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.options?.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center ">
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  value={option.value}
                                  type="checkbox"
                                  checked={filters.some((filter) => filter.name === section.name_en && filter.values.includes(option.value))}
                                  onChange={() => {
                                    createFilters(section.name_en, option.value);
                                    setActiveOption(option.value);
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600 hover:text-indigo-500 cursor-pointer transform transition-transform duration-300 hover:scale-110 origin-left"
                                >
                                  {option.label}
                                </label>
                                {activeOption === option.value && (
                                  <button
                                    type="button"
                                    className="absolute ml-25 p-2 bg-indigo-600 text-sm text-white rounded-lg shadow-md transition-opacity duration-300"
                                    onClick={() => {
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                      setActiveOption('');
                                    }}
                                    aria-label="Scroll to top"
                                  >
                                    <div className="flex items-center ">
                                      <span className="whitespace-nowrap">{t('CatalogNavigation_Found')} {countPage} {t('CatalogNavigation_products')}</span>
                                      <ArrowUpIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                                    </div>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}

              </div>
            </form>

            {/* Product grid */}
            <div className="lg:col-span-4">
              <div className="overflow-hidden rounded-sm dark:border-strokedark dark:bg-boxdark bg-gray-100">
                <div className="relative mx-auto max-w-2xl px-2 py-8  lg:max-w-screen-2xl lg:px-2 bg-gray-100">
                  {/* <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2> */}
                  <div className={`min-h-[662px] mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-${gridView} xl:gap-x-5 pb-8 transition-all duration-500`}>
                    {loading ? (
                      <Loader />
                    ) : (
                      productList.slice(0, itemsPerPage).map((product) => (
                        <div key={product.id} className="group relative">
                          {/* <Link to={`/product/${product.id}`}> */}
                          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden lg:aspect-none lg:h-120 hover13">
                            <div
                              key={product.id}
                              onMouseEnter={() => setHoveredProductId(product.id)}
                              onMouseLeave={() => setHoveredProductId(null)}
                            >
                              <div className="group">
                                {product.images && product.images.length > 0 ? (
                                  <SimpleCarousel product={product} lang={lang} isHovered={hoveredProductId === product.id} />
                                ) : (
                                  <img
                                    src={`${baseUrl}/uploads/imagenot.webp`}
                                    alt="Image Not Available"
                                    className="h-full w-full object-cover object-center "
                                  />
                                )}
                              </div>
                            </div>
                            <div className="absolute top-2 right-2 rounded-full p-2 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100" aria-hidden="true">
                              <div className={classNames(
                                isFavorite(product.id) ? 'text-red-600' : 'text-gray-400 hover:text-gray-500',
                                'ml-3 text-gray-400 hover:text-gray-500'
                              )}>
                                {isFavorite(product.id) ? (
                                  <HeartIcon className="w-7 h-7 stroke-1" onClick={(e) => favoriteToggle(product, e)} />
                                ) : (
                                  <OutlineHeartIcon className="w-7 h-7 stroke-1" onClick={(e) => favoriteToggle(product, e)} />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between">
                            <div>
                              <h3 className="text-sm text-gray-700 meta-5   break-words w-40">
                                {getLocalizedField(product, 'name', lang)}
                              </h3>
                              <p className="mt-1 text-xs text-gray-500">{product.article}</p>
                              <p className="mt-1 text-xs text-gray-500">{getLocalizedField(product, 'season', lang)}</p>
                            </div>
                            <p className="text-sm font-bold text-red-800 whitespace-nowrap" >{product.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} €</p>
                          </div>
                          {/* </Link> */}

                          <div className="flex items-end opacity-0 group-hover:opacity-100" aria-hidden="true">
                            <div className="mt-4 flex items-center gap-1">
                              <p className=" text-xs border-transparent pointer-events-none -inset-px rounded-md">
                                {t('CatalogHome_Size')}:
                              </p>
                              <div className="flex gap-1">
                                {product.storages?.filter(size => size.inStock).map((size, index, array) => (
                                  <span
                                    key={size.size}
                                    onClick={() => handleQuickviewOpen(product, size)}
                                    className="cursor-pointer text-xs border-transparent -inset-px rounded-md hover:text-indigo-500 transform transition-transform duration-300 hover:scale-110"
                                  >
                                    {size.size}
                                    {index < array.length - 1 && ' | '}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-end pt-2 opacity-0 group-hover:opacity-100" aria-hidden="true">
                          </div>
                          {isQuickviewOpen && focusedProduct && (
                            <ProductQuickview
                              product={focusedProduct}
                              isOpen={isQuickviewOpen}
                              setOpen={setQuickviewOpen}
                              size={selectedSize}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  {/* Pagination */}
                  <div className="container mx-auto p-4 flex relative max-w-screen-2xl lg:flex-row justify-center">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between ">
                      <div>
                        <p className="text-sm text-gray-700">
                          {t('CatalogHome_PaginationShowing')} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('CatalogHome_PaginationTo')}{' '}
                          <span className="font-medium">{Math.min(indexOfLastItem, countPage)}</span> {t('CatalogHome_PaginationOf')}{' '}
                          <span className="font-medium">{countPage}</span> {t('CatalogHome_PaginationResults')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                        <div className="flex flex-1 justify-between sm:justify-end">
                          <Scrollink to="product-start" smooth={true}>
                            <button
                              onClick={() => onPageChange(page - 1)}
                              disabled={page === 1}
                              className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium 
                            ${page === 1
                                  ? 'text-gray-300'
                                  : 'text-gray-900 hover:border-indigo-500 hover:text-indigo-500'
                                }`}
                            >
                              <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                              {t('CatalogHome_Previous')}
                            </button>
                          </Scrollink>

                          <div className="hidden lg:block">
                            <Scrollink to="product-start" smooth={true}>
                              <button
                                onClick={() => onPageChange(1)}
                                disabled={page === 1}
                                className={`inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium 
                                                ${page === 1
                                    ? 'text-gray-300'
                                    : 'text-gray-900 hover:border-indigo-500 hover:text-indigo-500'
                                  }`}
                              >
                                {t('Begin')}
                              </button>
                            </Scrollink>
                          </div>

                          {[...Array(endPage - startPage + 1)].map((_, index) => {
                            const pageNumber = startPage + index;
                            return (
                              <Scrollink to="product-start" smooth={true} key={pageNumber}>
                                <button
                                  key={pageNumber}
                                  onClick={() => onPageChange(pageNumber)}
                                  className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium text-gray-500 ${page === pageNumber
                                    ? 'border-t-2 border-indigo-500 text-indigo-600 font-semibold'
                                    : 'border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700'
                                    }`}
                                >
                                  {pageNumber}
                                </button>
                              </Scrollink>

                            );
                          })}

                          <div className="hidden lg:block">
                            <Scrollink to="product-start" smooth={true}>
                              <button
                                onClick={() => onPageChange(totalPages)}
                                disabled={page >= totalPages}
                                className={`inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium 
                                                    ${page >= totalPages
                                    ? 'text-gray-300'
                                    : 'text-gray-900 hover:border-indigo-500 hover:text-indigo-500'
                                  }`}
                              >
                                {t('End')}
                              </button>
                            </Scrollink>
                          </div>

                          <Scrollink to="product-start" smooth={true}>
                            <button
                              onClick={() => onPageChange(page + 1)}
                              disabled={indexOfLastItem >= countPage}
                              className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium 
                              ${indexOfLastItem >= countPage
                                  ? 'text-gray-300'
                                  : 'text-gray-900 hover:border-indigo-500 hover:text-indigo-500'
                                }`}
                            >
                              {t('CatalogHome_Next')}
                              <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                            </button>
                          </Scrollink>
                        </div>
                      </nav>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          {/* </section> */}
        </main>
      </div>
    </div>
  )
}