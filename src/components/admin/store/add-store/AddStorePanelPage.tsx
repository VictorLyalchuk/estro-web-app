import 'tailwindcss/tailwind.css';
import '../../../../index.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { message } from 'antd';
import TabProductComponent from '../../product/TabProductComponent';
import { createStore, getCity, getCountry } from '../../../../services/shipping/shipping-services';
import { ICity } from '../../../../interfaces/Address/ICity';
import { ICountry } from '../../../../interfaces/Address/ICountry';
import { IAddStoreData } from '../../../../interfaces/Store/IAddStoreData';
import AddStore_en from './AddStore_en';
import { IStoreCreate } from '../../../../interfaces/Store/IStoreCreate';
import { validateForm } from '../../../../validations/add-store/add-store-validations';
import AddStore_uk from './AddStore_uk';
import AddStore_es from './AddStore_es';
import AddStore_fr from './AddStore_fr';
import LoaderModal from '../../../../common/Loader/loaderModal';

const AddStorePanelPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const { t } = useTranslation();
    const [isLoaderModal, setIsLoaderModal] = useState(false);
    const [cityOptions, setCityOptions] = useState<ICity[]>([]);
    const [countryOptions, setCountryOptions] = useState<ICountry[]>([]);
    const [selectedCity, setSelectedCity] = useState<ICity | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

    const [formData, setFormData] = useState<IAddStoreData>({
        name_en: '',
        name_es: '',
        name_fr: '',
        name_uk: '',
        address_en: '',
        address_es: '',
        address_fr: '',
        address_uk: '',
        workingHours: '',
        mapLink: '',
        cityId: 0,
    });

    const [errors, setErrors] = useState({
        name_en: '',
        name_es: '',
        name_fr: '',
        name_uk: '',
        address_en: '',
        address_es: '',
        address_fr: '',
        address_uk: '',
        workingHours: '',
        mapLink: '',
        country: '',
        city: '',
    });

    useEffect(() => {
        getCity().then(resp => setCityOptions(resp))
            .catch(error => console.error('Error fetching city data:', error));
        getCountry().then(data => setCountryOptions(data))
            .catch(error => console.error('Error fetching country data:', error));
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        const filteredCountry = countryOptions.find(country => country.id === value) || null;
        setSelectedCountry(filteredCountry);
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        const filteredCity = cityOptions.find(city => city.id === value);
        setSelectedCity(filteredCity || null);

        if (filteredCity) {
            const filteredCountry = countryOptions.find(country => country.id === filteredCity.countryId) || null;
            setSelectedCountry(filteredCountry);
        }
    };

    const handleCancel = () => {
        navigate('/admin/store/store-list');
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        event.preventDefault();
        const { isValid, newErrors } = validateForm(formData, selectedCountry, selectedCity, setActiveTab);
        setErrors(newErrors);
        if (isValid) {
            const model: IStoreCreate = {
                name_en: formData.name_en,
                name_uk: formData.name_uk,
                name_es: formData.name_es,
                name_fr: formData.name_fr,
                address_en: formData.address_en,
                address_uk: formData.address_uk,
                address_es: formData.address_es,
                address_fr: formData.address_fr,
                workingHours: formData.workingHours,
                mapLink: formData.mapLink,
                cityId: selectedCity?.id || 0,
            };

            try {
                setIsLoaderModal(true);
                await createStore(model);
                navigate("/admin/store/store-list");
            }
            catch (ex) {
                message.error('Error adding store!');
            }
            finally {
                setIsLoaderModal(false);
            }
        } else {
            message.error('Error validate form store!');
        }
    };

    const tabs = [
        {
            name: t('Add_Product_By_En'),
            current: activeTab === 0,
            component:
                <AddStore_en
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    countryOptions={countryOptions}
                    selectedCountry={selectedCountry}
                    handleCountryChange={handleCountryChange}
                    cityOptions={cityOptions}
                    selectedCity={selectedCity}
                    handleCityChange={handleCityChange}
                    handleCancel={handleCancel}
                />
        },
        {
            name: t('Add_Product_By_Uk'),
            current: activeTab === 1,
            component:
                <AddStore_uk
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    countryOptions={countryOptions}
                    selectedCountry={selectedCountry}
                    handleCountryChange={handleCountryChange}
                    cityOptions={cityOptions}
                    selectedCity={selectedCity}
                    handleCityChange={handleCityChange}
                    handleCancel={handleCancel}
                />
        },
        {
            name: t('Add_Product_By_Es'),
            current: activeTab === 2,
            component:
                <AddStore_es
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    countryOptions={countryOptions}
                    selectedCountry={selectedCountry}
                    handleCountryChange={handleCountryChange}
                    cityOptions={cityOptions}
                    selectedCity={selectedCity}
                    handleCityChange={handleCityChange}
                    handleCancel={handleCancel}
                />
        },
        {
            name: t('Add_Product_By_Fr'),
            current: activeTab === 3,
            component:
                <AddStore_fr
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    countryOptions={countryOptions}
                    selectedCountry={selectedCountry}
                    handleCountryChange={handleCountryChange}
                    cityOptions={cityOptions}
                    selectedCity={selectedCity}
                    handleCityChange={handleCityChange}
                    handleCancel={handleCancel}
                />
        },
    ];

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        const routes = ['/admin/store/add-store-en', '/admin/store/add-store-uk', '/admin/store/add-store-es', '/admin/store/add-store-fr'];
        navigate(routes[index]);
    };

    useEffect(() => {
        if (location.pathname.startsWith('/admin/store/add-store-en')) {
            setActiveTab(0);
        }
        else if (location.pathname.startsWith('/admin/store/add-store-uk')) {
            setActiveTab(1);
        }
        else if (location.pathname.startsWith('/admin/store/add-store-es')) {
            setActiveTab(2);
        }
        else if (location.pathname.startsWith('/admin/store/add-store-fr')) {
            setActiveTab(3);
        }
    }, [location.pathname]);

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto p-8 flex relative max-w-screen-2xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row justify-between">
                    <div className="sm:mx-auto sm:w-full">
                        <div className="w-full ">
                            <TabProductComponent tabs={tabs} onTabChange={handleTabChange} />
                            <div className="mt-4">
                                {tabs.find(tab => tab.current)?.component}
                            </div>
                            {isLoaderModal && (
                                <LoaderModal />
                            )}
                        </div>
                    </div >
                </div >
            </div >
        </>
    )
}

export default AddStorePanelPage;
