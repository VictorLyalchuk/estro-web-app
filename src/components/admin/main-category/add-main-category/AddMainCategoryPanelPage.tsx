import 'tailwindcss/tailwind.css';
import '../../../../index.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { ChangeEventHandler, useEffect, useState } from "react";
import { message } from 'antd';
import { beforeUpload, createCategoryImage, deleteCategoryImage } from '../../../../services/images/images-services';
import TabProductComponent from '../../product/TabProductComponent';
import { IAddMainCategoryData } from '../../../../interfaces/Category/Main-Category/IAddMainCategoryData';
import { IMainCategoryCreate } from '../../../../interfaces/Category/Main-Category/IMainCategoryCreate';
import { createMainCategory } from '../../../../services/category/category-services';
import { validateForm } from '../../../../validations/add-category/add-main-category-validations';
import AddMainCategory_en from './AddMainCategory_en';
import AddMainCategory_uk from './AddMainCategory_uk';
import AddMainCategory_es from './AddMainCategory_es';
import AddMainCategory_fr from './AddMainCategory_fr';
import LoaderModal from '../../../../common/Loader/loaderModal';

const AddMainCategoryPanelPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const { t } = useTranslation();
    const [isLoaderModal, setIsLoaderModal] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState<IAddMainCategoryData>({
        name_en: '',
        name_uk: '',
        name_es: '',
        name_fr: '',
        urlName: '',
        description_en: '',
        description_uk: '',
        description_es: '',
        description_fr: '',
    });

    const [errors, setErrors] = useState({
        name_en: '',
        name_uk: '',
        name_es: '',
        name_fr: '',
        urlName: '',
        description_en: '',
        description_uk: '',
        description_es: '',
        description_fr: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        setIsUploading(true);
        const files = e.target.files;

        if (!files || files.length === 0) {
            return;
        }
        const file = files[0];
        if (!beforeUpload(file)) {
            return;
        }
        try {
            const response = await createCategoryImage(file);
            setImage(response);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
        finally {
            setIsUploading(false);
        }
    };

    const handleRemove = async (ImagePath: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await deleteCategoryImage(ImagePath);
            setImage(null);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleCancel = () => {
        navigate('/admin/main-category/main-category-list');
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        event.preventDefault();
        const { isValid, newErrors } = validateForm(formData, setActiveTab);
        setErrors(newErrors);
        if (isValid) {
            const model: IMainCategoryCreate = {
                name_en: formData.name_en,
                name_uk: formData.name_uk,
                name_es: formData.name_es,
                name_fr: formData.name_fr,

                urlName: formData.urlName,

                description_en: formData.description_en,
                description_uk: formData.description_uk,
                description_es: formData.description_es,
                description_fr: formData.description_fr,

                imagePath: image,
            };

            try {
                setIsLoaderModal(true);
                await createMainCategory(model);
                navigate("/admin/main-category/main-category-list");
            }
            catch (ex) {
                message.error('Error adding main-category!');
            }
            finally {
                setIsLoaderModal(false);
            }
        } else {
            message.error('Error validate form main-category!');
        }
    };

    const tabs = [
        {
            name: t('Add_Product_By_En'),
            current: activeTab === 0,
            component:
                <AddMainCategory_en
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    handleFileChange={handleFileChange}
                    handleRemove={handleRemove}
                    handleCancel={handleCancel}
                    isUploading={isUploading}
                />
        },
        {
            name: t('Add_Product_By_Uk'),
            current: activeTab === 1,
            component:
                <AddMainCategory_uk
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    handleFileChange={handleFileChange}
                    handleRemove={handleRemove}
                    handleCancel={handleCancel}
                    isUploading={isUploading}
                />
        },
        {
            name: t('Add_Product_By_Es'),
            current: activeTab === 2,
            component:
                <AddMainCategory_es
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    handleFileChange={handleFileChange}
                    handleRemove={handleRemove}
                    handleCancel={handleCancel}
                    isUploading={isUploading}
                />
        },
        {
            name: t('Add_Product_By_Fr'),
            current: activeTab === 3,
            component:
                <AddMainCategory_fr
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    handleFileChange={handleFileChange}
                    handleRemove={handleRemove}
                    handleCancel={handleCancel}
                    isUploading={isUploading}
                />
        },
    ];

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        const routes = ['/admin/main-category/add-main-category-en', '/admin/main-category/add-main-category-uk', '/admin/main-category/add-main-category-es', '/admin/main-category/add-main-category-fr'];
        navigate(routes[index]);
    };

    useEffect(() => {
        if (location.pathname.startsWith('/admin/main-category/add-main-category-en')) {
            setActiveTab(0);
        }
        else if (location.pathname.startsWith('/admin/main-category/add-main-category-uk')) {
            setActiveTab(1);
        }
        else if (location.pathname.startsWith('/admin/main-category/add-main-category-es')) {
            setActiveTab(2);
        }
        else if (location.pathname.startsWith('/admin/main-category/add-main-category-fr')) {
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

export default AddMainCategoryPanelPage;
