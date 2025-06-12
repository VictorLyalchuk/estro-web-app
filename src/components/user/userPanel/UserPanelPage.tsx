import 'tailwindcss/tailwind.css';
import '../../../index.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { IAuthReducerState } from '../../../store/accounts/AuthReducer';
import { IUserProfile } from '../../../interfaces/Auth/IUserProfile';
import { getUserData } from '../../../services/accounts/account-services';
import TabsUserComponent from './TabsUserComponent';
import Profile from './profile/Profile';
import Settings from './settings/Settings';
import Bonuses from './bonuses/Bonuses';
import CompactOrders from './orders/CompactOrders';
import Orders from './orders/Orders';
import { getProfileOrders, getUserOrders } from '../../../services/order/order-services';
import Favourites from './favourites/Favourites';
import { RootState } from '../../../store/store';
import { getUserBonusesByUserId } from '../../../services/userBonuses/user-bonuses-services';
import {useTranslation} from "react-i18next";

const UserPanelPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const favoriteProducts = useSelector((state: RootState) => state.favorites.favoriteProducts);
    const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
    const [orders, setOrdersUser] = useState<IOrderUser[]>([]);
    const [userProfile, setUserProfile] = useState<IUserProfile>();
    const [userBonuses, setUserBonuses] = useState<IUserBonuses[]>([]);
    const [viewMode, setViewMode] = useState('detailed');
    const [activeTab, setActiveTab] = useState(0);
    const [page, setPage] = useState(1);
    const [countPage, setCountPage] = useState(0);
    const {t} = useTranslation();

    const handleViewModeChange = () => {
        setViewMode(prevMode => (prevMode === 'detailed' ? 'compact' : 'detailed'));
    };
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    const tabs = [
        {
            name: t('UserPanelPage_Orders'),
            current: activeTab === 0,
            component: viewMode === 'detailed' ? <CompactOrders orders={orders} onViewModeChange={handleViewModeChange} page={page} countPage={countPage} onPageChange={handlePageChange} />
            : <Orders orders={orders} onViewModeChange={handleViewModeChange} page={page} countPage={countPage} onPageChange={handlePageChange} />,
            count: countPage.toString(),
        },
        {
            name: t('UserPanelPage_Profile'),
            current: activeTab === 1,
            component: <Profile userProfile={userProfile} countPage={countPage} />,
        },
        {
            name: t('UserPanelPage_Settings'),
            current: activeTab === 2,
            component: <Settings userProfile={userProfile} authType ={user?.AuthType}/>,
        },
        {
            name: t('UserPanelPage_Favorites'),
            current: activeTab === 3,
            component: <Favourites />,
            count: favoriteProducts.length.toString(),
        },
        {
            name: t('UserPanelPage_MyBonuses'),
            current: activeTab === 4,
            component: <Bonuses userBonuses={userBonuses} bonusBalance = {userProfile?.bonusBalance} />,
            count: userProfile?.bonusBalance?.toString() || '0',
        },
    ];
    const handleTabChange = (index: number) => {
        setActiveTab(index);
        const routes = ['/account/orders', '/account/profile', '/account/settings', '/account/favorites', '/account/bonuses'];
        navigate(routes[index]);
    };

    useEffect(() => {
        if (location.pathname.startsWith('/account/orders')) {
            setActiveTab(0);
        }
        else if (location.pathname.startsWith('/account/profile')) {
            setActiveTab(1);
        }
        else if (location.pathname.startsWith('/account/settings')) {
            setActiveTab(2);
        }
        else if (location.pathname.startsWith('/account/favorites')) {
            setActiveTab(3);
        }
        else if (location.pathname.startsWith('/account/bonuses')) {
            setActiveTab(4);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (user) {
            // console.log(user.Id);
            getUserOrders(user.Id)
                .then(data => setCountPage(data))
                .catch(error => console.error('Error fetching count order data:', error));
                
            getProfileOrders(user.Id, page)
                .then(data => setOrdersUser(data))
                .catch(error => console.error('Error fetching user data:', error));

            if(user.AuthType == "phone")
            {
                getUserData(null, user.PhoneNumber)
                    .then(data => setUserProfile(data))
                    .catch(error => console.error('Error fetching user data:', error));
            }
            else {
                getUserData(user.Email)
                    .then(data => setUserProfile(data))
                    .catch(error => console.error('Error fetching user data:', error));
            }
            getUserBonusesByUserId(user.Id)
                .then(data => setUserBonuses(data))  
                .catch(error => console.error('Error fetching bonuses data:', error));
        }
    }, [user, page]);

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto p-8 flex relative max-w-screen-2xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row justify-between">
                    <div className="sm:mx-auto sm:w-full">
                        <div className="w-full ">
                            <TabsUserComponent tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
                            <div className="mt-4">
                                {tabs.find(tab => tab.current)?.component}
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </>
    )
}

export default UserPanelPage;
