import { useState, ChangeEvent, useEffect } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, ThemeProvider } from '@material-ui/core';
import { t } from "i18next";
import moment from 'moment/moment';
import { State } from '../../../interfaces/Catalog/State';
import { APP_ENV } from '../../../env/config';
import { beforeUpload, createUserImage, deleteUserImage, editUserImage } from '../../../services/images/images-services';
import { IIUserImageEdit } from '../../../interfaces/Auth/IIUserImageEdit';
import { editUser, GetUserById, refreshRedux, refreshToken } from '../../../services/accounts/account-services';
import { theme } from '../../../theme/theme';
import TextFieldReadOnlyNoLableComponent from '../../../ui/input-no-label/TextFieldReadOnlyNoLableComponent';
import PhoneNumberNoLableComponent from '../../../ui/input-no-label/PhoneNumberNoLableComponent';
import Modal from '../../cropImage/Modal';
import TextFieldNoLableComponent from '../../../ui/input-no-label/TextFieldNoLableComponent';
import PasswordFieldNoLableComponent from '../../../ui/input-no-label/PasswordFieldNoLableComponent';
import { validatePhoneNumber } from '../../../validations/custom/add-user-phone-validations';
import { validateForm } from '../../../validations/account/edit-user-validations';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import RoleSelect from '../../../ui/acount/RoleSelect';
import { Roles } from '../../../interfaces/Auth/Roles';
import AuthTypeSelect from '../../../ui/acount/AuthTypeSelect';
import { IUserGetEdit } from '../../../interfaces/Auth/IUserGetEdit';
import { useDispatch } from 'react-redux';
import MyDatePicker from '../../../ui/data-picker/MyDatePicker';
import LoaderModal from '../../../common/Loader/loaderModal';

