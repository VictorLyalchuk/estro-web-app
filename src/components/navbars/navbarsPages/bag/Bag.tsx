import { useDispatch, useSelector } from "react-redux";
import { IAuthReducerState } from "../../../../store/accounts/AuthReducer";
import { useEffect, useState } from "react";
import { IBagUser } from "../../../../interfaces/Bag/IBagUser";
import { IBagReducerState } from "../../../../store/bag/BagReducer";
import { ICardReducerState } from "../../../../store/bag/CardReducer";
import { IOrderCreate } from "../../../../interfaces/Bag/IOrderCreate";
import GoodsNotFound from "../../../../assets/goods-not-found.png";
import { FormControl } from "@mui/material";
import '../../../../satoshi.css';
import { IStore } from "../../../../interfaces/Store/IStore";
import { getBagByEmail, getBagItemsByEmail } from "../../../../services/bag/bag-services";
import { theme } from "../../../../theme/theme";
import { validateForm } from "../../../../validations/bag/bag-validations";
import { State } from "../../../../interfaces/Catalog/State";
import { validatePhoneNumber } from "../../../../validations/custom/bag-phone-validations";
import { getCity, getCountry, getStore } from "../../../../services/shipping/shipping-services";
import PersonalInformation from "./bagComponents/PersonalInformation";
import DeliveryInformation from "./bagComponents/DeliveryInformation";
import PaymentInformation from "./bagComponents/PaymentInformation";
import OrderSummary from "./bagComponents/OrderSummary";
import VisaCreditCard from "./creditCard/VisaCreditCard";
import { ICity } from "../../../../interfaces/Address/ICity";
import { ICountry } from "../../../../interfaces/Address/ICountry";
import { t } from "i18next";
import { IUserProfile } from "../../../../interfaces/Auth/IUserProfile";
import { getUserData } from "../../../../services/accounts/account-services";
import LoaderModal from "../../../../common/Loader/loaderModal";

