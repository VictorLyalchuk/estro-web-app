import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SetStateAction, useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import '../../../../../index.css';
import '../../../../../satoshi.css';
import { APP_ENV } from "../../../../../env/config";
import { Button, FormControl } from '@material-ui/core';
import { GiftIcon } from '@heroicons/react/24/outline';
import { ILogin } from '../../../../../interfaces/Auth/ILogin';
import { IUser } from '../../../../../interfaces/Auth/IUser';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { AuthReducerActionType } from '../../../../../store/accounts/AuthReducer';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { useGoogleLogin } from '@react-oauth/google';
import { ThemeProvider } from '@material-ui/core/styles';
import ReactCodeInput from "react-code-input";
import { validateForm } from '../../../../../validations/account/login-validations';
import { validatePhoneNumber } from '../../../../../validations/custom/login-phone-validations';
import { login } from '../../../../../services/accounts/account-services';
import { theme } from '../../../../../theme/theme';
import { useStyles } from '../../../../../theme/styles';
import TextFieldComponent from '../../../../../ui/input-with-label/TextFieldComponent';
import PasswordFieldComponent from '../../../../../ui/input-with-label/PasswordFieldComponent';
import PhoneNumberComponent from '../../../../../ui/input-with-label/PhoneNumberComponent';
import { State } from '../../../../../interfaces/Catalog/State';
import { useTranslation } from "react-i18next";
import LoaderModal from '../../../../../common/Loader/loaderModal';

interface GoogleOAuthResponse {
    access_token: string;
}

