import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from '../../../../theme/theme';
import TextFieldComponent from '../../../../ui/input-with-label/TextFieldComponent';
import LongTextFieldComponents from '../../../../ui/input-with-label/LongTextFieldComponents';
import { useTranslation } from 'react-i18next';
import { AddMainCategoryProps } from '../../../../interfaces/Category/Main-Category/AddMainCategoryProps';
import { APP_ENV } from '../../../../env/config';

const AddMainCategory_fr: React.FC<AddMainCategoryProps> = (
    { formData, image, isUploading, errors,
        handleFileChange, onSubmit, handleCancel, handleRemove, handleChange }) => {
    const { t } = useTranslation();
    const baseUrl = APP_ENV.BASE_URL;
    
    return (
        <div className="bg-white p-5 rounded-md shadow-md mb-8 mt-8 ">

            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center ">
                <div className="pb-6 mt-6">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">{t('Category_AddMainCategory')}</h2>
                </div>
            </div>
            <div className="border-t">
                <form onSubmit={onSubmit}>
                    <div className="space-y-6">
                        <div className="border-b border-gray-900/10 pb-12">
                            <ThemeProvider theme={theme}>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                    <div className="sm:col-span-3">
                                        <label htmlFor="name_fr" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('Category_Name')}
                                        </label>
                                        <TextFieldComponent
                                            label=""
                                            name="name_fr"
                                            id="name_fr"
                                            value={formData.name_fr}
                                            onChange={handleChange}
                                            error={errors.name_fr ?? null}
                                            autoComplete="name_fr"
                                            maxLength={30}
                                            placeholder={''}
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="urlName" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('Category_URLName')}
                                        </label>
                                        <TextFieldComponent
                                            label=""
                                            name="urlName"
                                            id="urlName"
                                            value={formData.urlName}
                                            onChange={handleChange}
                                            error={errors.urlName ?? null}
                                            autoComplete="urlName"
                                            maxLength={30}
                                            placeholder={''}
                                        />
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="description_fr" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('Category_Description')}
                                        </label>
                                        <LongTextFieldComponents
                                            label=""
                                            name="description_fr"
                                            id="description_fr"
                                            value={formData.description_fr}
                                            onChange={handleChange}
                                            error={errors.description_fr ?? null}
                                            autoComplete="description_fr"
                                        />
                                    </div>

                                </div>
                            </ThemeProvider>

                        </div>

                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                            {t('Category_CoverPhoto')}
                        </label>
                        <div className="relative mb-5.5 block w-full appearance-none rounded rounded-lg border border-dashed border-gray-900/25 bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">

                            {image ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="relative bg-white dark:bg-boxdark rounded-lg overflow-hidden shadow-md">
                                        <img
                                            src={`${baseUrl}/uploads/${image}`}
                                            alt="uploaded"
                                            className="w-full h-auto"
                                        />
                                        <button
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 cursor-pointer flex items-center justify-center"
                                            onClick={(e) => handleRemove(image, e)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="h-6 w-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                        <input
                                            onChange={handleFileChange}
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                        />
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                                fill="#3C50E0"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                                fill="#3C50E0"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                                fill="#3C50E0"
                                            />
                                        </svg>
                                    </span>
                                    <div className="flex flex-col items-center justify-center space-y-3">

                                        <div className="mt-2 flex justify-center rounded-lg ">
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600 ">
                                                <label
                                                    className="relative rounded-md bg-gray-100 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                >
                                                    <input
                                                        onChange={handleFileChange}
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                                    />
                                                    <p className="cursor-pointer">{t('Add_Product_Uploadafile')}</p>
                                                </label>
                                                <p className="pl-1">{t('Add_Product_ordraganddrop')}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">{t('Add_Product_PNG_JPG_GIF_WEBP_up_to_10MB')}</p>
                                        <p className="text-xs text-gray-600">({t('Add_Product_max')})</p>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className={`p-2 flex items-center justify-center rounded-md border ${isUploading ? 'bg-gray-300' : "bg-indigo-600 hover:bg-indigo-700"} px-8 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                        >
                            {t('Add_Product_Save')}
                        </button>
                        <button type="button" className="p-2 mr-3 flex items-center rounded-md border bg-gray-200 hover:bg-gray-300 justify-center px-8 py-2 text-sm font-semibold leading-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={handleCancel}>
                            {t('Add_Product_Cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default AddMainCategory_fr;