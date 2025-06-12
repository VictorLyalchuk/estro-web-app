import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { APP_ENV } from "../../../env/config";
import { useTranslation } from "react-i18next";
import { Link as Scrollink } from 'react-scroll'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { deleteUserByID, getUsersByPage, getUsersQuantity } from "../../../services/accounts/account-services";
import { IUserProfile } from "../../../interfaces/Auth/IUserProfile";
import classNames from "classnames";
import Loader from "../../../common/Loader/loader";

type Status = 'True' | 'False';
const statuses: Record<Status, string> = { True: 'text-green-400 bg-green-400/10', False: 'text-rose-400 bg-rose-400/10' }

export default function UserList() {
    const { t } = useTranslation();
    const baseUrl = APP_ENV.BASE_URL;
    const [usersList, setUsersList] = useState<IUserProfile[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<IUserProfile | null>(null);
    const [page, setPage] = useState(1);
    const [countPage, setCountPage] = useState(0);
    const itemsPerPage = 10;
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(countPage / itemsPerPage);
    const visiblePages = 5;
    const [loading, setLoading] = useState(true);

    let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        getUsersByPage(page)
            .then(data => setUsersList(data))
            .then(() => { setLoading(false); })
            .catch(error => console.error('Error fetching users data:', error));
        getUsersQuantity()
            .then(data => setCountPage(data))
            .catch(error => console.error('Error fetching user quantity data:', error));
    }, [page]);

    const showDeleteConfirm = (user: IUserProfile) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const handleDeleteUser = () => {
        if (selectedUser) {
            onPageChange(1);
            deleteUserByID(selectedUser?.id)
                .then(() => {
                    return getUsersQuantity();
                })
                .then(data => {
                    setCountPage(data);
                })
                .then(() => {
                    return getUsersByPage(1);
                })
                .then(data => {
                    setUsersList(data);
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
            setModalVisible(false);
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <div className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 product-start">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h2 className="px-4 text-base font-semibold leading-7 text-gray-900 sm:px-6 lg:px-8">{t('User_Users')}</h2>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none px-8">
                    <Link to={"/admin/user/add-user"}
                        className="block rounded-md px-3 py-2 text-center text-sm font-semibold text-white shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {t('User_Create')}
                    </Link>
                </div>
            </div>

            <div className="-mx-4 mt-10 ring-1 ring-gray-200 sm:mx-0 sm:rounded-lg">
                <table className="relative mt-6 w-full whitespace-nowrap text-left">
                    <colgroup>
                        <col className="xl:w-1/12" />
                        <col className="xl:w-1/12" />
                        <col className="xl:w-1/12" />
                        <col className="xl:w-1/12" />
                        <col className="xl:w-1/12" />
                        <col className="xl:w-1/12" />
                        <col className="xl:w-1/12" />
                        <col className="xl:w-1/12" />
                        <col className="xl:w-1/12" />
                    </colgroup>
                    <thead className="border-b border-white/10 text-sm leading-6 text-gray-900">
                        <tr>
                            <th scope="col" className="py-2 pl-8 pr-8 font-semibold hidden sm:table-cell">
                                {t('User_Index')}
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-8 font-semibold sm:table-cell whitespace-normal">
                                {t('User_Name')}
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold hidden md:table-cell sm:pr-6 lg:pr-8">
                                {t('User_Role')}
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold hidden xl:table-cell sm:pr-8 sm:text-left lg:pr-20">
                                {t('User_Balance')}
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold hidden sm:table-cell sm:pr-8 sm:text-left lg:pr-20">
                                {t('User_Email')}
                            </th>
                            <th scope="col" style={{ whiteSpace: 'pre-line' }} className="py-2 pl-8 pr-8 font-semibold hidden 2xl:table-cell lg:pr-20">
                                {t('User_EmailConfirmed')}
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold hidden xl:table-cell sm:pr-6 lg:pr-8">
                                {t('User_Phone')}
                            </th>
                            <th scope="col" style={{ whiteSpace: 'pre-line' }} className="py-2 pl-8 pr-4 font-semibold hidden 2xl:table-cell sm:pr-6 lg:pr-8">
                                {t('User_phoneNumberConfirmed')}
                            </th>
                            <th scope="col" className="py-2 pl-8 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                                {t('User_Actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4 min-h-[662px]">
                                    <div className="min-h-[662px] flex items-center justify-center">
                                        <Loader />
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            usersList.map((user, index) => (
                                <tr key={user.id} className="text-gray-700 hover:bg-gray-200 ">
                                    <td className="py-4 pl-8 pr-4 hidden sm:table-cell sm:pr-8 border-t border-b border-gray-200 hover:border-gray-100">
                                        <div className="font-mono text-sm leading-6">{index + 1}</div>
                                    </td>
                                    <td className="py-4 pl-8 pr-4 sm:table-cell sm:pr-8 border-t border-b border-gray-200 ">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            {user.imagePath && user.imagePath.length > 0 ? (
                                                <img src={`${baseUrl}/uploads/${user.imagePath || '/uploads/default.jpg'}`} className="h-8 w-8 rounded-full" />
                                            ) : (
                                                <img
                                                    src={`${baseUrl}/uploads/user404.webp`}
                                                    alt="Image Not Available"
                                                    className="h-8 w-8 rounded-full"
                                                />
                                            )}
                                            <div className="hover:text-indigo-500 md:table-cell">
                                                <div className="font-medium text-sm leading-6">{user.firstName} {user.lastName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 pl-8 pr-8 text-sm leading-6 hidden md:table-cell lg:pr-20 border-t border-b border-gray-200">
                                        {user.role}
                                    </td>
                                    {/* <td className="py-4 pl-8 pr-4 text-sm leading-6 hidden xl:table-cell sm:pr-8 lg:pr-20 border-t border-b border-gray-200">
                                    {formatDateFromDate(user?.birthday)}
                                </td> */}
                                    <td className="py-4 pl-8 pr-4 text-sm leading-6 hidden xl:table-cell sm:pr-8 lg:pr-20 border-t border-b border-gray-200">
                                        {user.bonusBalance}
                                    </td>
                                    <td className="py-4 pl-8 pr-4 text-sm leading-6 hidden sm:table-cell sm:pr-8 lg:pr-20 border-t border-b border-gray-200">
                                        {user.email}
                                    </td>
                                    <td className="py-4 pl-8 pr-8 text-sm leading-6 hidden 2xl:table-cell lg:pr-20 border-t border-b border-gray-200">
                                        <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                                            <div className={classNames(statuses[user.emailConfirmed ? 'True' : 'False'], 'flex-none rounded-full p-1')}>
                                                <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                            </div>
                                            <div className="hidden font-medium sm:block">{user.emailConfirmed ? 'True' : 'False'}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 pl-8 pr-8 text-sm leading-6 hidden xl:table-cell lg:pr-20 border-t border-b border-gray-200">
                                        {user.phoneNumber}
                                    </td>
                                    <td className="py-4 pl-8 pr-8 text-sm leading-6 hidden 2xl:table-cell lg:pr-20 border-t border-b border-gray-200">
                                        <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                                            <div className={classNames(statuses[user.phoneNumberConfirmed ? 'True' : 'False'], 'flex-none rounded-full p-1')}>
                                                <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                            </div>
                                            <div className="hidden font-medium sm:block">{user.phoneNumberConfirmed ? 'True' : 'False'}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 pl-8 pr-4 text-right text-sm leading-6 sm:table-cell sm:pr-6 lg:pr-8 border-t border-b border-gray-200">
                                        <Link to={`/admin/user/edit-user/${user.id}`} className="mb-2 block mx-auto w-full rounded-md px-3 py-2 text-center text-sm font-semibold text-white shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                            {t('User_Edit_User')}
                                        </Link>
                                        <button className="block mx-auto w-full rounded-md px-3 py-2 text-center text-sm font-semibold text-white shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => showDeleteConfirm(user)}>
                                            {t('User_Delete_User')}
                                        </button>
                                    </td>
                                </tr>
                            )))}
                    </tbody>
                </table>

                {/* Pagination */}
                <nav className="flex items-center justify-between bg-white rounded-md shadow-md bg-white px-4 py-3 sm:px-6">
                    <div className="container mx-auto p-4 flex relative max-w-7xl lg:flex-row justify-between ">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between ">
                            <div>
                                <p className="text-sm text-gray-700">
                                    {t('Order_Showing')} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('Order_To')}{' '}
                                    <span className="font-medium">{Math.min(indexOfLastItem, countPage)}</span> {t('Order_Of')}{' '}
                                    <span className="font-medium">{countPage}</span> {t('Order_Results')}
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
                </nav>

            </div>

            <Modal
                title={t('User_Delete_User')}
                open={modalVisible}
                onCancel={handleCancel}
                footer={null}
                className="custom-modal"
            >
                <p>{t('User_Model')}</p>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        key="delete"
                        type="button"
                        onClick={handleDeleteUser}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {t('Products_Delete')}
                    </button>
                    <button
                        key="cancel"
                        onClick={handleCancel}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {t('Products_Cancel')}
                    </button>
                </div>
            </Modal>
        </div>
    );

}