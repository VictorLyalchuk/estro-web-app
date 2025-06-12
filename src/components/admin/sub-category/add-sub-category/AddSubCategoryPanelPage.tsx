import 'tailwindcss/tailwind.css';
import '../../../../index.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { ChangeEventHandler, useEffect, useState } from "react";
import { message } from 'antd';
import { beforeUpload, createCategoryImage, deleteCategoryImage } from '../../../../services/images/images-services';
import TabProductComponent from '../../product/TabProductComponent';
import { createSubCategory, getMainCategory } from '../../../../services/category/category-services';
import { IAddSubCategoryData } from '../../../../interfaces/Category/Sub-Category/IAddSubCategoryData';
import { validateForm } from '../../../../validations/add-category/add-sub-category-validations';
import { ISubCategoryCreate } from '../../../../interfaces/Category/Sub-Category/ISubCategoryCreate';
import { IMainCategory } from '../../../../interfaces/Category/Main-Category/IMainCategory';
import AddSubCategory_en from './AddSubCategory_en';
import AddSubCategory_uk from './AddSubCategory_uk';
import AddSubCategory_es from './AddSubCategory_es';
import AddSubCategory_fr from './AddSubCategory_fr';
import LoaderModal from '../../../../common/Loader/loaderModal';

const AddSubCategoryPanelPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const { t } = useTranslation();
    const [isLoaderModal, setIsLoaderModal] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [mainCategory, setMainCategory] = useState<IMainCategory[]>([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState<IMainCategory | null>(null);

    const [formData, setFormData] = useState<IAddSubCategoryData>({
        name_en: '',
        name_uk: '',
        name_es: '',
        name_fr: '',
        urlName: '',
        description_en: '',
        description_uk: '',
        description_es: '',
        description_fr: '',
        mainCategoryId: 0,
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
        mainCategory: '',
    });

    useEffect(() => {
        getMainCategory()
            .then(data => setMainCategory(data))
            .catch(error => console.error('Error fetching sub category data:', error));
    }, []);

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

    const handleMainCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as unknown as number;
        const selectedMainCat = mainCategory.find(cat => cat.id === value) || null;
        setSelectedMainCategory(selectedMainCat);
    };

    const handleCancel = () => {
        navigate('/admin/sub-category/sub-category-list');
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        event.preventDefault();
        const { isValid, newErrors } = validateForm(formData, selectedMainCategory, setActiveTab);
        setErrors(newErrors);
        if (isValid) {
            const model: ISubCategoryCreate = {
                name_en: formData.name_en,
                name_uk: formData.name_uk,
                name_es: formData.name_es,
                name_fr: formData.name_fr,

                mainCategoryId: selectedMainCategory?.id ?? 0,

                urlName: formData.urlName,

                description_en: formData.description_en,
                description_uk: formData.description_uk,
                description_es: formData.description_es,
                description_fr: formData.description_fr,

                imagePath: image,
            };

            try {
                setIsLoaderModal(true);
                await createSubCategory(model);
                navigate("/admin/sub-category/sub-category-list");
            }
            catch (ex) {
                message.error('Error adding sub-category!');
            }
            finally {
                setIsLoaderModal(false);
            }
        } else {
            message.error('Error validate form sub-category!');
        }
    };

    const tabs = [
        {
            name: t('Add_Product_By_En'),
            current: activeTab === 0,
            component:
                <AddSubCategory_en
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    mainCategory={mainCategory}
                    selectedMainCategory={selectedMainCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
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
                <AddSubCategory_uk
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    mainCategory={mainCategory}
                    selectedMainCategory={selectedMainCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
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
                <AddSubCategory_es
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    mainCategory={mainCategory}
                    selectedMainCategory={selectedMainCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
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
                <AddSubCategory_fr
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    mainCategory={mainCategory}
                    selectedMainCategory={selectedMainCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
                    handleFileChange={handleFileChange}
                    handleRemove={handleRemove}
                    handleCancel={handleCancel}
                    isUploading={isUploading}
                />
        },
    ];

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        const routes = ['/admin/sub-category/add-sub-category-en', '/admin/sub-category/add-sub-category-uk', '/admin/sub-category/add-sub-category-es', '/admin/sub-category/add-sub-category-fr'];
        navigate(routes[index]);
    };

    useEffect(() => {
        if (location.pathname.startsWith('/admin/sub-category/add-sub-category-en')) {
            setActiveTab(0);
        }
        else if (location.pathname.startsWith('/admin/sub-category/add-sub-category-uk')) {
            setActiveTab(1);
        }
        else if (location.pathname.startsWith('/admin/sub-category/add-sub-category-es')) {
            setActiveTab(2);
        }
        else if (location.pathname.startsWith('/admin/sub-category/add-sub-category-fr')) {
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

export default AddSubCategoryPanelPage;
