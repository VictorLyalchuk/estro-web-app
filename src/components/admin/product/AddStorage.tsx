import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { IProduct, IStorages } from '../../../interfaces/Product/IProduct';
import { message } from 'antd';
import { APP_ENV } from "../../../env/config";
import { useTranslation } from 'react-i18next';
import { getLocalizedField } from '../../../utils/localized/localized';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../theme/theme';
import StorageTextFieldNoLableComponent from '../../../ui/input-with-label/StorageTextFieldNoLableComponent';
import { getProductById } from '../../../services/product/product-services';
import { addQuantityStorage } from '../../../services/storage/storage-services';
import LoaderModal from '../../../common/Loader/loaderModal';

export default function Product() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const baseUrl = APP_ENV.BASE_URL;
    const { Id } = useParams();
    const navigate = useNavigate();
    const [isLoaderModal, setIsLoaderModal] = useState(false);
    const [product, setProduct] = useState<IProduct>();
    const [storagesList, setStorages] = useState<IStorages[]>([]);

    useEffect(() => {
        if (Id) {
            getProductById(Id)
                .then(resp => {
                    setProduct(resp);
                    const updatedStoragesList = resp?.storages?.map(storage => ({
                        id: storage.id,
                        size: storage.size,
                        productQuantity: 0,
                        productId: resp.id,
                        inStock: storage.inStock,
                    })) || [];
                    setStorages(updatedStoragesList);
                });
        }
    }, [Id]);

    if (!product) {
        return <p></p>
    }

    const onStorageQuantityChange = (storageId: number, quantity: number) => {
        setStorages(prevStorages => {
            const updatedStorages = prevStorages.map(storage => {
                if (storage.id === storageId) {
                    return {
                        ...storage,
                        productQuantity: quantity,
                    };
                }
                return storage;
            });
            return updatedStorages;
        });
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setIsLoaderModal(true);
            await addQuantityStorage(storagesList)
            navigate('/admin/product/product-list');
        }
        catch (ex) {
            message.error('Error to add quantity storage data!');
        }
        finally {
            setIsLoaderModal(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/product/product-list');
    }

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto p-8 flex relative max-w-screen-2xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row justify-between" style={{ minHeight: '1000px' }}>
                <div className="sm:mx-auto sm:w-full">
                    <div className="w-full ">
                        <div className="bg-white p-5 rounded-md shadow-md mb-8 mt-8" style={{ minHeight: '800px' }}>

                            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center">
                                <div className="pb-6 mt-6">
                                    <h2 className="text-base font-semibold leading-7 text-gray-900">{t('Products_Add_Storage')}</h2>
                                </div>
                            </div>
                            <div className="pt-6 mb-6 border-t">
                                <nav aria-label="Breadcrumb" >
                                    <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                                        <li className="text-sm  border-r ">
                                            <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">

                                                <div className="mt-9 lg:row-span-3 lg:mt-0 lg:col-start-3">
                                                    <div className="w-50 rounded-md">
                                                        <img src={`${baseUrl}/uploads/1200_${product.images?.[0]?.imagePath || '/uploads/default.jpg'}`} alt="Product" />
                                                    </div>

                                                    <div className="mt-8">
                                                        <h3 className="text-1xl text-gray-900">{t('Add_Product_Name')}: {getLocalizedField(product, 'name', lang)}</h3>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h3 className="text-1xl text-gray-900">{t('Add_Product_Price')}: {product.price} €</h3>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h3 className="text-1xl text-gray-900">{t('Product_Article')}: {product.article}</h3>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h3 className="text-1xl text-gray-900">{t('Product_Color')}: {getLocalizedField(product, 'color', lang)}</h3>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h3 className="text-1xl text-gray-900">{t('Product_Material')}: {getLocalizedField(product, 'material', lang)}</h3>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h3 className="text-1xl text-gray-900">{t('Product_Season')}: {getLocalizedField(product, 'season', lang)}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="text-sm flex items-center justify-center">
                                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                                <form onSubmit={onSubmit}>
                                                    <div className="space-y-6">
                                                        <div className=" pb-12">
                                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                                <ThemeProvider theme={theme}>
                                                                    {product.storages?.map((storage, index) => (
                                                                        <div key={index} className="sm:col-span-2 flex flex-col items-center">
                                                                            <div className="sm:col-span-2">
                                                                                <label htmlFor={`${storage.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                                                                                    {t('Product_Size')} {storage.size}
                                                                                </label>
                                                                                <StorageTextFieldNoLableComponent
                                                                                    label=""
                                                                                    name={`${storage.id}`}
                                                                                    id={`${storage.id}`}
                                                                                    onChange={(e) => {
                                                                                        const quantity = parseInt(e.target.value, 10);
                                                                                        onStorageQuantityChange(storage.id, quantity);
                                                                                    }}
                                                                                    autoComplete={`${storage.id}`}
                                                                                    inputType={'digits'}
                                                                                    maxDigits={16}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </ThemeProvider>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 flex items-center justify-end gap-x-6">
                                                        <button
                                                            type="submit"
                                                            className={`p-2 flex items-center justify-center rounded-md border bg-indigo-600 hover:bg-indigo-700 px-8 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                                        >
                                                            {t('Add_Product_Save')}
                                                        </button>
                                                        <button type="button" className="p-2 mr-3 flex items-center rounded-md border bg-gray-200 hover:bg-gray-300 justify-center px-8 py-2 text-sm font-semibold leading-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={handleCancel}>
                                                            {t('Add_Product_Cancel')}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        {isLoaderModal && (
                            <LoaderModal />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
