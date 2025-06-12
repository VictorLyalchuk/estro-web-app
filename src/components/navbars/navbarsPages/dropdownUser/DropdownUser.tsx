import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthReducerActionType, IAuthReducerState } from '../../../../store/accounts/AuthReducer';
import { APP_ENV } from "../../../../env/config";
import { BagReducerActionType } from '../../../../store/bag/BagReducer';
import { ArrowLeftOnRectangleIcon, ChevronDoubleRightIcon, Cog6ToothIcon, CurrencyDollarIcon, DocumentChartBarIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline';
import { FavoritesReducerActionType } from '../../../../store/favourites/FavoritesReducer';
import { useTranslation } from "react-i18next";
import { CardReducerActionType } from '../../../../store/bag/CardReducer';
import { OrderReducerActionType } from '../../../../store/order/OrderReducer';

const DropdownUser = () => {
  const baseUrl = APP_ENV.BASE_URL;
  const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const { t } = useTranslation();

  const handleDropdownClick = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: AuthReducerActionType.LOGOUT_USER, });
    dispatch({ type: BagReducerActionType.DELETE_BAG_ALL, });
    dispatch({ type: CardReducerActionType.DELETE_CARD_ALL, });
    dispatch({ type: FavoritesReducerActionType.DELETE_FAVORITES_ALL, });
    dispatch({ type: OrderReducerActionType.DELETE_ORDER_COUNT, });
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={handleDropdownClick}
        className="flex items-center gap-4"
        to="#"
      >
        <div className="text-right lg:block hover:text-indigo-500">
          <div className={`block text-sm font-medium ${isAuth ? 'text-gray-900 hover:text-indigo-500' : 'text-gray-700 hover:text-indigo-500'}`}>
            {user?.FirstName} {' '} {user?.LastName}
          </div>
        </div>
        <span className="h-12 w-12 hidden sm:flex" >
          <img src={`${baseUrl}/uploads/${user?.ImagePath || "user404.webp"}`}
            className='rounded-full'
            alt="User" />
        </span>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute left mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-gray-100 shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? 'block' : 'hidden'
          }`}
      >
        {user?.Role === "Administrator" &&
          <Link className="border-b border-stroke flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out text-gray-900 hover:text-indigo-500"
            to="/admin/admin-panel-page"
            onClick={() => setDropdownOpen(false)}>
            <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            {t('DropdownUser_AdminPanel')}
          </Link>
        }
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-4 dark:border-strokedark">
          <li>
            <Link
              to="/account/orders"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out text-gray-900 hover:text-indigo-500 "
            >
              <DocumentChartBarIcon className="h-5 w-5" aria-hidden="true" />
              {t('DropdownUser_MyOrders')}
            </Link>
          </li>
          <li>
            <Link
              to="/account/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out text-gray-900 hover:text-indigo-500 "
            >
              <UserIcon className="h-5 w-5" aria-hidden="true" />
              {t('DropdownUser_Profile')}
            </Link>
          </li>

          <li>
            <Link
              to="/account/settings"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out text-gray-900 hover:text-indigo-500"
            >
              <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" />
              {t('DropdownUser_AccountSettings')}
            </Link>
          </li>

          <li>
            <Link
              to="/account/favorites"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out text-gray-900 hover:text-indigo-500"
            >
              <HeartIcon className="h-5 w-5" aria-hidden="true" />
              {t('DropdownUser_Favorites')}
            </Link>
          </li>

          <li>
            <Link
              to="/account/bonuses"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out text-gray-900 hover:text-indigo-500"
            >
              <CurrencyDollarIcon className="h-5 w-5" aria-hidden="true" />
              {t('DropdownUser_Bonuses')}
            </Link>
          </li>

        </ul>
        <Link className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out text-gray-900 hover:text-indigo-500" to={"/"} onClick={handleLogout}>
          <ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
          {t('DropdownUser_LogOut')}
        </Link>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;