const LoginPage = () => {
    const [isLoaderModal, setIsLoaderModal] = useState(false);
    const baseUrl = APP_ENV.BASE_URL;
    const twilio_auth_token = APP_ENV.TWILIO_AUTH_TOKEN;
    const twilio_acc_sid = APP_ENV.TWILIO_ACC_SID;
    const twilio_service_sid = APP_ENV.TWILIO_SERVICE_SID;
    const [isChosen, setIsChosen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const classes = useStyles();
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    const [isPhone, setIsPhone] = useState(false);
    // const [isPhoneLogin, setIsPhoneLogin] = useState(false);
    const [isPhoneExists, setIsPhoneExists] = useState(false);
    const [verifySid, setVerifySid] = useState("");
    const [myToken, setMyToken] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const { t } = useTranslation();

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (isDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsDisabled(false);
        }
        return () => clearInterval(timer);
    }, [isDisabled, countdown]);

    const [values, setValues] = useState<State>({
        textmask: '(   )    -  -  ',
    });

    const [formData, setFormData] = useState<ILogin>({
        email: '',
        password: '',
        phoneNumber: '',
        authType: 'standard'
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        phoneNumber: '',
        authType: 'standard'
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { isValid, newErrors } = validateForm(formData, values.textmask);
        setErrors(newErrors);
        if (isValid) {
            setIsLoaderModal(true);
            try {
                await login(formData, dispatch);
                navigate("/");
            } catch (error) {
                console.error("Login error:", error);
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.message || t('LoginPage_InvalidEmailOrPassword');
                    setErrorMessage(errorMessage);
                } else {
                    setErrorMessage(t('LoginPage_InvalidEmailOrPassword'));
                }
                setTimeout(() => {
                    setErrorMessage("");
                }, 1000);
            }
            finally {
                setIsLoaderModal(false);
            }
        };
    }

    const handleSubmitPhone = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsLoaderModal(true);
        event.preventDefault();
        try {
            const response = await axios.post(`${baseUrl}/api/AccountControllers/LoginByPhone?phone=${formData.phoneNumber}`, {});

            if (response.status === 200) {
                setIsPhoneExists(true);
                // console.log(response.data);
                setVerifySid(response.data.token.sid);
                setMyToken(response.data.token.token);
            }

        } catch (error) {
            console.error("Login error:", error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || t('LoginPage_InvalidEmailOrPassword');
                setErrorMessage(errorMessage);
            } else {
                setErrorMessage(t('LoginPage_InvalidEmailOrPassword'));
            }
            setTimeout(() => {
                setErrorMessage("");
            }, 1000);
        }
        finally {
            setIsLoaderModal(false);
        }
    }

    const handleCodeConfirm = async () => {
        setIsLoaderModal(true);

        try {
            const response = await axios.post(
                `https://verify.twilio.com/v2/Services/${twilio_service_sid}/VerificationCheck`,
                new URLSearchParams({
                    Code: pinCode,
                    VerificationSid: verifySid
                }),
                {
                    auth: {
                        username: twilio_acc_sid,
                        password: twilio_auth_token
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.status === 200 && response.data.status === "approved") {
                console.log(response.data);
                const token = myToken;
                const user = jwtDecode(token) as IUser;
                dispatch({
                    type: AuthReducerActionType.LOGIN_USER,
                    payload: {
                        Email: user.Email,
                        FirstName: user.FirstName,
                        LastName: user.LastName,
                        Role: user.Role,
                        ImagePath: user.ImagePath,
                        PhoneNumber: user.PhoneNumber,
                        AuthType: user.AuthType
                    } as IUser,
                });

                localStorage.setItem("token", token);
                navigate("/");

                console.log("approved");
                setIsPhone(false); setIsPhoneExists(false);
            } else {
                setPinCode("");
                setIsDisabled(true);
                setTimeout(() => {
                    setIsDisabled(false);
                }, 30000); // 30 seconds

                setIsPhoneExists(false);
                throw new Error("Verification failed");
            }

        } catch (error) {
            setPinCode("");
            setIsDisabled(true);
            setTimeout(() => {
                setIsDisabled(false);
            }, 30000); // 30 seconds

            setIsPhoneExists(false);
            console.error("Verification error:", error);
            setErrorMessage(t('LoginPage_InvalidCodeOrVerification'));
            setTimeout(() => {
                setErrorMessage("");
            }, 1000);
        }
        finally {
            setIsLoaderModal(false);
        }
    };

    const googleSuccess = async (response: GoogleOAuthResponse) => {
        // console.log(response);
        // console.log(i18next.language);

        if (response) {
            setIsLoaderModal(true);

            try {
                const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${response.access_token}`,
                        Accept: 'application/json',
                    },
                });
                const userData = res.data;
                console.log(userData);

                const loginData: ILogin = {
                    email: userData.email,
                    authType: 'google',
                    password: '',
                    phoneNumber: '',
                };

                console.log(loginData);

                try {
                    await login(loginData, dispatch);
                    navigate('/');
                } catch (error) {
                    console.error('Login error:', error);
                    if (axios.isAxiosError(error)) {
                        const errorMessage = error.response?.data?.message || t('LoginPage_InvalidEmailOrPassword');
                        setErrorMessage(errorMessage);
                    } else {
                        setErrorMessage(t('LoginPage_InvalidEmailOrPassword'));
                    }
                    setTimeout(() => {
                        setErrorMessage('');
                    }, 1000);
                }
            } catch (err) {
                console.log(err);
            }
            finally {
                setIsLoaderModal(false);
            }
        }
    };

    const googleErrorMessage = (error: any) => {
        console.log(error);
    };

    const handlePasswordToggle = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: googleSuccess,
        onError: googleErrorMessage
    });

    const handleChangePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    const [pinCode, setPinCode] = useState("");
    // const [btnIsPressed, setBtnIsPressed] = useState(false);

    const handlePinChange = (pinCode: SetStateAction<string>) => {
        setPinCode(pinCode);
        // setBtnIsPressed(false);
    };

    return (
        <>
            <div className="bg-gray-100">
                <div className="container mx-auto">
                    <div className="bg-white rounded-md shadow-md p-5 flex flex-col lg:flex-row">

                        <div className="order-1 lg:order-2 w-full lg:w-2/4 p-5 mb-8 lg:mb-0 flex flex-col justify-center items-center">
                            {!isChosen ? (
                                <div className={"flex-col flex "}>
                                    <div className={"text-center mb-3"}>
                                        <h2>{t('RegisterPage_ChooseOption')}</h2>
                                    </div>
                                    <div className={"flex-col bg-gray-100 p-10 rounded-2xl gap-2 w-59 flex"}>
                                        <Button onClick={() => { setIsEmail(true); setIsChosen(true); }} className={classes.button2} size="large">
                                            <svg className={"h-20 -ml-2"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g fill="none" stroke="#383843" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M1.75 3.75h12.5v9.5H1.75z" /><path d="m2.25 4.25l5.75 5l5.75-5" /></g></svg>
                                            <p className={"ml-2 lowercase"}>{t('RegisterPage_Email')}</p>
                                        </Button>
                                        <Button onClick={() => { setIsPhone(true); setIsChosen(true); }} className={classes.button2} size="large">
                                            <svg className={"h-20 -ml-4"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="#3d3d3d" d="M9 14a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zM7 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" /></svg>
                                            <p className={"lowercase"}>{t('RegisterPage_Phone')}</p>
                                        </Button>
                                        <Button onClick={() => loginGoogle()} className={classes.button2} size="large">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="#383843" d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8c-34.4 23-78.3 36.6-129.9 36.6c-99.9 0-184.4-67.5-214.6-158.2c-7.6-23-12-47.6-12-72.9s4.4-49.9 12-72.9c30.3-90.6 114.8-158.1 214.7-158.1c56.3 0 106.8 19.4 146.6 57.4l110-110.1c-66.5-62-153.2-100-256.6-100c-149.9 0-279.6 86-342.7 211.4c-26 51.8-40.8 110.4-40.8 172.4S151 632.8 177 684.6C240.1 810 369.8 896 519.7 896c103.6 0 190.4-34.4 253.8-93c72.5-66.8 114.4-165.2 114.4-282.1c0-27.2-2.4-53.3-6.9-78.5" /></svg>
                                            <p className={"ml-1.5 lowercase"}>Google</p>
                                        </Button>
                                    </div>

                                </div>
                            ) : (
                                !isEmail && !isPhone ? (
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gray-900">{t('RegisterPage_RegistrationSuccessful')}</h2>
                                        <br />
                                        <p className="text-gray-500">{t('RegisterPage_ProceedToLogin')}</p>
                                    </div>
                                ) : (
                                    isEmail ? (
                                        <div className="w-full mb-4">
                                            <form onSubmit={handleSubmitEmail}>
                                                <ThemeProvider theme={theme}>
                                                    <TextFieldComponent
                                                        label={t('LoginPage_Email')}
                                                        name="email"
                                                        id="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        error={errors.email}
                                                        autoComplete="email"
                                                        maxLength={30}
                                                        placeholder={''}
                                                    />
                                                    <PasswordFieldComponent
                                                        label={t('LoginPage_Password')}
                                                        name="password"
                                                        id="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        error={errors.password}
                                                        autoComplete="password"
                                                        showPassword={showPassword}
                                                        handlePasswordToggle={handlePasswordToggle}
                                                    />
                                                </ThemeProvider>
                                                <FormControl fullWidth className={classes.margin} variant="outlined">
                                                    <Button className={classes.button} type="submit" variant="contained" size="large" color="primary" disableElevation>
                                                        {t('LoginPage_SignIn')}
                                                    </Button>
                                                    <Button
                                                        className={classes.button}
                                                        type="button"
                                                        variant="contained"
                                                        size="large"
                                                        color="primary"
                                                        onClick={() => { setIsChosen(false); setIsEmail(false); setIsDisabled(false); }}
                                                    >
                                                        {t('RegisterPage_Cancel')}
                                                    </Button>
                                                </FormControl>
                                            </form>
                                        </div>

                                    ) : (
                                        <div className="w-full mb-4">
                                            <form onSubmit={handleSubmitPhone}>
                                                <ThemeProvider theme={theme}>
                                                    <PhoneNumberComponent
                                                        value={values.textmask}
                                                        label={t('LoginPage_PhoneNumber')}
                                                        id="textmark"
                                                        onChange={handleChangePhoneNumber}
                                                        error={errors.phoneNumber}
                                                    />
                                                </ThemeProvider>

                                                {isPhoneExists ? (
                                                    <FormControl fullWidth className={classes.margin}>
                                                        <div className={"justify-center text-center flex-col"}>
                                                            <div>
                                                                <ReactCodeInput
                                                                    inputMode={"numeric"}
                                                                    name="pinCode"
                                                                    fields={6}
                                                                    onChange={handlePinChange}
                                                                    value={pinCode}
                                                                />
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                ) : null}
                                                <FormControl fullWidth className={classes.margin}>
                                                    {!isPhoneExists ? (
                                                        <Button className={classes.button} disabled={isDisabled} type="submit" variant="contained" size="large" color="primary" disableElevation>
                                                            {isDisabled ? t('LoginPage_SendCode') + `(${countdown}s)` : t('LoginPage_SendCode')}
                                                        </Button>
                                                    ) : (
                                                        <Button className={classes.button} onClick={handleCodeConfirm} type="button" variant="contained" size="large" color="primary" disableElevation>
                                                            {t('LoginPage_SignIn')}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        className={classes.button}
                                                        type="button"
                                                        variant="contained"
                                                        size="large"
                                                        color="primary"
                                                        onClick={() => { setIsChosen(false); setIsPhone(false); setIsDisabled(false); }}
                                                    >
                                                        {t('RegisterPage_Cancel')}
                                                    </Button>
                                                </FormControl>
                                            </form>
                                        </div>
                                    )
                                ))}
                        </div>

                        <div className="order-2 lg:order-2 w-full lg:w-2/4 p-5 lg:mb-0">
                            <div className="bg-white-container-login flex flex-col justify-center items-center h-full">
                                <h1 className="text-white text-9xl hover:text-indigo-300">estro</h1>
                                <p className="text-white text-sx mb-10 hover:text-indigo-300">{t('Logo_Paragraph')}</p>

                                <br />

                                <p className="text-center text-sx hover:text-indigo-300">
                                    {t('LoginPage_WelcomeBack')}
                                </p>
                                <br />

                                <p className="text-center text-sx hover:text-indigo-300">
                                    {t('LoginPage_CheckAccount')}
                                </p>
                                <br />
                                <ul className="list-disc text-sx text-left">
                                    <li className="mb-5 mt-2 flex justify-center items-center gap-x-3 relative hover:text-indigo-300">
                                        <BanknotesIcon className="h-7 w-7 text-gray-300" />
                                        <p className="text-center">
                                            {t('LoginPage_Rewards')}
                                        </p>
                                    </li>
                                    <li className="mb-5 mt-2 flex justify-center items-center gap-x-3 relative hover:text-indigo-300">
                                        <GiftIcon className="h-7 w-7 text-gray-300" />
                                        <p className="text-center">
                                            {t('LoginPage_Surprises')}
                                        </p>
                                    </li>
                                    <li className="mb-5 mt-2 flex justify-center items-center gap-x-3 relative hover:text-indigo-300" >
                                        <TrophyIcon className="h-7 w-7 text-gray-300" />
                                        <p className="text-center">
                                            {t('LoginPage_PersonalPromotions')}
                                        </p>
                                    </li>
                                </ul>

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
}
export default LoginPage;