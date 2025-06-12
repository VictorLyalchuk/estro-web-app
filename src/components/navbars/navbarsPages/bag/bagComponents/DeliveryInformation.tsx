import { ThemeProvider } from '@material-ui/core/styles';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import StoreShipping from '../shipping/StoreShipping';
import { IStore } from '../../../../../interfaces/Store/IStore';
import { ArrowDownIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';
import AddressShipping from '../shipping/AddressShipping';
import { theme } from '../../../../../theme/theme';
import { ICity } from '../../../../../interfaces/Address/ICity';
import { ICountry } from '../../../../../interfaces/Address/ICountry';
import { useTranslation } from 'react-i18next';
import { BuildingStorefrontIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

interface DeliveryInformationProps {
  errors: { country?: string; city?: string; state?: string; street?: string; shipping?: string };

  activeBlock: string[] | null;
  handleBlockClick: (block: string) => void;
  selectedShipping: string;
  setSelectedShipping: (value: string) => void;
  storeOptions: IStore[];
  handleChangeShipping: (event: React.ChangeEvent<HTMLInputElement>) => void;
  countryOptions: ICountry[] | null;
  cityOptions: ICity[] | null;
  shippingData: { country: string, city: string, state: string, street: string };
}

const DeliveryInformation: React.FC<DeliveryInformationProps> = ({
  errors,
  activeBlock,
  handleBlockClick,
  selectedShipping,
  setSelectedShipping,
  handleChangeShipping,
  storeOptions,
  countryOptions,
  cityOptions,
  shippingData,
}) => {
  const { t } = useTranslation();

  const deliveryList = [
    { id: 'Address', title: t('Bag_AddressShipping_Title'), logo: <EnvelopeIcon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: t('Bag_AddressShipping_Subtitle') },
    { id: 'Store', title: t('Bag_StoreShipping_Title'), logo: <BuildingStorefrontIcon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: t('Bag_StoreShipping_Subtitle') },
  ];

  return (
    <div className="bg-white p-5 rounded-md shadow-md mb-8">
      <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => handleBlockClick('delivery')}>
        <h3 className="text-2xl font-semibold">{t('Bag_DeliveryInfo')}</h3>
        <div className="group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-100 hover:border-gray-300 focus-within:outline-gray-300">
          {activeBlock?.includes('delivery') ? (
            <ArrowDownIcon className="h-5 w-5 cursor-pointer stroke-gray-900 transition-all duration-500 group-hover:stroke-black" />
          ) : (
            <ArrowLongRightIcon className="h-5 w-5 cursor-pointer stroke-gray-900 transition-all duration-500 group-hover:stroke-black" />
          )}
        </div>
      </div>
      <div className="border-t pt-4">
        {activeBlock?.includes('delivery') && (
          <div className="pb-4">
            <ThemeProvider theme={theme}>
              <div>
                <RadioGroup value={selectedShipping} onChange={setSelectedShipping}>
                  <RadioGroup.Label className="sr-only">Delivery Information</RadioGroup.Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deliveryList.map((delivery) => (
                      <RadioGroup.Option
                        key={delivery.id}
                        value={delivery.id}
                        className={({ active, checked }) =>
                          `max-w-sm rounded overflow-hidden shadow-lg cursor-pointer hover:border-indigo-600 ${active ? 'border-2 border-indigo-600 ring-2 ring-indigo-600' : ''} ${checked ? 'ring-2 ring-indigo-600 border-2 border-indigo-600' : 'border-2 border-gray-200'} ${errors.shipping ? 'border-2 border-red-600' : ''}`
                        }
                      >
                        {({ checked }) => (
                          <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                              <RadioGroup.Label as="div" className="font-bold text-xl mb-2 mr-10">
                                {delivery.logo} {delivery.title}
                              </RadioGroup.Label>
                              {checked && <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />}
                            </div>
                            <p className="text-gray-700 text-base">{delivery.subtitle}</p>
                          </div>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {selectedShipping === 'Address' && (
                <AddressShipping
                  errors={errors}
                  shippingData={shippingData}
                  handleChangeShipping={handleChangeShipping}
                />
              )}

              {selectedShipping === 'Store' && (
                <StoreShipping
                  countryOptions={countryOptions}
                  cityOptions={cityOptions}
                  handleChangeShipping={handleChangeShipping}
                  shippingData={shippingData}
                  storeOptions={storeOptions}
                  errors={errors}
                />
              )}
            </ThemeProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryInformation;
