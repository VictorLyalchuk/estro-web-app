import 'tailwindcss/tailwind.css';
import '../../../../index.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { ChangeEventHandler, useEffect, useState } from "react";
import { message } from 'antd';
import { IMainCategory } from "../../../../interfaces/Category/Main-Category/IMainCategory";
import { IImageItem } from "../../../../interfaces/Product/IProduct";
import { IProductCreate } from "../../../../interfaces/Product/IProductCreate";
import { IProductFilters } from '../../../../interfaces/Info/IInfo';
import { getCategory, getMainCategory, getSubCategory } from '../../../../services/category/category-services';
import { beforeUpload, createImage, deleteImage } from '../../../../services/images/images-services';
import { createProduct } from '../../../../services/product/product-services';
import { getColorsList, getMaterialsList, getSeasonList, getSizesList } from '../../../../services/info/info-services';
import { validateForm } from '../../../../validations/add-product/add-product-validations';
import TabProductComponent from '../TabProductComponent';
import { IAddProductData } from '../../../../interfaces/Product/IAddProductData';
import AddProduct_en from './AddProduct_en';
import AddProduct_uk from './AddProduct_uk';
import AddProduct_es from './AddProduct_es';
import AddProduct_fr from './AddProduct_fr';
import { ISubCategory } from '../../../../interfaces/Category/Sub-Category/ISubCategory';
import { ICategory } from '../../../../interfaces/Category/Category/ICategory';
import LoaderModal from '../../../../common/Loader/loaderModal';

const AddProductPanelPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const { t } = useTranslation();
    const [isLoaderModal, setIsLoaderModal] = useState(false);
    const [season, setSeason] = useState<IProductFilters[]>([]);
    const [colors, setColors] = useState<IProductFilters[]>([]);
    const [materials, setMaterials] = useState<IProductFilters[]>([]);
    const [sizes, setSizes] = useState<IProductFilters[]>([]);
    const [Images, setImages] = useState<IImageItem[]>([]);
    const [mainCategory, setMainCategory] = useState<IMainCategory[]>([]);
    const [subCategory, setSubCategory] = useState<ISubCategory[]>([]);
    const [categoryList, setCategoryList] = useState<ICategory[]>([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState<IMainCategory | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<ISubCategory | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState<IAddProductData>({
        name_en: '',
        name_uk: '',
        name_es: '',
        name_fr: '',
        article: '',
        price: '',
        season: '',
        color: '',
        material: '',
        sizes: [],
        mainCategory: '',
        subCategory: '',
        category: '',
        description_en: '',
        description_uk: '',
        description_es: '',
        description_fr: '',
        highlights_en: [],
        highlights_uk: [],
        highlights_es: [],
        highlights_fr: [],
    });

    const [errors, setErrors] = useState({
        name_en: '',
        name_uk: '',
        name_es: '',
        name_fr: '',
        article: '',
        price: '',
        season: '',
        color: '',
        material: '',
        size: '',
        mainCategory: '',
        subCategory: '',
        category: '',
        description_en: '',
        description_uk: '',
        description_es: '',
        description_fr: '',
        highlights_en: '',
        highlights_uk: '',
        highlights_es: '',
        highlights_fr: '',
    });

    useEffect(() => {
        getSeasonList()
            .then(data => setSeason(data))
            .catch(error => console.error('Error fetching season data:', error));
        getColorsList()
            .then(data => setColors(data))
            .catch(error => console.error('Error fetching colors data:', error));
        getMaterialsList()
            .then(data => setMaterials(data))
            .catch(error => console.error('Error fetching materials data:', error));
        getSizesList()
            .then(data => setSizes(data))
            .catch(error => console.error('Error fetching sizes data:', error));

        getCategory()
            .then(data => setCategoryList(data))
            .catch(error => console.error('Error fetching category data:', error));
        getSubCategory()
            .then(data => setSubCategory(data))
            .catch(error => console.error('Error fetching sub category data:', error));
        getMainCategory()
            .then(data => setMainCategory(data))
            .catch(error => console.error('Error fetching main category data:', error));
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        setFormData((prevData) => {
            const size = sizes.find((s) => s.name_en === value);

            if (size) {
                let updatedSizes;
                if (checked) {
                    updatedSizes = [...prevData.sizes, size];
                } else {
                    updatedSizes = prevData.sizes.filter((s) => s.name_en !== size.name_en);
                }
                return { ...prevData, sizes: updatedSizes };
            }

            return prevData;
        });
    };

    const handleHighlightsChange = (name: string, highlights: string[]) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: highlights,
        }));
    };

    const handleMainCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as unknown as number;
        const selectedMainCat = mainCategory.find(cat => cat.id === value) || null;
        setSelectedMainCategory(selectedMainCat);
        setSelectedSubCategory(null);
        setSelectedCategory(null);
    };

    const handleSubCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as unknown as number;
        const selectedSubCat = subCategory.find(cat => cat.id === value);
        setSelectedSubCategory(selectedSubCat || null);
        setSelectedCategory(null);

        if (selectedSubCat) {
            const selectedMainCat = mainCategory.find(main => main.id === selectedSubCat.mainCategoryId) || null;
            setSelectedMainCategory(selectedMainCat);
        }
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as unknown as number;
        const selectedCat = categoryList.find(cat => cat.id === value);
        setSelectedCategory(selectedCat || null);

        if (selectedCat) {
            const selectedSubCat = subCategory.find(sub => sub.id === selectedCat.subCategoryId) || null;
            const selectedMainCat = mainCategory.find(main => main.id === (selectedSubCat ? selectedSubCat.mainCategoryId : -1)) || null;
            setSelectedSubCategory(selectedSubCat);
            setSelectedMainCategory(selectedMainCat);
        }
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
            const response = await createImage(file);
            setImages((prevPaths) => [...prevPaths, response]);
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
        const currentImage = Images.find((image) => image.imagePath === ImagePath);

        if (currentImage) {

            const newImages = Images.filter((image) => image.imagePath !== ImagePath);
            setImages(newImages);

            const model: IImageItem = {
                id: currentImage.id,
                imagePath: ImagePath
            }
            try {
                await deleteImage(model);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        };
    };

    const handleCancel = () => {
        navigate('/admin/product/product-list');
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        event.preventDefault();
        const { isValid, newErrors } = validateForm(formData, selectedMainCategory, selectedSubCategory, selectedCategory, setActiveTab);
        setErrors(newErrors);
        if (isValid) {
            const model: IProductCreate = {
                name_en: formData.name_en,
                name_uk: formData.name_uk,
                name_es: formData.name_es,
                name_fr: formData.name_fr,

                description_en: formData.description_en,
                description_uk: formData.description_uk,
                description_es: formData.description_es,
                description_fr: formData.description_fr,

                highlights_en: formData.highlights_en,
                highlights_uk: formData.highlights_uk,
                highlights_es: formData.highlights_es,
                highlights_fr: formData.highlights_fr,

                price: formData.price,
                materialId: parseInt(formData.material),
                seasonId: parseInt(formData.season),
                colorId: parseInt(formData.color),
                article: formData.article,
                ImagesFile: Images,
                CategoryId: selectedCategory?.id,
                sizes: formData.sizes,

            };

            try {
                setIsLoaderModal(true);
                await createProduct(model);
                navigate("/admin/product/product-list");
            }
            catch (ex) {
                message.error('Error adding product!');
            }
            finally {
                setIsLoaderModal(false);
            }
        } else {
            message.error('Error validate form product!');
        }
    };

    const tabs = [
        {
            name: t('Add_Product_By_En'),
            current: activeTab === 0,
            component:
                <AddProduct_en
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    season={season}
                    colors={colors}
                    materials={materials}
                    sizes={sizes}
                    Images={Images}
                    mainCategory={mainCategory}
                    subCategory={subCategory}
                    categoryList={categoryList}
                    selectedMainCategory={selectedMainCategory}
                    selectedSubCategory={selectedSubCategory}
                    selectedCategory={selectedCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
                    handleSubCategoryChange={handleSubCategoryChange}
                    handleCategoryChange={handleCategoryChange}
                    handleHighlightsChange={handleHighlightsChange}
                    handleCheckboxChange={handleCheckboxChange}
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
                <AddProduct_uk
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    season={season}
                    colors={colors}
                    materials={materials}
                    sizes={sizes}
                    Images={Images}
                    mainCategory={mainCategory}
                    subCategory={subCategory}
                    categoryList={categoryList}
                    selectedMainCategory={selectedMainCategory}
                    selectedSubCategory={selectedSubCategory}
                    selectedCategory={selectedCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
                    handleSubCategoryChange={handleSubCategoryChange}
                    handleCategoryChange={handleCategoryChange}
                    handleHighlightsChange={handleHighlightsChange}
                    handleCheckboxChange={handleCheckboxChange}
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
                <AddProduct_es
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    season={season}
                    colors={colors}
                    materials={materials}
                    sizes={sizes}
                    Images={Images}
                    mainCategory={mainCategory}
                    subCategory={subCategory}
                    categoryList={categoryList}
                    selectedMainCategory={selectedMainCategory}
                    selectedSubCategory={selectedSubCategory}
                    selectedCategory={selectedCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
                    handleSubCategoryChange={handleSubCategoryChange}
                    handleCategoryChange={handleCategoryChange}
                    handleHighlightsChange={handleHighlightsChange}
                    handleCheckboxChange={handleCheckboxChange}
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
                <AddProduct_fr
                    onSubmit={onSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    season={season}
                    colors={colors}
                    materials={materials}
                    sizes={sizes}
                    Images={Images}
                    mainCategory={mainCategory}
                    subCategory={subCategory}
                    categoryList={categoryList}
                    selectedMainCategory={selectedMainCategory}
                    selectedSubCategory={selectedSubCategory}
                    selectedCategory={selectedCategory}
                    handleMainCategoryChange={handleMainCategoryChange}
                    handleSubCategoryChange={handleSubCategoryChange}
                    handleCategoryChange={handleCategoryChange}
                    handleHighlightsChange={handleHighlightsChange}
                    handleCheckboxChange={handleCheckboxChange}
                    handleFileChange={handleFileChange}
                    handleRemove={handleRemove}
                    handleCancel={handleCancel}
                    isUploading={isUploading}
                />
        },
    ];

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        const routes = ['/admin/product/add-product-en', '/admin/product/add-product-uk', '/admin/product/add-product-es', '/admin/product/add-product-fr'];
        navigate(routes[index]);
    };

    useEffect(() => {
        if (location.pathname.startsWith('/admin/product/add-product-en')) {
            setActiveTab(0);
        }
        else if (location.pathname.startsWith('/admin/product/add-product-uk')) {
            setActiveTab(1);
        }
        else if (location.pathname.startsWith('/admin/product/add-product-es')) {
            setActiveTab(2);
        }
        else if (location.pathname.startsWith('/admin/product/add-product-fr')) {
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

export default AddProductPanelPage;
