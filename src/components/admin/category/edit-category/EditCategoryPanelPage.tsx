import 'tailwindcss/tailwind.css';
import '../../../../index.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { ChangeEventHandler, useEffect, useState } from "react";
import { message } from 'antd';
import { beforeUpload, createCategoryImage, deleteCategoryImage } from '../../../../services/images/images-services';
import TabProductComponent from '../../product/TabProductComponent';
import { editCategory, getCategoryById, getMainCategory, getSubCategory } from '../../../../services/category/category-services';
import { IMainCategory } from '../../../../interfaces/Category/Main-Category/IMainCategory';
import { ISubCategory } from '../../../../interfaces/Category/Sub-Category/ISubCategory';
import { IEditCategoryData } from '../../../../interfaces/Category/Category/IEditCategoryData';
import { validateForm } from '../../../../validations/edit-category/edit-category-validations';
import { ICategoryEdit } from '../../../../interfaces/Category/Category/ICategoryEdit';
import EditCategory_en from './EditCategory_en';
import EditCategory_fr from './EditCategory_fr';
import EditCategory_es from './EditCategory_es';
import EditCategory_uk from './EditCategory_uk';
import LoaderModal from '../../../../common/Loader/loaderModal';

const EditCategoryPanelPage = () => {
    const { Id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const { t } = useTranslation();
    const [isLoaderModal, setIsLoaderModal] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const parsedId = Id ? parseInt(Id, 10) : 0;
    const [mainCategory, setMainCategory] = useState<IMainCategory[]>([]);
    const [subCategory, setSubCategory] = useState<ISubCategory[]>([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState<IMainCategory | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<ISubCategory | null>(null);

    const [formData, setFormData] = useState<IEditCategoryData>({
        id: parsedId,
        name_en: '',
        name_uk: '',
        name_es: '',
        name_fr: '',
        urlName: '',
        description_en: '',
        description_uk: '',
        description_es: '',
        description_fr: '',
        imagePath: '',
        subCategoryId: 0,
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
        subCategory: '',
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [subCategory, mainCategory] = await Promise.all([getSubCategory(), getMainCategory()]);
                setSubCategory(subCategory); setMainCategory(mainCategory);

                if (Id) {
                    const data = await getCategoryById(parsedId);

                    setFormData(data);

                    setImage(data.imagePath ?? null);
                    const selectedSubCat = subCategory.find(sub => sub.id === data?.subCategoryId) || null;
                    setSelectedSubCategory(selectedSubCat);
                    setSelectedMainCategory(mainCategory.find(main => main.id === selectedSubCat?.mainCategoryId) || null);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        loadData();
    }, [Id]);

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

    const handleSubCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as unknown as number;
        const selectedSubCat = subCategory.find(cat => cat.id === value);
        setSelectedSubCategory(selectedSubCat || null);

        if (selectedSubCat) {
            const selectedMainCat = mainCategory.find(main => main.id === selectedSubCat.mainCategoryId) || null;
            setSelectedMainCategory(selectedMainCat);
        }
    };

    const handleCancel = () => {
        navigate('/admin/category/category-list');
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        event.preventDefault();
        const { isValid, newErrors } = validateForm(formData, selectedMainCategory, selectedSubCategory, setActiveTab);
        setErrors(newErrors);
        if (isValid) {
            const model: ICategoryEdit = {
                id: parsedId,
                name_en: formData.name_en,
                name_uk: formData.name_uk,
                name_es: formData.name_es,
                name_fr: formData.name_fr,

                urlName: formData.urlName,

                subCategoryId: selectedSubCategory?.id ?? 0,

                description_en: formData.description_en,
                description_uk: formData.description_uk,
                description_es: formData.description_es,
                description_fr: formData.description_fr,

                imagePath: image,
            };

            try {
                setIsLoaderModal(true);
                await editCategory(model);
                navigate("/admin/category/category-list");
            }
            catch (ex) {
                message.error('Error adding category!');
            }
            finally {
                setIsLoaderModal(false);
            }
        } else {
            message.error('Error validate form category!');
        }
    };

    const tabs = [
        {
            name: t('Add_Product_By_En'),
            current: activeTab === 0,
            component:
                <EditCategory_en
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    mainCategory={mainCategory}
                    selectedMainCategory={selectedMainCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
                    subCategory={subCategory}
                    selectedSubCategory={selectedSubCategory}
                    handleSubCategoryChange={handleSubCategoryChange}
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
                <EditCategory_uk
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    mainCategory={mainCategory}
                    selectedMainCategory={selectedMainCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
                    subCategory={subCategory}
                    selectedSubCategory={selectedSubCategory}
                    handleSubCategoryChange={handleSubCategoryChange}
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
                <EditCategory_es
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    mainCategory={mainCategory}
                    selectedMainCategory={selectedMainCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
                    subCategory={subCategory}
                    selectedSubCategory={selectedSubCategory}
                    handleSubCategoryChange={handleSubCategoryChange}
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
                <EditCategory_fr
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    image={image}
                    mainCategory={mainCategory}
                    selectedMainCategory={selectedMainCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
                    subCategory={subCategory}
                    selectedSubCategory={selectedSubCategory}
                    handleSubCategoryChange={handleSubCategoryChange}
                    handleFileChange={handleFileChange}
                    handleRemove={handleRemove}
                    handleCancel={handleCancel}
                    isUploading={isUploading}
                />
        },
    ];

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        const routes = [`/admin/category/edit-category-en/${Id}`, `/admin/category/edit-category-uk/${Id}`, `/admin/category/edit-category-es/${Id}`, `/admin/category/edit-category-fr/${Id}`];
        navigate(routes[index]);
    };

    useEffect(() => {
        if (location.pathname.startsWith(`/admin/category/edit-category-en/${Id}`)) {
            setActiveTab(0);
        }
        else if (location.pathname.startsWith(`/admin/category/edit-category-uk/${Id}`)) {
            setActiveTab(1);
        }
        else if (location.pathname.startsWith(`/admin/category/edit-category-es/${Id}`)) {
            setActiveTab(2);
        }
        else if (location.pathname.startsWith(`/admin/category/edit-category-fr/${Id}`)) {
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

export default EditCategoryPanelPage;
