import { Fragment, SetStateAction, useEffect, useState } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon, UserIcon, HeartIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { AuthReducerActionType, IAuthReducerState } from "../../store/accounts/AuthReducer.ts";
import { IMainCategory } from '../../interfaces/Category/Main-Category/IMainCategory.ts';
import DropdownUser from './navbarsPages/dropdownUser/DropdownUser.tsx';
import { BagReducerActionType, IBagReducerState } from '../../store/bag/BagReducer.tsx';
import { getMainCategories } from '../../services/category/category-services.ts';
import { getCountBagByEmail } from '../../services/bag/bag-services.ts';
import { RootState } from '../../store/store.ts';
import { FavoritesReducerActionType } from '../../store/favourites/FavoritesReducer.ts';
import { IUserProfile } from '../../interfaces/Auth/IUserProfile.ts';
import { getUserData } from '../../services/accounts/account-services.ts';
import LanguageSelector from './navbarsPages/language/LanguageSelector.tsx';
import { CardReducerActionType } from '../../store/bag/CardReducer.tsx';
import classNames from 'classnames';
import { getLocalizedField } from '../../utils/localized/localized.ts';
import { useTranslation } from 'react-i18next';
import { useCollections } from '../../data/collectionsList.tsx';
import { OrderReducerActionType } from '../../store/order/OrderReducer.ts';