const EditUser = () => {
    const { Id } = useParams();
    const baseUrl = APP_ENV.BASE_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoaderModal, setIsLoaderModal] = useState(false);
    const [userImage, setUserImage] = useState<string>('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Roles | null>(null);
    const [selectedAuthType, setSelectedAuthType] = useState<Roles | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [values, setValues] = useState<State>({
        textmask: '(   )    -  -  ',
    });

    const [rolesList] = useState<Roles[]>(
        [{ id: 1, name: 'User', },
        { id: 2, name: 'Administrator', }]
    );

    const [authTypeList] = useState<Roles[]>(
        [{ id: 1, name: 'standard', },
        { id: 2, name: 'phone', },
        { id: 3, name: 'google' }]
    );

    const [formData, setFormData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        birthday: '',
        role: '',
        authType: '',
        password: '',
        isBlocked: false,
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        authType: '',
        birthday: '',
        password: '',
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                if (Id) {
                    const userData = await GetUserById(Id);
                    const birthdayDate = moment(userData.birthday, 'YYYY-MM-DD').format('YYYY-MM-DD');
                    setFormData({
                        ...formData,
                        id: userData.id,
                        birthday: birthdayDate,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        phoneNumber: userData.phoneNumber,
                        role: userData.role,
                        authType: userData.authType,
                        isBlocked: userData.isBlocked,
                    });
                    setValues((prevValues) => ({
                        ...prevValues,
                        textmask: userData.phoneNumber,
                    }));
                    setUserImage(userData.imagePath || '');
                    const selectedRole = rolesList.find(role => role.name === userData.role) || null;
                    setSelectedRole(selectedRole);
                    const selectedAuthType = authTypeList.find(authType => authType.name === userData.authType) || null;
                    setSelectedAuthType(selectedAuthType);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        loadData();
    }, [Id]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setModalOpen(true);
        }
    };

    const changeImage = async (file: File) => {
        setIsUploading(true);
        try {
            const isValid = await beforeUpload(file);

            if (!isValid) {
                return;
            }

            if (userImage) {
                await deleteUserImage(userImage);
            }
            const resp = await createUserImage(file);
            const editDTO: IIUserImageEdit = {
                email: formData?.email || "",
                imagePath: resp as string,
            };
            setUserImage(resp as string);
            await editUserImage(editDTO);
        } catch (error) {
            console.error('Error changing image:', error);
        }
        finally {
            setIsUploading(false);
        }
    };

    const changePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

        const cleanedValue = value.replace(/\D/g, '');
        setFormData((prevData) => ({
            ...prevData,
            phoneNumber: cleanedValue,
        }));

        validatePhoneNumber(cleanedValue, errors, setErrors);
    };

    const currentPasswordToggle = () => {
        setShowCurrentPassword((prevShowPassword) => !prevShowPassword);
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        event.preventDefault();
        const { isValid, newErrors } = validateForm(formData, values.textmask);
        setErrors(newErrors);
        if (isValid) {
            const model: IUserGetEdit = {
                id: formData.id,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                imagePath: userImage || "",
                phoneNumber: formData.phoneNumber,
                role: formData.role || '',
                authType: formData.authType || '',
                birthday: new Date(formData.birthday),
                password: formData.password,
                isBlocked: formData.isBlocked,
            };
            try {
                setIsLoaderModal(true);
                await editUser(model);
                await refreshToken();
                await refreshRedux(dispatch);
                navigate("/admin/user/user-list");
            }
            catch (ex) {
                message.error('Error adding user!');
            }
            finally {
                setIsLoaderModal(false);
            }
        } else {
            message.error('Error validate form user!');
        }
    };

    const handleCancel = () => {
        navigate('/admin/user/user-list');
    }

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        const selectedRole = rolesList.find(role => role.id === value) || null;
        setSelectedRole(selectedRole);
        setFormData((prevData) => ({
            ...prevData,
            role: selectedRole?.name || '',
        }));
    };

    const handleAuthTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        const selectedAuthType = authTypeList.find(authType => authType.id === value) || null;
        setSelectedAuthType(selectedAuthType);
        setFormData((prevData) => ({
            ...prevData,
            authType: selectedAuthType?.name || '',
        }));
    };

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto p-8 flex relative max-w-screen-2xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row justify-between">
                <div className="sm:mx-auto sm:w-full">
                    <div className="w-full ">
                        <div className="bg-white p-5 rounded-md shadow-md mb-8 mt-8 ">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center ">
                                <div className="pb-6 mt-6">
                                    <h2 className="text-base font-semibold leading-7 text-gray-900">{t('User_Edit')}</h2>
                                </div>
                            </div>
                            <div className="border-t">
                                <div className="space-y-6">
                                    <ThemeProvider theme={theme}>
                                        <div className=" lg:col-span-9">
                                            <form onSubmit={onSubmit}>
                                                {/* Profile section */}
                                                <div className="px-4 py-6 sm:p-6 lg:pb-8">
                                                    <div className="mt-6 flex flex-col lg:flex-row">
                                                        <div className="flex-grow space-y-6">

                                                            <div>
                                                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                                    {t('ProfileSettings_Email')}
                                                                </label>
                                                                <div className="mt-2 flex rounded-md shadow-sm">
                                                                    <TextFieldReadOnlyNoLableComponent
                                                                        name="email"
                                                                        id="email"
                                                                        value={formData.email}
                                                                        onChange={handleChange}
                                                                        error={errors.email}
                                                                        autoComplete="email"
                                                                        maxLength={30}
                                                                        readOnly={false}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label htmlFor="textmask" className="block text-sm font-medium leading-6 text-gray-900">
                                                                    {t('ProfileSettings_Phone')}
                                                                </label>
                                                                <div className="mt-2">
                                                                    <PhoneNumberNoLableComponent
                                                                        value={values.textmask}
                                                                        id="textmask"
                                                                        onChange={changePhoneNumber}
                                                                        error={errors.phoneNumber}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-6 flex-grow lg:ml-6 lg:mt-0 lg:flex-shrink-0 lg:flex-grow-0">
                                                            <p className="text-sm font-medium leading-6 text-gray-900" aria-hidden="true">
                                                                {t('ProfileSettings_Photo')}
                                                            </p>
                                                            <div className="mt-2 lg:hidden">
                                                                <div className="flex items-center">
                                                                    <div
                                                                        className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                                                                        aria-hidden="true"
                                                                    >
                                                                        <img src={userImage ? `${baseUrl}/uploads/${userImage}` : `${baseUrl}/uploads/user404.webp`} alt="User" className="h-12 w-12 rounded-full" />
                                                                    </div>
                                                                    <div className="relative ml-5">
                                                                        <input
                                                                            id="mobile-user-photo"
                                                                            name="user-photo"
                                                                            type="file"
                                                                            accept="image/*"
                                                                            onChange={handleFileChange}
                                                                            className="peer absolute h-full w-full rounded-md opacity-0"
                                                                        />
                                                                        <label
                                                                            htmlFor="mobile-user-photo"
                                                                            className="pointer-events-none block rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 peer-hover:ring-gray-400 peer-focus:ring-2 peer-focus:ring-sky-500"
                                                                        >
                                                                            <span>{t('ProfileSettings_Change')}</span>
                                                                            <span className="sr-only"> {t('ProfileSettings_UserPhoto')}</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="relative hidden overflow-hidden rounded-full lg:block">
                                                                <img src={userImage ? `${baseUrl}/uploads/${userImage}` : `${baseUrl}/uploads/user404.webp`} alt="User" className="h-40 w-40 rounded-full" />
                                                                <label
                                                                    htmlFor="desktop-user-photo"
                                                                    className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-0 hover:opacity-100"
                                                                >
                                                                    <span>{t('ProfileSettings_Change')}</span>
                                                                    <span className="sr-only"> {t('ProfileSettings_UserPhoto')}</span>
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        // onChange={changeImage}
                                                                        onChange={handleFileChange}
                                                                        id="desktop-user-photo"
                                                                        name="user-photo"
                                                                        className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                                                                    />
                                                                </label>
                                                            </div>

                                                            {modalOpen && selectedFile && (
                                                                <Modal
                                                                    changeImage={changeImage}
                                                                    closeModal={() => setModalOpen(false)}
                                                                    file={selectedFile}
                                                                />
                                                            )}

                                                        </div>
                                                    </div>

                                                    <div className="mt-6 grid grid-cols-12 gap-6">
                                                        <div className="col-span-12 sm:col-span-6">
                                                            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                                                                {t('ProfileSettings_FirstName')}
                                                            </label>
                                                            <div className="mt-2 flex rounded-md shadow-sm">
                                                                <TextFieldNoLableComponent
                                                                    id="firstName"
                                                                    name="firstName"
                                                                    value={formData.firstName}
                                                                    onChange={handleChange}
                                                                    error={errors.firstName}
                                                                    autoComplete="firstName"
                                                                    maxLength={50}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12 sm:col-span-6">
                                                            <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                                                                {t('ProfileSettings_LastName')}
                                                            </label>
                                                            <div className="mt-2 flex rounded-md shadow-sm">
                                                                <TextFieldNoLableComponent
                                                                    name="lastName"
                                                                    id="lastName"
                                                                    value={formData.lastName}
                                                                    onChange={handleChange}
                                                                    error={errors.lastName}
                                                                    autoComplete="lastName"
                                                                    maxLength={50}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12 sm:col-span-6">
                                                            <label htmlFor="birthday" className="block text-sm font-medium leading-6 text-gray-900">
                                                                {t('ProfileSettings_Birthday')}
                                                            </label>

                                                            <div className="mt-2 flex rounded-md shadow-sm">
                                                                {/* <BirthdayComponent
                                                                    birthday={formData.birthday}
                                                                    handleChange={handleChange}
                                                                /> */}

                                                                <MyDatePicker
                                                                    birthday={formData.birthday}
                                                                    handleChange={handleChange}
                                                                    name="birthday"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12 sm:col-span-6">
                                                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                                                {t('ProfileSettings_CurrentPassword')}
                                                            </label>
                                                            <div className="mt-2 flex rounded-md shadow-sm">
                                                                <PasswordFieldNoLableComponent
                                                                    name="password"
                                                                    id="password"
                                                                    value={formData.password}
                                                                    onChange={handleChange}
                                                                    error={errors.password}
                                                                    autoComplete="password"
                                                                    showPassword={showCurrentPassword}
                                                                    handlePasswordToggle={currentPasswordToggle}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12 sm:col-span-6">
                                                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                                                {t('User_AuthType')}
                                                            </label>
                                                            <div className="mt-2 flex rounded-md shadow-sm">
                                                                <AuthTypeSelect
                                                                    authTypeList={authTypeList}
                                                                    selectedAuthType={selectedAuthType}
                                                                    handleAuthTypeChange={handleAuthTypeChange}
                                                                    errors={errors}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12 sm:col-span-6">
                                                            <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                                                                {t('User_Role')}
                                                            </label>
                                                            <div className="mt-2 flex rounded-md shadow-sm">
                                                                <RoleSelect
                                                                    rolesList={rolesList}
                                                                    selectedRole={selectedRole}
                                                                    handleRoleChange={handleRoleChange}
                                                                    errors={errors}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12 sm:col-span-6">
                                                            <FormGroup>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={formData.isBlocked}
                                                                            onChange={(e) => setFormData(prevData => ({ ...prevData, isBlocked: e.target.checked }))}
                                                                            color="primary"
                                                                        />
                                                                    }
                                                                    label={t('ProfileSettings_BlockUser')}
                                                                />
                                                            </FormGroup>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* New password section */}
                                                <div className=" pt-6 ">
                                                    <div className="mt-4 flex justify-end gap-x-3 px-4 py-4 sm:px-6">
                                                        <div className="flex justify-end w-64">

                                                            <FormControl fullWidth variant="outlined">
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
                                                            </FormControl>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </ThemeProvider>
                                </div>
                            </div>
                        </div>
                        {isLoaderModal && (
                                <LoaderModal />
                            )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default EditUser;