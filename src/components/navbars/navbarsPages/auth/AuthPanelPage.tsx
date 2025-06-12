import 'tailwindcss/tailwind.css';
import '../../../../index.css';
import { useState, useEffect } from 'react';
import AuthPage2 from './TabsAuthComponent';
import LoginPage from './login/LoginPage';
import RegisterPage from './register/RegisterPage';
import ForgotPassword from './forgotPassword/ForgotPassword';
import { useParams } from 'react-router-dom';
import ResetPassword from './forgotPassword/ResetPassword';
import {useTranslation} from "react-i18next";


const AuthPanelPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const { email, token } = useParams<{ email: string, token: string }>();
    const {t} = useTranslation();

    const handlePasswordResetConfirmation: () => void = () => {
        setActiveTab(2); 
    };

    useEffect(() => {
        if (email && token) {
            setActiveTab(2); 
        }
    }, [email, token]);
    const handleTabChange = (index: number) => {
        setActiveTab(index);
    };

    const tabs = [
        {
            name: t('AuthPanelPage_Login'),
            current: activeTab === 0,
            component: <LoginPage />,
        },
        {
            name: t('AuthPanelPage_Register'),
            current: activeTab === 1,
            component: <RegisterPage  />,
        },
        {
            name: t('AuthPanelPage_ForgotPassword'),
            current: activeTab === 2,
            component: email && token ? (
                <ResetPassword email={email} token={token} />
            ) : (
                <ForgotPassword onPasswordResetConfirmation={handlePasswordResetConfirmation} />
            )
        },
        
    ];

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto p-8 flex relative max-w-4xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row justify-between">
                    <div className="sm:mx-auto sm:w-full">
                        <div className="w-full ">
                            <AuthPage2 tabs={tabs} onTabChange={handleTabChange} />
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

export default AuthPanelPage;
