import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChangeEvent, FormEvent, useEffect, Fragment, useState } from "react";
import { IOrderCreate } from '../../../../../interfaces/Bag/IOrderCreate';
import { createOrder } from '../../../../../services/order/order-services';
import { useDispatch } from 'react-redux';
import { FormControl, MenuItem, TextField } from '@material-ui/core';
import '../../../../../satoshi.css';
import "./index.css";
import mastercard from '../../../../../assets/mastercard.webp'
import visa from '../../../../../assets/visa.webp'
import CardTextFieldNoLableComponent from '../../../../../ui/input-for-card/CardTextFieldComponent';
import { Theme, ThemeProvider } from '@material-ui/core/styles';
import { validateForm } from '../../../../../validations/bag/card-validations';
import { t } from "i18next";
import LoaderModal from '../../../../../common/Loader/loaderModal';

interface VisaCreditCardProps {
    theme: Theme;
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    model: IOrderCreate;
}

const VisaCreditCard: React.FC<VisaCreditCardProps> = ({ isOpen, setOpen, model, theme }) => {
    const dispatch = useDispatch();
    const [isLoaderModal, setIsLoaderModal] = useState(false);
    const [cardData, setCardData] = useState({
        creditCardNumber: '',
        creditCardHolderName: '',
        creditCardExpMonth: '',
        creditCardExpYear: '',
        creditCardCvv: '',
    });
    const [errors, setErrors] = useState({
        creditCardNumber: '',
        creditCardHolderName: '',
        creditCardExpMonth: '',
        creditCardExpYear: '',
        creditCardCvv: '',
    });

    const [shouldFlipCreditCardOnCvv, setShouldFlipCreditCardOnCvv] = useState(false);
    const [creditCardYearRangeArr, setCreditCardYearRangeArr] = useState<number[]>([]);
    const getExpYearRange = () => {
        const currentYear = new Date().getUTCFullYear();
        const yearRangeArr = Array.from({ length: 11 }, (_, i) => currentYear + i);
        setCreditCardYearRangeArr(yearRangeArr);
    };

    const formatCreditCardNumber = (creditCardNumber: string) => {
        return creditCardNumber.replace(/(\d{4})/g, '$1 ').trim();
    };

    const handleSubmit = async (eventOfSubmission: FormEvent) => {
        eventOfSubmission.preventDefault();

        const { isValid, newErrors } = validateForm(cardData);
        setErrors(newErrors);

        if (isValid) {
            try {
                setIsLoaderModal(true);
                model.payment = 'The money has been paid';
                await createOrder(model, dispatch);
            }
            catch (error) {
                console.error("error:", error);
            }
            finally {
                setIsLoaderModal(false);
            }
        }
    };

    const cardNumberOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCardData((prevData) => ({
            ...prevData,
            creditCardNumber: event.target.value,
        }));
        model.cardNumber = event.target.value;
        setShouldFlipCreditCardOnCvv(false);
    };

    const cardHolderNameOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCardData((prevData) => ({
            ...prevData,
            creditCardHolderName: event.target.value,
        }));
        model.cardHolderName = event.target.value;
        setShouldFlipCreditCardOnCvv(false);
    };

    const monthOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const month = event.target.value;

        setCardData((prevData) => ({
            ...prevData,
            creditCardExpMonth: month.toString(),
        }));
        model.cardMonthExpires = month.toString();
        setShouldFlipCreditCardOnCvv(true);
    };

    const yearOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const year = event.target.value;
        setCardData((prevData) => ({
            ...prevData,
            creditCardExpYear: year.toString(),
        }));
        model.cardYearExpires = year.toString();
        setShouldFlipCreditCardOnCvv(true);
    };

    const cvvOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCardData((prevData) => ({
            ...prevData,
            creditCardCvv: event.target.value,
        }));
        setShouldFlipCreditCardOnCvv(true);
    };

    const cvvOnBlur = () => {
        setShouldFlipCreditCardOnCvv(false);
    };

    useEffect(() => {
        getExpYearRange();
    }, []);

    const handleClose = () => {
        setOpen(true);
    };

    const renderLogo = () => {
        if (model.paymentMethod === '') {
            return;
        }

        let logo: string | undefined = undefined;

        switch (model.paymentMethod) {
            case 'Mastercard':
                logo = mastercard;
                break;
            case 'Visa':
                logo = visa;
                break;
            default:
        }

        return <img src={logo} />
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 hidden bg-gray-300 bg-opacity-80 transition-opacity md:block" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            enterTo="opacity-100 translate-y-0 md:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 md:scale-100"
                            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        >
                            <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                                <div className="relative flex w-full items-center overflow-hidden bg-gray-100 px-4 pb-8 pt-14  sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                    <button
                                        type="button"
                                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                                        onClick={() => setOpen(false)}
                                        tabIndex={0}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>

                                    <div className="checkout react-fancy-visa-card">
                                        <div className={`credit-card-box ${shouldFlipCreditCardOnCvv ? 'hover' : ''}`}>
                                            <div className="flip">
                                                <div className="front bg-gradient-to-br from-blue-500 to-blue-700 relative rounded-lg p-8 text-white">
                                                    <div className="chip absolute w-16 h-12 top-2 left-2  rounded-lg"></div>
                                                    <div className="logo absolute w-26 h-22 top-2 m-2">{renderLogo()}</div>
                                                    <div className="number text-3xl">{formatCreditCardNumber(cardData.creditCardNumber)}</div>
                                                    <div className="card-holder">
                                                        <label className="text-xs opacity-50">{t('Bag_Card_CardHolder')}</label>
                                                        <div className="text-lg">{cardData.creditCardHolderName}</div>
                                                    </div>
                                                </div>
                                                <div className="back bg-gradient-to-br from-blue-500 to-blue-700 relative rounded-lg p-8 text-white transform rotate-y-180">
                                                    <div className="strip h-1/5 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600"></div>
                                                    <div className="logo"></div>
                                                    <div className="ccv">
                                                        <label className="text-xs opacity-50">CCV</label>
                                                        <div>{cardData.creditCardCvv}</div>
                                                    </div>
                                                    <div className="card-expiration-date">
                                                        <label className="text-xs opacity-50">{t('Bag_Card_Expires')}</label>
                                                        <div>{cardData.creditCardExpMonth}/{cardData.creditCardExpYear.slice(-2)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <ThemeProvider theme={theme}>
                                            <form className="form" autoComplete="off" noValidate onSubmit={handleSubmit}>
                                                <fieldset>
                                                    <label htmlFor="card-number">{t('Bag_Card_CardNumber')}</label>
                                                    <CardTextFieldNoLableComponent
                                                        name="card-number"
                                                        id="card-number"
                                                        value={cardData.creditCardNumber || ''}
                                                        onChange={cardNumberOnChange}
                                                        error={errors.creditCardNumber ?? null}
                                                        autoComplete="card-number"
                                                        maxDigits={16}
                                                        inputType={'digits'}
                                                    />
                                                </fieldset>
                                                <fieldset>
                                                    <label htmlFor="card-holder">{t('Bag_Card_CardHolder')}</label>
                                                    <CardTextFieldNoLableComponent
                                                        name="card-holder"
                                                        id="card-holder"
                                                        value={cardData.creditCardHolderName || ''}
                                                        onChange={cardHolderNameOnChange}
                                                        error={errors.creditCardHolderName ?? null}
                                                        autoComplete="card-holder"
                                                        maxDigits={40}
                                                        inputType={'letters'}
                                                    />
                                                </fieldset>
                                                <fieldset className="fieldset-expiration">
                                                    <label className="expiration" htmlFor="card-expiration-month">
                                                        {t('Bag_Card_CardExpiration')}
                                                    </label>
                                                    <div className="select">
                                                        <FormControl fullWidth variant="outlined">
                                                            <TextField
                                                                id="card-expiration-month"
                                                                select
                                                                onChange={monthOnChange}
                                                                error={!!errors.creditCardExpMonth}
                                                                value={cardData.creditCardExpMonth || ''}
                                                                onBlur={cvvOnBlur}
                                                            >
                                                                {Array.from({ length: 12 }, (_, i) => (
                                                                    <MenuItem key={i} value={String(i + 1).padStart(2, "0")}
                                                                    >
                                                                        {String(i + 1).padStart(2, "0")}
                                                                    </MenuItem>
                                                                ))}

                                                            </TextField>
                                                        </FormControl>
                                                    </div>
                                                    <div className="select">
                                                        <FormControl fullWidth variant="outlined">
                                                            <TextField
                                                                id="card-expiration-year"
                                                                select
                                                                onChange={yearOnChange}
                                                                error={!!errors.creditCardExpYear}
                                                                value={cardData.creditCardExpYear || ''}
                                                                onBlur={cvvOnBlur}
                                                            >
                                                                {creditCardYearRangeArr.map((year, index) => (
                                                                    <MenuItem key={index} value={year}
                                                                    >
                                                                        {year}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                        </FormControl>
                                                    </div>
                                                </fieldset>
                                                <fieldset className="fieldset-ccv mb-7">
                                                    <label htmlFor="card-ccv">CCV</label>
                                                    <CardTextFieldNoLableComponent
                                                        name="card-ccv"
                                                        id="card-ccv"
                                                        value={cardData.creditCardCvv || ''}
                                                        onChange={cvvOnChange}
                                                        error={errors.creditCardCvv ?? null}
                                                        autoComplete="card-ccv"
                                                        maxDigits={3}
                                                        onBlur={cvvOnBlur}
                                                        inputType={'digits'}
                                                    />
                                                </fieldset>
                                                <FormControl fullWidth variant="outlined" className='pt-7'>
                                                    <button
                                                        type="submit"
                                                        disabled={isLoaderModal}
                                                        className={`flex w-full items-center justify-center rounded-md border  ${isLoaderModal ? 'bg-gray-300' : "bg-indigo-600 hover:bg-indigo-700"}
                                                    px-8 py-3 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>
                                                        {t('Bag_Card_PayNow')}
                                                    </button>
                                                </FormControl>
                                            </form>
                                        </ThemeProvider>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
                {isLoaderModal && (
                    <LoaderModal />
                )}
            </Dialog>
        </Transition.Root>
    );
};

export default VisaCreditCard;
