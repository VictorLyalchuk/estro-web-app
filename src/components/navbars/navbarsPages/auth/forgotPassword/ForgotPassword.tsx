import { useState } from 'react';
import { Button, FormControl } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import '../../../../../satoshi.css';
import '../../../../../index.css';
import 'tailwindcss/tailwind.css';
import { forgotPassword } from '../../../../../services/accounts/account-services';
import { validateForm } from '../../../../../validations/account/forgot-validations';
import { theme } from '../../../../../theme/theme';
import { useStyles } from '../../../../../theme/styles';
import TextFieldComponent from '../../../../../ui/input-with-label/TextFieldComponent';
import { useTranslation } from "react-i18next";
import LoaderModal from '../../../../../common/Loader/loaderModal';

const ForgotPassword = ({ onPasswordResetConfirmation }: { onPasswordResetConfirmation: () => void }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isLoaderModal, setIsLoaderModal] = useState(false);
    const [isSendEmail, setSendEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: '',
    });

    const [errors, setErrors] = useState({
        email: '',
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
            setIsLoaderModal(true);
            try {
                await forgotPassword(formData.email);
                setSendEmail(true);
                onPasswordResetConfirmation();
            }
            catch (error) {
                console.error("Email error:", error);
                setErrorMessage("Invalid email");
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

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto">
                    <div className="bg-white rounded-md shadow-md p-5 flex flex-col lg:flex-row">
                        <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0 flex flex-col justify-center items-center">
                            {isSendEmail ? (
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">{t('ForgotPassword_EmailSuccessful')}</h2>
                                    <br />
                                    <p className="text-gray-500">
                                        {t('ForgotPassword_CheckEmail')}</p>
                                </div>
                            ) : (
                                <div className="mb-24 w-full">
                                    <div className="sm:mx-auto sm:w-full sm:max-w-sm" >
                                        <h2 className="mt-5 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                            {t('ForgotPassword_ForgotPassword')}
                                        </h2>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <ThemeProvider theme={theme}>
                                            <TextFieldComponent
                                                label={t('ForgotPassword_Email')}
                                                name="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                error={errors.email}
                                                autoComplete="email"
                                                maxLength={30}
                                                placeholder={''}
                                            />
                                        </ThemeProvider>
                                        <FormControl fullWidth variant="outlined">
                                            <Button className={classes.button} type="submit" variant="contained" size="large" color="primary" disableElevation>
                                                {t('ForgotPassword_ResetPassword')}
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

export default ForgotPassword;