const Bag = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const { count } = useSelector((redux: any) => redux.bag as IBagReducerState);
  const bagItems = useSelector((state: { card: ICardReducerState }) => state.card.items) || [];
  const { discount } = useSelector((redux: any) => redux.card as ICardReducerState);
  const [isLoaderModal, setIsLoaderModal] = useState(false);
  const [bagUser, setBagUser] = useState<IBagUser>();
  const [orderModel, setOrderModel] = useState<IOrderCreate | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | ''>('');
  const [selectedShipping, setSelectedShipping] = useState<string | ''>('');
  const [countryOptions, setCountryOptions] = useState<ICountry[]>([]);
  const [cityOptions, setCityOptions] = useState<ICity[]>([]);
  const [storeOptions, setStoreOptions] = useState<IStore[]>([]);
  const [activeBlocks, setActiveBlocks] = useState<string[]>(['personal', 'delivery', 'payment']);
  const [isQuickviewOpen, setQuickviewOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<IUserProfile>();
  const [values, setValues] = useState<State>({
    textmask: '(   )    -  -  ',
  });

  const [formData, setFormData] = useState({
    firstName: user?.FirstName || '',
    lastName: user?.LastName || '',
    email: user?.Email || '',
    phoneNumber: user?.PhoneNumber || '',
    payment: t('Bag_Payment'),
    paymentMethod: '',
  });

  const [shippingData, setShippingData] = useState({
    country: '',
    city: '',
    state: '',
    street: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: "",
    city: "",
    state: "",
    street: "",
    paymentMethod: '',
    shipping: '',
  });

  useEffect(() => {
    if (user) {
      getBagByEmail(user?.Email).then(data => setBagUser(data));
      getBagItemsByEmail(user?.Email, dispatch);
      setValues((prevValues) => ({
        ...prevValues,
        textmask: user?.PhoneNumber,
      }));
      getUserData(user.Email)
          .then(data => setUserProfile(data))
          .catch(error => console.error('Error fetching user data:', error));
    }

    getCountry().then(resp => setCountryOptions(resp));
    getCity().then(resp => setCityOptions(resp));
    getStore().then(resp => setStoreOptions(resp));
  }, [user, count]);

  useEffect(() => {
    clearFields();
  }, [selectedShipping]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    const model: IOrderCreate = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phonenumber: formData.phoneNumber,
      email: formData.email,
      emailUser: user?.Email || "",
      payment: formData.payment,
      paymentMethod: selectedPayment,
      discount: discount,
      country: shippingData.country,
      city: shippingData?.city || "",
      state: shippingData.state || "",
      street: shippingData.street || "",

      cardHolderName: "",
      cardNumber: "",
      cardMonthExpires: "",
      cardYearExpires: "",
    };
    event.preventDefault();
    const { isValid, newErrors } = validateForm(formData, shippingData, selectedPayment, selectedShipping, values.textmask, setActiveBlocks);
    setErrors(newErrors);
    if (isValid) {
      try {
        setIsLoaderModal(true);
        await setOrderModel(model);
        setQuickviewOpen(true);
      } catch (error) {
        console.error("error:", error);
      }
      finally {
        setIsLoaderModal(false);
      }
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeShipping = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setShippingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const clearFields = async () => {
    setShippingData({
      country: '',
      city: '',
      state: '',
      street: '',
    });
  };

  const handleBlockClick = (blockName: string) => {
    setActiveBlocks((prevActiveBlocks) =>
        prevActiveBlocks.includes(blockName)
            ? prevActiveBlocks.filter((name) => name !== blockName)
            : [...prevActiveBlocks, blockName]
    );
  };

  return (
      <div className="bg-gray-100">
        <div className="container mx-auto p-8 flex  relative bg-gray-100 mx-auto max-w-screen-2xl px-2 sm:px-2 lg:px-2   flex-col lg:flex-row justify-between min-h-[780px]">
          {bagItems && bagItems.length > 0 ? (
              <>
                {/* Order Summary */}
                <OrderSummary
                    bagUser={bagUser}
                    bagItems={bagItems}
                    email={user?.Email}
                    dispatch={dispatch}
                />

                <div className="w-full lg:w-2/4 p-5 lg:mb-0">
                  <form onSubmit={onSubmit}>

                    {/* Personal Information */}
                    <PersonalInformation
                        theme={theme}
                        formData={formData}
                        handleChange={handleChange}
                        errors={errors}
                        activeBlock={activeBlocks}
                        handleBlockClick={handleBlockClick}
                        changePhoneNumber={changePhoneNumber}
                        values={values}
                    />

                    {/* Shipping */}
                    <DeliveryInformation
                        errors={errors}
                        activeBlock={activeBlocks}
                        handleBlockClick={handleBlockClick}
                        selectedShipping={selectedShipping}
                        setSelectedShipping={setSelectedShipping}
                        handleChangeShipping={handleChangeShipping}
                        //Store
                        countryOptions={countryOptions}
                        cityOptions={cityOptions}
                        storeOptions={storeOptions}
                        //Address Shipping
                        shippingData={shippingData}
                    />
                    {/* Payment */}
                    <PaymentInformation
                        theme={theme}
                        errors={errors}
                        formData={formData}
                        activeBlock={activeBlocks}
                        handleBlockClick={handleBlockClick}
                        selectedPayment={selectedPayment}
                        setSelectedPayment={setSelectedPayment}
                        bonusBalance={userProfile?.bonusBalance || 0}
                    />

                    {/* Checkout Button */}
                    <div className="mt-8 flex justify-end">
                      <FormControl fullWidth variant="outlined">
                        <button
                            type="submit"
                            className='flex w-full items-center justify-center rounded-md border bg-indigo-600 hover:bg-indigo-700
                  px-8 py-3 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                          {t('Bag_Confirm')}
                        </button>
                      </FormControl>
                    </div>
                  </form>

                  {isQuickviewOpen && orderModel && (
                      <VisaCreditCard
                          theme={theme}
                          isOpen={isQuickviewOpen}
                          setOpen={setQuickviewOpen}
                          model={orderModel}
                      />
                  )}
                </div>

                {isLoaderModal && (
                    <LoaderModal />
                )}
              </>
          ) : (
              <div className="container mx-auto p-8 flex justify-center relative bg-gray-100 mx-auto max-w-screen-2xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row">
                <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0">
                  <div className="mt-8 flex justify-center">
                    <img src={GoodsNotFound}></img>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <p>{t('Bag_NoItems')}</p>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div >
  );
}

export default Bag;