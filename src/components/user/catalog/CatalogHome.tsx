import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Popover, Transition } from '@headlessui/react'
import { ArrowLongLeftIcon, ArrowLongRightIcon, XMarkIcon, HeartIcon as OutlineHeartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { HeartIcon } from '@heroicons/react/24/solid'
import { IProduct, IStorages } from '../../../interfaces/Product/IProduct'
import { APP_ENV } from '../../../env/config'
import { useNavigate, useParams } from 'react-router-dom'
import { IInfo } from '../../../interfaces/Info/IInfo'
import { createQueryParams, onPageChangeQueryParams, onSortChangeQueryParams, updateFilters } from '../../../utils/catalog/filterUtils'
import { ISortOptions } from '../../../interfaces/Catalog/ISortOptions'
import qs, { ParsedQs } from 'qs'
import { getProductsist, getQuantityProducts } from '../../../services/product/product-services'
import { getInfoList } from '../../../services/info/info-services'
import ProductQuickview from '../product/ProductQuickview'
import { getMainCategories } from '../../../services/category/category-services'
import { addFavoriteProduct, removeFavoriteProduct } from '../../../services/userFavoriteProducts/user-favorite-products-services'
import { IAuthReducerState } from '../../../store/accounts/AuthReducer'
import { useDispatch, useSelector } from 'react-redux'
import { addToFavorite, removeFromFavorite } from '../../../store/favourites/FavoritesReducer'
import { RootState } from '../../../store/store'
import { IFavoriteProducts } from '../../../interfaces/FavoriteProducts/IFavoriteProducts'
import i18next, { t } from "i18next";
import { getLocalizedField, transformToOptions } from '../../../utils/localized/localized'
import { useTranslation } from 'react-i18next'
import { Link as Scrollink } from 'react-scroll'
import classNames from 'classnames'
import Loader from '../../../common/Loader/loader'
import SimpleCarousel from '../../../ui/carousel/SimpleCarousel'

export default function CatalogHome() {
    const initialSortOptions: ISortOptions[] = [
        { name: t('Sort_Newest'), url: 'newest', current: false },
        { name: t('Sort_Popular'), url: 'most_popular', current: false },
        { name: t('Sort_Rating'), url: 'best_rating', current: false },
        { name: t('Sort_LowToHigh'), url: 'price_low_to_high', current: false },
        { name: t('Sort_HighToLow'), url: 'price_high_to_low', current: false },
    ];
    const { i18n } = useTranslation();
    const lang = i18n.language;
    const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
    const favoriteProducts = useSelector((state: RootState) => state.favorites.favoriteProducts);
    const isFavorite = (productId: number) => favoriteProducts.some((product: { productId: number }) => product.productId === productId);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const baseUrl = APP_ENV.BASE_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { gender } = useParams();
    const { text } = useParams();
    const [productList, setProduct] = useState<IProduct[]>([]);
    const [filterOptionsList, setFilterOptionsList] = useState<IInfo[]>([]);
    const [filters, setFilters] = useState<{ name: string; values: string[] }[]>([]);
    const [itemsPerPage] = useState<number>(12);
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
    const [subCategoryIndex, setSubCategoryIndex] = useState(0);
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

    const filterValueCounts = filterOptionsList.map((section) =>
        filters.reduce((count, filter) => {
            if (filter.name === section.value) {
                count += filter.values.length;
            }
            return count;
        }, 0)
    );

    if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    };

    const onSortModeChange = (selectedOption: ISortOptions) => {
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

    const getFilterCategory = async (): Promise<any[]> => {
        const urls: any[] = [];
        const newFilters = parseUrlQuery();
        for (let i = 0; i < subCategoryIndex; i++) {
            const categoryKey = `category-${i + 1}`;
            const urlValue = newFilters.find(f => f.name === categoryKey)?.values;
            if (urlValue) {
                urls.push(urlValue);
            }
        }
        return urls;
    };

    const getInfo = async () => {
        try {
            setFilterOptionsList([]);

            // Витягування категорій і фільтрів з бази даних
            const mainCategories = await getMainCategories();

            // Фільтруємо категорії за gender, якщо він є, або використовуємо всі категорії
            setFilterOptionsList(prevFilters => {
                const filteredCategories = gender
                    ? mainCategories.filter(mainCategory => mainCategory.urlName === gender)
                    : mainCategories;

                const subCategoryWithOptions: IInfo[] = [];

                filteredCategories.forEach(mainCategory => {
                    mainCategory.subCategories.forEach((subCategory, index) => {
                        const options = subCategory.categories.map(category => ({
                            id: category.id.toString(),
                            label: (() => {
                                switch (i18next.language) {
                                    case 'uk':
                                        return category.name_uk;
                                    case 'en':
                                        return category.name_en;
                                    case 'es':
                                        return category.name_es;
                                    case 'fr':
                                        return category.name_fr;
                                    default:
                                        return category.name_en; // Fallback на англійську мову
                                }
                            })(),
                            value: category.urlName
                        }));

                        subCategoryWithOptions.push({
                            id: subCategory.id.toString(),
                            name_en: subCategory.name_en,
                            name_es: subCategory.name_es,
                            name_fr: subCategory.name_fr,
                            name_uk: subCategory.name_uk,
                            value: `category-${index + 1}`,
                            options: options
                        });
                    });

                    setSubCategoryIndex(mainCategory.subCategories.length);
                    setCategoriesLoaded(true);
                    return [...prevFilters, ...subCategoryWithOptions];
                });

                return [...prevFilters, ...subCategoryWithOptions];
            });

            // Отримання і трансформація додаткових даних
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

    const loadFromURL = async () => {
        try {
            // створення і відправка даних на сервер
            const newFilters = parseUrlQuery();
            setFilters(newFilters);

            const filterDTO: IFilterDTO = {
                Size: newFilters.find(f => f.name === 'size')?.values || undefined,
                Material: newFilters.find(f => f.name === 'material')?.values || undefined,
                Color: newFilters.find(f => f.name === 'color')?.values || undefined,
                Season: newFilters.find(f => f.name === 'season')?.values || undefined,
                ItemsPerPage: newFilters.find(f => f.name === 'ItemsPerPage')?.values || itemsPerPage,
                Sort: newFilters.find(f => f.name === 'Sort')?.values?.join('_') || undefined,
                Page: newFilters.find(f => f.name === 'Page')?.values || page,
                Search: text || '',
                Language: lang,
                MainCategory: gender,
                SubName: newFilters.find(f => f.name === 'SubName')?.values || undefined,
                UrlName: await getFilterCategory(),
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

    useEffect(() => {
        setPage(1);
        getInfo();
    }, [gender]);

    useEffect(() => {
        loadFromURL().then(() => {
            setLoading(false);
        });
        setSearchValue(text?.replace(/_/g, " ") || '');
    }, [categoriesLoaded, location.search, page, itemsPerPage, text, gender]);

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

    const handaleSearch = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            if (searchValue.trim() !== "") {
                const formattedSearchValue = searchValue.replace(/ /g, "_");
                navigate(`/catalog-home/search/${formattedSearchValue}`)
            }
            else if (searchValue.trim() === "") {
                navigate(`/catalog-home`)
            }
        }
    }

    return (
        <div className="bg-gray-100">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 sm:hidden" onClose={setMobileFiltersOpen}>
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
                                        <h2 className="text-lg font-medium text-gray-900">{t('CatalogHome_Filters')}</h2>
                                        <button
                                            type="button"
                                            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 p-2 text-gray-400"
                                            onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    {/* Filters */}
                                    <form className="mt-4">
                                        {filterOptionsList.map((section) => (
                                            <Disclosure as="div" key={section.name_en} className="border-t border-gray-200 px-4 py-6">
                                                {({ open }) => (
                                                    <>
                                                        <h3 className="-mx-2 -my-3 flow-root">
                                                            <Disclosure.Button className="flex w-full items-center justify-between bg-gray-100 px-2 py-3 text-sm text-gray-400">
                                                                <span className="font-medium text-gray-900 hover:text-indigo-500">
                                                                    {getLocalizedField(section, 'name', lang)}
                                                                </span>
                                                                <span className="ml-6 flex items-center">
                                                                    <ChevronDownIcon
                                                                        className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                                                        aria-hidden="true"
                                                                    />
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
                                                                            defaultValue={option.value}
                                                                            type="checkbox"
                                                                            checked={filters.some((filter) => filter.name === section.value && filter.values.includes(option.value))}
                                                                            onChange={() => {
                                                                                createFilters(section.value, option.value);
                                                                            }}
                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                                            className="ml-3 text-sm text-gray-500 hover:text-indigo-500 cursor-pointer"
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

                <main>
                    <div className="bg-gray-100 product-start">
                        <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
                            <div className="flex flex-col lg:flex-row">
                                <div className="lg:mr-4 w-full lg:w-2/4 lg:border-r">
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">ESTRO</h1>
                                    <p className="mt-4 max-w-xl text-sm text-gray-700">
                                        {t('CatalogHome_EstroDescription')}
                                    </p>
                                </div>
                                <div className="lg:ml-4 mt-8 lg:mt-0 w-full lg:w-2/4 ">
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 uppercase">{t('CatalogHome_Search')}</h1>
                                    <div className="mt-4 flex-grow w-96">
                                        <form className="flex w-full lg:ml-0"
                                        >
                                            <label htmlFor="mobile-search-field" className="sr-only">
                                                {t('CatalogHome_Search')}
                                            </label>
                                            <label htmlFor="desktop-search-field" className="sr-only">
                                                {t('CatalogHome_Search')}
                                            </label>
                                            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                                                    <MagnifyingGlassIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                                </div>
                                                <input
                                                    name="mobile-search-field"
                                                    id="mobile-search-field"
                                                    className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 focus:border-transparent focus:outline-none focus:ring-0 focus:placeholder:text-gray-400 sm:hidden"
                                                    placeholder="Search"
                                                    type="search"
                                                    value={searchValue}
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                    onKeyDown={handaleSearch}
                                                />
                                                <input
                                                    name="desktop-search-field"
                                                    id="desktop-search-field"
                                                    className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-0 focus:placeholder:text-gray-400 sm:block"
                                                    placeholder={t('CatalogHome_SearchProducts')}
                                                    type="search"
                                                    value={searchValue}
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                    onKeyDown={handaleSearch}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <section aria-labelledby="filter-heading">
                        <h2 id="filter-heading" className="sr-only">
                            {t('CatalogHome_Filters')}
                        </h2>

                        <div className="relative mx-auto max-w-screen-2xl border-b border-gray-200 bg-gray-100 pb-4">
                            <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-indigo-500">
                                            {activeSortOption ? activeSortOption.name : t('CatalogHome_Sort')}
                                            <ChevronDownIcon
                                                className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
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
                                        <Menu.Items className="cursor-pointer absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-gray-100 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                                                                {option.name}
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>

                                <button
                                    type="button"
                                    className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 hover:text-indigo-500 sm:hidden"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    {t('CatalogHome_Filters')}
                                </button>

                                <div className="hidden sm:block">
                                    <div className="flow-root">
                                        <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
                                            {filterOptionsList.map((section, index) => (

                                                <Popover key={section.name_en} className="relative inline-block px-4 text-left">
                                                    <Popover.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-indigo-500">
                                                        <span>
                                                            {getLocalizedField(section, 'name', lang)}
                                                        </span>
                                                        {filterValueCounts[index] > 0 && (
                                                            <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                                                                {filterValueCounts[index]}
                                                            </span>
                                                        )}

                                                        <ChevronDownIcon
                                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                            aria-hidden="true"
                                                        />
                                                    </Popover.Button>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-gray-100 p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            <form className="space-y-4">
                                                                {section.options?.map((option, optionIdx) => (
                                                                    <div key={option.value} className="flex items-center">
                                                                        <input
                                                                            id={`filter-${section.id}-${optionIdx}`}
                                                                            name={`${section.id}[]`}
                                                                            defaultValue={option.value}
                                                                            type="checkbox"
                                                                            checked={filters.some((filter) => filter.name === section.value && filter.values.includes(option.value))}
                                                                            onChange={() => {
                                                                                createFilters(section.value, option.value);
                                                                            }}
                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                            className="cursor-pointer ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900 hover:text-indigo-500"
                                                                        >
                                                                            {option.label}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </form>
                                                        </Popover.Panel>
                                                    </Transition>
                                                </Popover>

                                            ))}

                                        </Popover.Group>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active filters */}
                        <div className="bg-gray-100">
                            <div className="mx-auto max-w-screen-2xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
                                <h3 className="text-sm font-medium text-gray-500">
                                    {t('CatalogHome_Filters')}
                                    <span className="sr-only">, active</span>
                                </h3>
                                <div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />
                                <div className="mt-2 sm:ml-4 sm:mt-0">
                                    <div className="-m-1 flex flex-wrap items-center">
                                        {filterOptionsList.map((section) =>
                                            section.options?.map((option, optionIdx) => {
                                                const isFilterApplied = filters.some(filter => filter.name === section.value && filter.values.includes(option.value));
                                                if (isFilterApplied) {
                                                    return (
                                                        <span
                                                            key={optionIdx}
                                                            className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-gray-100 py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                                                            <span>{option.label}</span>
                                                            <div
                                                                className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500">
                                                                <span className="sr-only">Remove filter for {option.label}</span>
                                                                <button onClick={() => { createFilters(section.value, option.value); }}>
                                                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })
                                        )}
                                    </div>
                                </div>
                                <div className=" m-1 inline-flex items-center rounded-full border border-gray-200 bg-gray-100 py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                                    <button type="button" onClick={resetFilters} className="text-gray-800 hover:text-indigo-500 w-20">
                                        {t('CatalogHome_FiltersClear')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Product grid */}
                    <section
                        aria-labelledby="products-heading"
                        className="relative mx-auto max-w-2xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:max-w-screen-2xl lg:px-8">
                        <h2 id="products-heading" className="sr-only">Products</h2>
                        <div className="min-h-[662px] grid grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-5">
                            {loading ? (
                                <Loader />
                            ) : (
                                productList.map((product) => (
                                    <div key={product.id} className="group relative">
                                        {/* <Link to={`/product/${product.id}`} className="group"> */}
                                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7  hover13">
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
                                        {/* </Link> */}
                                        <h3 className="mt-4 text-sm text-gray-700 line-clamp-2 break-words ">{getLocalizedField(product, 'name', lang).split(' ').slice(0, 3).join(' ')}</h3>
                                        <p className="mt-1 text-xs text-gray-500">{product.article}</p>
                                        <p className="mt-1 text-xs text-gray-500">{getLocalizedField(product, 'season', lang)}</p>
                                        <p className="mt-1 text-lg font-medium text-red-900">{product.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} €</p>
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

                                        {/* <div className="flex items-end pt-2 opacity-0 group-hover:opacity-100" aria-hidden="true">
                                        </div> */}
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
                        <div className="container mx-auto mt-20 p-4 flex relative max-w-screen-2xl lg:flex-row justify-center">
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
                    </section>
                </main>
            </div>
        </div>
    )
}