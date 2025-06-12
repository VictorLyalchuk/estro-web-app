import React, { useState } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import foot from '../../../assets/foot.webp'
import {t} from "i18next";

interface SizeGuideProps {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
}

const ManSizeGuideComponent: React.FC<SizeGuideProps> = ({ isOpen, setOpen }) => {
    const [activeTab, setActiveTab] = useState(0);
    const handleClose = () => {
        setOpen(false);
    };

    const onTabChange = (index: number) => {
        setActiveTab(index);
    };

    const tabs = [
        {
            name: t('Product_TableOfSizes'),
            current: activeTab === 0,
        },
        {
            name: t('Product_HowToMeasure'),
            current: activeTab === 1,
        },
    ]
    return (
        <>
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 overflow-y-auto z-50" onClose={handleClose}>
                    <div className="flex items-center justify-center min-h-screen">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-600"
                                    onClick={handleClose}
                                >
                                    <span className="sr-only">{t('Product_Close')}</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>

                                <div className="p-6">
                                    <div className="border-b border-gray-200">
                                        <nav className="-mb-px flex space-x-0" aria-label="Tabs">
                                            {tabs.map((tab, index) => (
                                                <a
                                                    key={tab.name}
                                                    href="#"
                                                    className={classNames(
                                                        tab.current
                                                            ? 'border-indigo-500 text-indigo-600'
                                                            : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                                                        'w-1/2 border-b-2 py-4 px-1 text-center text-sm font-medium'
                                                    )}
                                                    aria-current={tab.current ? 'page' : undefined}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        onTabChange(index);
                                                    }}
                                                >
                                                    {tab.name}

                                                </a>
                                            ))}
                                        </nav>
                                    </div>

                                    {/* Content */}
                                    <div className="mt-2 min-h-[550px]">
                                        <div className={`tab-content ${activeTab === 0 ? 'block' : 'hidden'}`}>
                                            <table className="table-auto w-full">
                                                <thead>
                                                    <tr className="bg-gray-200">
                                                        <th className="px-4 py-4">{t('Product_SizeEU')}</th>
                                                        <th className="px-4 py-4">{t('Product_LengthInsole')}</th>
                                                        <th className="px-4 py-4">{t('Product_RecommendedFootLength')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border px-4 py-4 text-center">39</td>
                                                        <td className="border px-4 py-4 text-center">25</td>
                                                        <td className="border px-4 py-4 text-center">{t('Product_To')} 24.8</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-4 text-center">40</td>
                                                        <td className="border px-4 py-4 text-center">25.5</td>
                                                        <td className="border px-4 py-4 text-center">{t('Product_To')} 25.3</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-4 text-center">41</td>
                                                        <td className="border px-4 py-4 text-center">26</td>
                                                        <td className="border px-4 py-4 text-center">{t('Product_To')} 25.8</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-4 text-center">42</td>
                                                        <td className="border px-4 py-4 text-center">27</td>
                                                        <td className="border px-4 py-4 text-center">{t('Product_To')} 26.8</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-4 text-center">43</td>
                                                        <td className="border px-4 py-4 text-center">27.5</td>
                                                        <td className="border px-4 py-4 text-center">{t('Product_To')} 27.3</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-4 text-center">44</td>
                                                        <td className="border px-4 py-4 text-center">28.5</td>
                                                        <td className="border px-4 py-4 text-center">{t('Product_To')} 28.3</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-4 text-center">45</td>
                                                        <td className="border px-4 py-4 text-center">29</td>
                                                        <td className="border px-4 py-4 text-center">{t('Product_To')} 28.8</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-4 text-center">46</td>
                                                        <td className="border px-4 py-4 text-center">29.5</td>
                                                        <td className="border px-4 py-4 text-center">{t('Product_To')} 29.3</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className={`tab-content ${activeTab === 1 ? 'block' : 'hidden'}`}>
                                            <img src={foot}></img>
                                            <ol className="list-decimal list-inside mt-5 space-y-6">
                                                <li className="mb-2 text-base text-gray-600">
                                                    {t('Product_Measure1')}
                                                </li>
                                                <li className="mb-2 text-base text-gray-600">
                                                    {t('Product_Measure2')}
                                                </li>
                                                <li className="mb-2 text-base text-gray-600">{t('Product_Measure3')}</li>
                                                <li className="mb-2 text-base text-gray-600">{t('Product_Measure4')}</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
};

export default ManSizeGuideComponent;