const NavbarsPage = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
    const { count } = useSelector((redux: any) => redux.bag as IBagReducerState);
    const [categoryList, setCategoryList] = useState<IMainCategory[]>([]);
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch();
    const favoriteCount = useSelector((state: RootState) => state.favorites.count);
    const [userProfile, setUserProfile] = useState<IUserProfile>();
    const [viewSearch, setViewSearch] = useState('hidden');
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const collections = useCollections();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user?.Email || user?.PhoneNumber) {
                    const email = user?.Email || null;
                    const phone = user?.PhoneNumber || null;
                    if (email) {
                        getCountBagByEmail(email, dispatch);
                    } 
                    const data = await getUserData(email, phone);
                    setUserProfile(data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
    
        fetchUserData();
        // if (user?.Email) {
        //     getCountBagByEmail(user?.Email, dispatch);
        //     getUserData(user.Email)
        //         .then(data => setUserProfile(data))
        //         .catch(error => console.error('Error fetching user data:', error));
        // }
        // else
        // {
        //     getUserData(null, user?.PhoneNumber)
        //         .then(data => setUserProfile(data))
        //         .catch(error => console.error('Error fetching user data:', error));
        // }
    }, [count, user]);

    useEffect(() => {
        getMainCategories()
            .then((data: SetStateAction<IMainCategory[]>) => setCategoryList(data))
            .catch(error => console.error('Error fetching categories data:', error));

    }, []);

    const handleLogout = () => {
        try {
        localStorage.removeItem("token");
        dispatch({ type: AuthReducerActionType.LOGOUT_USER });
        dispatch({ type: BagReducerActionType.DELETE_BAG_ALL });
        dispatch({ type: CardReducerActionType.DELETE_CARD_ALL, });
        dispatch({ type: FavoritesReducerActionType.DELETE_FAVORITES_ALL });
        dispatch({ type: OrderReducerActionType.DELETE_ORDER_COUNT, });
        setUserProfile(undefined);
    } catch (error) {
        console.error("Error during logout:", error);
    }
    };

    const changeVisibleSearch = () => {
        setViewSearch(prevMode => (prevMode === 'show' ? 'hidden' : 'show'));
    }

    const handaleSearch = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            if (searchValue.trim() !== "") {
                const formattedSearchValue = searchValue.replace(/ /g, "_");
                changeVisibleSearch();
                navigate(`catalog-home/search/${formattedSearchValue}`)
            }
            else if (searchValue.trim() === "") {
                changeVisibleSearch();
                navigate(`catalog-home`)
            }
        }
    }

    return (
        <div className="bg-gray-100 text-body ">
            <nav className="your-navigation-styles z-10 relative">
                {/* Mobile menu */}
                <Transition.Root show={open} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
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
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-gray-100 pb-12 shadow-xl">
                                    <div className="flex px-4 pb-2 pt-5">
                                        <button
                                            type="button"
                                            className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                                            onClick={() => setOpen(false)}
                                        >
                                            <span className="absolute -inset-0.5" />
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    {/* Links */}
                                    <Tab.Group as="div" className="mt-2">
                                        <div className="border-b border-gray-200">
                                            <Tab.List className="-mb-px flex space-x-8 px-4">
                                                {categoryList.map((category) => (
                                                    <Tab
                                                        key={category.name_en}
                                                        className={({ selected }) =>
                                                            classNames(
                                                                selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-900',
                                                                'flex-1 whitespace-nowrap border-b px-1 py-4 text-base font-medium'
                                                            )
                                                        }
                                                    >
                                                        {getLocalizedField(category, 'name', lang)}
                                                    </Tab>
                                                ))}
                                            </Tab.List>
                                        </div>
                                        <Tab.Panels as={Fragment}>
                                            {categoryList.map((category) => (
                                                <Tab.Panel key={category.name_en} className="space-y-10 px-4 pb-8 pt-10">
                                                    <div className="grid grid-cols-2 gap-x-4">
                                                        {/* {category.map((item) => (
                                                        <div key={item.name} className="group relative text-sm">
                                                            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                                                <img src={item.imageSrc} alt={item.imageAlt} className="object-cover object-center" />
                                                            </div>
                                                            <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                                                <span className="absolute inset-0 z-10" aria-hidden="true" />
                                                                {item.name}
                                                            </a>
                                                            <p aria-hidden="true" className="mt-1">
                                                                Shop now
                                                            </p>
                                                        </div>
                                                    ))} */}
                                                    </div>
                                                    {category.subCategories.map((section) => (
                                                        <div key={section.name_en}>
                                                            <Link id={`${category.id}-${section.id}-heading-mobile`} to={`/catalog/${section.urlName}`} onClick={() => close()} className="font-bold text-gray-900">
                                                                {getLocalizedField(section, 'name', lang)}
                                                            </Link>
                                                            <ul
                                                                role="list"
                                                                aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                                                                className="mt-6 flex flex-col space-y-6"
                                                            >
                                                                {section.categories.map((item) => (
                                                                    <li key={item.name_en} className="flow-root">
                                                                        <Link to={`/catalog/${section.urlName}/${item.urlName}`} onClick={() => setOpen(false)}>
                                                                            {getLocalizedField(item, 'name', lang)}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </Tab.Panel>
                                            ))}
                                        </Tab.Panels>
                                    </Tab.Group>

                                    <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                        <Link to={"/store-locations"}
                                              className="flex items-center -mb-px text-sm font-medium text-gray-700 hover:text-indigo-500"
                                        >
                                            {t('Navbars_Store')}
                                        </Link>
                                    </div>
                                    {isAuth ? (
                                        <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                            <div className="flow-root">
                                                <div className="-m-2 block p-2 font-medium text-gray-900">
                                                    <Link to={"/"} onClick={() => { handleLogout(); setOpen(false); }}>Logout ({user?.Email})</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                            <div className="flow-root">
                                                <div className="-m-2 block p-2 font-medium text-gray-900">
                                                    <Link to={"/login"} onClick={() => setOpen(false)}>Sign in</Link>
                                                </div>
                                            </div>
                                            <div className="flow-root">
                                                <div className="-m-2 block p-2 font-medium text-gray-900">
                                                    <Link to={"/register"} onClick={() => setOpen(false)}>Create account</Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 px-4 py-6">
                                        <a href="#" className="-m-2 flex items-center p-2">
                                            <img
                                                src="../images/usa.webp"
                                                alt=""
                                                className="block h-auto w-5 flex-shrink-0"
                                            />
                                            <span className="ml-3 block text-base font-medium text-gray-900">USA</span>
                                            <span className="sr-only"> change currency</span>
                                        </a>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <header className="relative bg-gray-100 mx-auto max-w-screen-2xl px-2 sm:px-2 lg:px-2">
                    <div className=" items-baseline justify-between border-b border-gray-200 pb-2 pt-2">

                        <nav aria-label="Top" className="mx-auto max-w-screen-2xl px-2 sm:px-2 lg:px-2 ">
                            <div>
                                <div className="flex items-center h-16">
                                    <button
                                        type="button"
                                        className="relative rounded-md bg-gray-100 p-2 text-gray-400 lg:hidden"
                                        onClick={() => setOpen(true)}
                                    >
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open menu</span>
                                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                                    </button>

                                    {/* Flyout menus */}
                                    <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                                        <div className="flex h-full space-x-8 ">
                                            {categoryList.map((category) => (
                                                <Popover key={category.name_en} className="flex">
                                                    {({ open }) => (
                                                        <>
                                                            <div className="relative flex">
                                                                <Popover.Button
                                                                    className={classNames(
                                                                        open
                                                                            ? 'border-indigo-600 text-indigo-600 hover:text-indigo-500'
                                                                            : 'border-transparent text-gray-700 hover:text-gray-800 hover:text-indigo-500',
                                                                        'relative z-10 -mb-px flex items-center pt-px text-sm font-medium transition-colors duration-200 ease-out hover:text-indigo-500'
                                                                    )}
                                                                >
                                                                    {getLocalizedField(category, 'name', lang)}
                                                                </Popover.Button>
                                                            </div>

                                                            <Transition
                                                                as={Fragment}
                                                                enter="transition ease-out duration-200"
                                                                enterFrom="opacity-0"
                                                                enterTo="opacity-100"
                                                                leave="transition ease-in duration-150"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                                                                    {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                                                    <div className="absolute inset-0 top-1/2 bg-gray-100 shadow" aria-hidden="true" />

                                                                    <div className="relative bg-gray-100">
                                                                        <div className="mx-auto max-w-screen-2xl px-8">
                                                                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                                                                <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                                                                    {collections.map((item) => (
                                                                                        item.gender === category.name_en && (
                                                                                            <div key={item.id} className="group relative text-base sm:text-sm">
                                                                                                <Popover.Panel>
                                                                                                    {({ close }) => (
                                                                                                        <Link to={item.href} className='hover:text-indigo-500' onClick={() => close()}>
                                                                                                            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                                                                                                <img
                                                                                                                    src={item.imageSrc}
                                                                                                                    alt={item.imageAlt}
                                                                                                                    className="object-cover object-center"
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="mt-5 block text-center">
                                                                                                                {item.name}
                                                                                                            </div>
                                                                                                        </Link>
                                                                                                    )}
                                                                                                </Popover.Panel>
                                                                                            </div>
                                                                                        )
                                                                                    ))}
                                                                                </div>
                                                                                <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                                                                    {category.subCategories.map((section) => (

                                                                                        <div key={section.name_en}>
                                                                                            <Popover.Panel className="transform transition-transform duration-300 hover:scale-110 origin-left">
                                                                                                {({ close }) => (
                                                                                                    <Link id={`${section.name_en}-heading`} to={`/catalog/${section.urlName}`} onClick={() => close()} className="font-bold text-gray-900 hover:text-indigo-500">
                                                                                                        {getLocalizedField(section, 'name', lang)}
                                                                                                    </Link>
                                                                                                )}
                                                                                            </Popover.Panel>
                                                                                            <ul
                                                                                                role="list"
                                                                                                aria-labelledby={`${section.name_en}-heading`}
                                                                                                className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                                                                            >
                                                                                                {section.categories.map((item) => (
                                                                                                    <li key={item.name_en} className="flex hover:text-indigo-500 transform transition-transform duration-300 hover:scale-110 origin-left">
                                                                                                        <Popover.Panel>
                                                                                                            {({ close }) => (
                                                                                                                <Link to={`/catalog/${section.urlName}/${item.urlName}`} onClick={() => close()}>
                                                                                                                    {getLocalizedField(item, 'name', lang)}
                                                                                                                </Link>
                                                                                                            )}
                                                                                                        </Popover.Panel>
                                                                                                    </li>
                                                                                                ))}
                                                                                            </ul>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Popover.Panel>
                                                            </Transition>
                                                        </>
                                                    )}
                                                </Popover>
                                            ))}

                                            <Link to={"/store-locations"}
                                                  className="flex items-center -mb-px text-sm font-medium text-gray-700 hover:text-indigo-500"
                                            >
                                                {t('Navbars_Store')}
                                            </Link>
                                        </div>
                                    </Popover.Group>

                                    <div className="ml-auto flex items-center">
                                        {/* Search */}
                                        {viewSearch !== 'hidden' && (
                                            <>
                                                <div className="ml-4 flex-grow w-96">
                                                    <form className="flex w-full lg:ml-0"
                                                    >
                                                        <label htmlFor="mobile-search-field" className="sr-only">
                                                            Search
                                                        </label>
                                                        <label htmlFor="desktop-search-field" className="sr-only">
                                                            Search
                                                        </label>
                                                        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                                                                <MagnifyingGlassIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                                            </div>
                                                            <input
                                                                name="mobile-search-field"
                                                                id="mobile-search-field"
                                                                className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 focus:border-transparent focus:outline-none focus:ring-0 focus:placeholder:text-gray-400 sm:hidden"
                                                                placeholder={t('Navbars_SearchProducts')}
                                                                type="search"
                                                                onChange={(e) => setSearchValue(e.target.value)}
                                                                onKeyDown={handaleSearch}
                                                            />
                                                            <input
                                                                name="desktop-search-field"
                                                                id="desktop-search-field"
                                                                className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-0 focus:placeholder:text-gray-400 sm:block"
                                                                placeholder={t('Navbars_SearchProducts')}
                                                                type="search"
                                                                onChange={(e) => setSearchValue(e.target.value)}
                                                                onKeyDown={handaleSearch}
                                                            />
                                                        </div>
                                                        <a onClick={changeVisibleSearch} className="p-2 group text-gray-400 hover:text-gray-500 cursor-pointer">
                                                            <XMarkIcon className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 mr-2" aria-hidden="true" />
                                                        </a>
                                                    </form>
                                                </div>
                                            </>
                                        )}

                                        {viewSearch === 'hidden' && (
                                            <>
                                                <div className="lg:ml-8 lg:flex border-r pr-5">
                                                    <LanguageSelector />
                                                </div>
                                                {isAuth ? (
                                                    <>
                                                        <div className="lg:flex pl-5">
                                                            <DropdownUser />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="ml-4 flow-root lg:ml-6">
                                                        <Link className="group -m-2 p-2 text-gray-400 hover:text-gray-500" to={"/auth"} >
                                                            <UserIcon className="h-6 w-6" aria-hidden="true" />
                                                        </Link>
                                                    </div>
                                                )}

                                                {/* Bonuses */}
                                                {isAuth ? (
                                                    <div className="ml-4 flow-root hidden lg:flex lg:ml-6">
                                                        <Link to={"/account/bonuses"} className={`group -m-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 w-10 flex items-center hover:text-gray-500 ${user ? "mr-12" : "mr-2"}`}>
                                                            <CurrencyDollarIcon className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 mr-2" aria-hidden="true" />
                                                            {user ? userProfile?.bonusBalance?.toLocaleString('uk-UA', { minimumFractionDigits: 3 }).slice(0, -1) : 0}</Link>
                                                    </div>
                                                ) : (null)}

                                                {/* Search */}
                                                <div className="ml-4 flow-root lg:ml-6">
                                                    <a onClick={changeVisibleSearch} className="p-2 group text-gray-400 hover:text-gray-500 cursor-pointer">
                                                        <div className="sr-only">Search</div>
                                                        <MagnifyingGlassIcon className={`h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 ${isAuth ? "mr-2" : ""}`}  aria-hidden="true" />
                                                    </a>
                                                </div>

                                                {/* Favorites */}
                                                {isAuth ? (
                                                    <div className="ml-4 flow-root lg:ml-6">
                                                        <Link to={"/account/favorites"} className="group -m-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 w-10 flex items-center hover:text-gray-500">
                                                            <HeartIcon className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 mr-2" aria-hidden="true" />
                                                            {favoriteCount}</Link>
                                                    </div>
                                                ) : (null)}

                                                {/* Cart */}
                                                <div className="ml-4 flow-root lg:ml-6">
                                                    <Link to={"/bag"} className="group -m-2 ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 w-20 flex items-center hover:text-gray-500">
                                                        <ShoppingBagIcon className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 mr-2" aria-hidden="true" />
                                                        {count}</Link>
                                                    <div className="sr-only">items in cart, view bag</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </header >
            </nav >
        </div >
    )
}
export default NavbarsPage;