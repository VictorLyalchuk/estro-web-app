import { Fragment, useEffect, useState } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AuthReducerActionType, IAuthReducerState } from '../../../store/accounts/AuthReducer'
import { APP_ENV } from '../../../env/config'
import { BagReducerActionType } from '../../../store/bag/BagReducer'
import { CardReducerActionType } from '../../../store/bag/CardReducer'
import { FavoritesReducerActionType } from '../../../store/favourites/FavoritesReducer'
import { IOrderReducerState, OrderReducerActionType } from '../../../store/order/OrderReducer'
import { getOrderQuantity } from '../../../services/order/order-services'

export default function AdminHeader() {
    const baseUrl = APP_ENV.BASE_URL;
    const { t } = useTranslation();
    const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
    const { countOrder } = useSelector((redux: any) => redux.orders as IOrderReducerState);
    const [searchValue, setSearchValue] = useState('');
    const [step] = useState<number[]>([0]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const navigation = [
        { name: t('Admin_Home'), link: '/admin/admin-panel-page', current: false },
        { name: t('Products_Products'), link: '/admin/product/product-list', current: false },
        { name: t('Main_Category'), link: '/admin/main-category/main-category-list', current: false },
        { name: t('Sub_Category'), link: '/admin/sub-category/sub-category-list', current: false },
        { name: t('Category'), link: '/admin/category/category-list', current: false },
        { name: t('User_Users'), link: '/admin/user/user-list', current: false },
        { name: t('Stores'), link: '/admin/store/store-list', current: false },
        { name: t('Reviews'), link: '/admin/review/review-list', current: false },
    ]

    const userNavigation = [
        { name: t('Admin_Your_Profile'), to: '/account/profile' },
        { name: t('Admin_Settings'), to: '/account/settings' },
        { name: t('Admin_Sign_out'), to: '/', action: 'logout' },
    ]

    useEffect(() => {
        const getQuantity = async () => {
            try {
                const quantity = await getOrderQuantity(step);
                dispatch({
                    type: OrderReducerActionType.ORDER_COUNT,
                    payload: {
                        countOrder: quantity,
                    }
                });
            } catch (error) {
                console.error('Failed to fetch order quantity:', error);
            }
        };

        getQuantity();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch({ type: AuthReducerActionType.LOGOUT_USER, });
        dispatch({ type: BagReducerActionType.DELETE_BAG_ALL, });
        dispatch({ type: CardReducerActionType.DELETE_CARD_ALL, });
        dispatch({ type: FavoritesReducerActionType.DELETE_FAVORITES_ALL, });
        dispatch({ type: OrderReducerActionType.DELETE_ORDER_COUNT, });
    };

    const handaleSearch = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            if (searchValue.trim() !== "") {
                const formattedSearchValue = searchValue.replace(/ /g, "_");
                navigate(`product/product-list/search/${formattedSearchValue}`)
            }
            else if (searchValue.trim() === "") {
                navigate(`product/product-list`)
            }
        }
    }

    return (
        <div className="min-h-full">
            <Popover as="header" className="bg-gradient-to-r pb-24 bg-white-container-header">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-screen-2xl lg:px-8">
                            <div className="relative flex flex-wrap items-center justify-center lg:justify-between">
                                {/* Logo */}
                                <div className="absolute left-0 flex-shrink-0 py-5 lg:static hidden lg:block">
                                    <Link to="/" >
                                        <h1 className="text-neon text-white text-9xl mb-1 mt-2 hover:text-indigo-300">estro</h1>
                                        <p className="text-neon text-white text-sx mb-2 hover:text-indigo-100">{t('Logo_Paragraph')}</p>
                                    </Link>
                                </div>

                                {/* Right section on desktop */}
                                <div className="hidden lg:ml-4 lg:flex lg:items-center lg:py-5 lg:pr-0.5">
                                    <Link
                                        to="/admin/orders/placed-orders"
                                        className="relative flex-shrink-0 rounded-full p-1 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">{t('Admin_View_notifications')}</span>
                                        <BellIcon className="h-7 w-7" aria-hidden="true" />
                                        {countOrder > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {countOrder}
                                            </span>
                                        )}
                                    </Link>


                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                                        <div>
                                            <Menu.Button className="relative flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">{t('Admin_Open_user_menu')}</span>
                                                <img className="h-8 w-8 rounded-full" src={`${baseUrl}/uploads/${user?.ImagePath || "user404.webp"}`} alt="" />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {userNavigation.map((item) => (
                                                    <Menu.Item key={item.name}>
                                                        {({ active }) => (
                                                            item.action === 'logout' ? (
                                                                <Link
                                                                    to={item.to}
                                                                    onClick={handleLogout}
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100' : '',
                                                                        'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                                                                    )}
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            ) : (
                                                                <Link
                                                                    to={item.to}
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100' : '',
                                                                        'block px-4 py-2 text-sm text-gray-700'
                                                                    )}
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            )
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>

                                <div className="w-full py-5 lg:border-t lg:border-white lg:border-opacity-20">
                                    <div className="lg:grid lg:grid-cols-3 lg:items-center lg:gap-8">
                                        {/* Left nav */}
                                        <div className="hidden lg:col-span-2 lg:block">
                                            <nav className="flex space-x-4">
                                                {navigation.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.link}
                                                        className={classNames(
                                                            'text-white rounded-md bg-white bg-opacity-0 px-3 py-2 text-sm font-medium hover:bg-opacity-10'
                                                        )}
                                                        aria-current={item.current ? 'page' : undefined}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </nav>
                                        </div>
                                        <div className="px-12 lg:px-0">
                                            {/* Search */}
                                            <div className="mx-auto w-full max-w-xs lg:max-w-md">
                                                <label htmlFor="search" className="sr-only">
                                                    {t('Admin_Search')}
                                                </label>
                                                <div className="relative text-white focus-within:text-gray-600">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                                                    </div>
                                                    <input
                                                        id="search"
                                                        className="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                                                        placeholder={t('Admin_Search')}
                                                        type="search"
                                                        name="search"
                                                        onChange={(e) => setSearchValue(e.target.value)}
                                                        onKeyDown={handaleSearch}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu button */}
                                <div className="absolute right-0 flex-shrink-0 lg:hidden">
                                    {/* Mobile menu button */}
                                    <Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">{t('Admin_Open_main_menu')}</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Popover.Button>
                                </div>
                            </div>
                        </div>

                        <Transition.Root as={Fragment}>
                            <div className="lg:hidden">
                                <Transition.Child
                                    as={Fragment}
                                    enter="duration-150 ease-out"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="duration-150 ease-in"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Popover.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-25" />
                                </Transition.Child>

                                <Transition.Child
                                    as={Fragment}
                                    enter="duration-150 ease-out"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="duration-150 ease-in"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Popover.Panel
                                        focus
                                        className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition"
                                    >
                                        <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="pb-2 pt-3">
                                                <div className="flex items-center justify-between px-4 border-b lg:border-white lg:border-opacity-20">
                                                    <div>
                                                        <Link to="/" className="h-8 w-auto">
                                                            <h1 className=" text-4xl mb-1 mt-2 text-gray-900 hover:text-indigo-300">estro</h1>
                                                            <p className=" text-sx mb-2 text-gray-900 hover:text-indigo-300">{t('Logo_Paragraph')}</p>
                                                        </Link>
                                                    </div>
                                                    <div className="-mr-2">
                                                        <Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                                            <span className="absolute -inset-0.5" />
                                                            <span className="sr-only">{t('Admin_Close_menu')}</span>
                                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                        </Popover.Button>
                                                    </div>
                                                </div>
                                                <div className="mt-3 space-y-1 px-2">
                                                    {navigation.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            to={item.link}
                                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="pb-2 pt-4">
                                                <div className="flex items-center px-5">
                                                    <div className="flex-shrink-0">
                                                        <img className="h-10 w-10 rounded-full" src={`${baseUrl}/uploads/${user?.ImagePath || "user404.webp"}`} alt="" />
                                                    </div>
                                                    <div className="ml-3 min-w-0 flex-1">
                                                        <div className="truncate text-base font-medium text-gray-800">{user?.FirstName} {user?.LastName}</div>
                                                        <div className="truncate text-sm font-medium text-gray-500">{user?.Email}</div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                    >
                                                        <span className="absolute -inset-1.5" />
                                                        <span className="sr-only">{t('Admin_View_notifications')}</span>
                                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                                <div className="mt-3 space-y-1 px-2">
                                                    {userNavigation.map((item) => (
                                                        item.action === 'logout' ? (
                                                            <Link
                                                                to={item.to}
                                                                key={item.name}
                                                                onClick={handleLogout}
                                                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800 w-full text-left"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                key={item.name}
                                                                to={item.to}
                                                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Transition.Child>
                            </div>
                        </Transition.Root>
                    </>
                )}
            </Popover>
        </div>

    )
}