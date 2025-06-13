import { useState } from 'react';
import { Button, FormControl } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import 'tailwindcss/tailwind.css';
import '../../../../../index.css';
import '../../../../../satoshi.css';
import { validateForm } from '../../../../../validations/account/reset-validations';
import { resetPassword } from '../../../../../services/accounts/account-services';
import { theme } from '../../../../../theme/theme';
import { useStyles } from '../../../../../theme/styles';
import PasswordFieldComponent from '../../../../../ui/input-with-label/PasswordFieldComponent';
import LoaderModal from '../../../../../common/Loader/loaderModal';
import { useTranslation } from 'react-i18next';

const ResetPassword: React.FC<{ email: string; token: string; }> = (proprs) => {
    const { t } = useTranslation();
    const classes = useStyles(theme);
    const [isLoaderModal, setIsLoaderModal] = useState(false);
    const [isResetPassword, setResetPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: proprs.email || '',
        token: proprs.token || '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { isValid, newErrors } = validateForm(formData);
        setErrors(newErrors);
        if (isValid) {
            try {
                setIsLoaderModal(true);
                await resetPassword(formData);
                setResetPassword(true);
            } catch (error) {
                console.error("Reset password error:", error);
                setErrorMessage("Reset password error. Try again later");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1000);
            }
            finally {
                setIsLoaderModal(false);
            }
        } else {
            console.log(formData);
        }
    };

    const handlePasswordToggle = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleConfirmPasswordToggle = () => {
        setConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    };

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto">
                    <div className="bg-white rounded-md shadow-md p-5 flex flex-col lg:flex-row">

                        <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0 flex flex-col justify-center items-center">
                            {isResetPassword ? (
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">{t('RestoredSuccessfully')}</h2>
                                    <br />
                                    <p className="text-gray-500">{t('Youhavesuccessfully')}</p>
                                </div>
                            ) : (
                                <div className="mb-24 ">
                                    <div className="sm:mx-auto sm:w-full sm:max-w-sm" >
                                        <h2 className="mt-5 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                        {t('ResetPassword')}
                                        </h2>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <ThemeProvider theme={theme}>
                                            <PasswordFieldComponent
                                                label={t('NewPassword')}
                                                name="newPassword"
                                                id="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                error={errors.newPassword}
                                                autoComplete="newPassword"
                                                showPassword={showPassword}
                                                handlePasswordToggle={handlePasswordToggle}
                                            />
                                            <PasswordFieldComponent
                                                label={t('ConfirmNewPassword')}
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                error={errors.confirmPassword}
                                                autoComplete="confirmNewPassword"
                                                showPassword={showConfirmPassword}
                                                handlePasswordToggle={handleConfirmPasswordToggle}
                                            />
                                        </ThemeProvider>
                                        <FormControl fullWidth variant="outlined">
                                            <Button sx={classes.button} type="submit" variant="contained" size="large" color="primary" disableElevation>
                                            {t('ResetPassword')}
                                            </Button>
                                        </FormControl>

                                    </form>

                                </div >
                            )}
                        </div >

                        <div className="w-full lg:w-2/4 p-5 lg:mb-0">

                            <div className="bg-white-container-login flex flex-col justify-center items-center h-full">
                                <h1 className="text-white text-9xl hover:text-indigo-300">estro</h1>
                                <p className="text-white text-sx mb-10 hover:text-indigo-300">{t('Logo_Paragraph')}</p>

                                <br />

                                <p className="text-center text-sx hover:text-indigo-300">
                                {t('ForgotPassword_Forgot?')}
                                </p>
                                <br />

                                <p className="text-center text-sx hover:text-indigo-300">
                                {t('ForgotPassword_FollowInstructions')}
                                </p>

                            </div>
                        </div>
                    </div >

                    {isLoaderModal && (
                        <LoaderModal />
                    )}

                    <div className={`fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 ${errorMessage ? 'block' : 'hidden'}`}>
                        <div className="bg-white p-4 rounded-md shadow-md">
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        </div>
                    </div>

                </div >
            </div >
        </>
    );
};

export default ResetPassword;
