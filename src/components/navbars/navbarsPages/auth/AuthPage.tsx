import 'tailwindcss/tailwind.css';
import '../../../../index.css';
import { Tab } from '@headlessui/react'
import RegisterPage from './register/RegisterPage';
import LoginPage from './login/LoginPage';
import ResetPassword from './forgotPassword/ResetPassword';
import ForgotPassword from './forgotPassword/ForgotPassword';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {useTranslation} from "react-i18next";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const AuthPage = () => {
    const { email, token } = useParams<{ email: string, token: string }>();
    const [activeTab, setActiveTab] = useState(0);
    const {t} = useTranslation();

    const handlePasswordResetConfirmation: () => void = () => {
        setActiveTab(2); 
    };

    useEffect(() => {
        if (email && token) {
            setActiveTab(2); 
        }
    }, [email, token]);

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto p-8 flex relative max-w-4xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row justify-between">
                    <div className="sm:mx-auto sm:w-full">
                        <div className="w-full ">
                            <Tab.Group
                            selectedIndex={activeTab} 
                            onChange={setActiveTab}
                            >
                                <Tab.List className="flex space-x-1 rounded-md bg-gray-500/20 p-1"
                                    style={{ backgroundColor: '#303A47' }} >
                                    <Tab
                                        className={({ selected }) =>
                                            classNames(
                                                'w-full rounded-md py-2.5 text-sm font-medium leading-5',
                                                'ring-white/60 ring-offset-2 ring-offset-gray-400 focus:outline-none ',
                                                selected
                                                    ? 'bg-white text-gray-700 '
                                                    : 'text-white hover:bg-white/[0.12] hover:text-white'
                                            )
                                        }
                                    >{t('AuthPanelPage_Login')}
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            classNames(
                                                'w-full rounded-md py-2.5 text-sm font-medium leading-5',
                                                'ring-white/60 ring-offset-2 ring-offset-gray-400 focus:outline-none ',
                                                selected
                                                    ? 'bg-white text-gray-700 '
                                                    : 'text-white hover:bg-white/[0.12] hover:text-white'
                                            )
                                        }
                                    >{t('AuthPanelPage_Register')}
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            classNames(
                                                'w-full rounded-md py-2.5 text-sm font-medium leading-5',
                                                'ring-white/60 ring-offset-2 ring-offset-gray-400 focus:outline-none ',
                                                selected
                                                    ? 'bg-white text-gray-700 '
                                                    : 'text-white hover:bg-white/[0.12] hover:text-white'
                                            )
                                        }
                                    >{t('AuthPanelPage_ForgotPassword')}
                                    </Tab>
                                </Tab.List>

                                <Tab.Panels className="mt-4">
                                    <Tab.Panel>
                                        <LoginPage></LoginPage>
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <RegisterPage></RegisterPage>
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        {email && token ? (
                                            <ResetPassword email={email} token={token} />
                                        ) : (
                                            <ForgotPassword onPasswordResetConfirmation={handlePasswordResetConfirmation} />
                                        )}
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </div >
                </div >
            </div >
        </>
    );
}

export default AuthPage;