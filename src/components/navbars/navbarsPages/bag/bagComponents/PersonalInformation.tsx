import TextFieldComponent from '../../../../../ui/input-with-label/TextFieldComponent';
import PhoneNumberComponent from '../../../../../ui/input-with-label/PhoneNumberComponent';
import { ArrowDownIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { t } from "i18next";
import { Theme, ThemeProvider } from '@mui/material/styles';


interface PersonalInformationProps {
  theme: Theme;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
  };
  activeBlock: string[] | null;
  handleBlockClick: (block: string) => void;
  changePhoneNumber: (event: React.ChangeEvent<HTMLInputElement>) => void;
  values: {
    textmask: string;
  };
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  theme,
  formData,
  handleChange,
  errors,
  activeBlock,
  handleBlockClick,
  changePhoneNumber,
  values
}) => {
  return (
    <div className="bg-white p-5 rounded-md shadow-md mb-8">
      <div className="flex justify-between items-center mb-4" onClick={() => handleBlockClick('personal')}>
        <h3 className="text-2xl font-semibold cursor-pointer" >{t('Bag_PersonalInfo')}</h3>
        {activeBlock?.includes('personal') ? (
          <div className='group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-100 hover:border-gray-300 focus-within:outline-gray-300'>
            <ArrowDownIcon className="h-5 w-5 cursor-pointer stroke-gray-900 transition-all duration-500 group-hover:stroke-black" />
          </div>
        ) : (
          <div className='group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-100 hover:border-gray-300 focus-within:outline-gray-300'>
            <ArrowLongRightIcon className="h-5 w-5 cursor-pointer stroke-gray-900 transition-all duration-500 group-hover:stroke-black" />
          </div>
        )}
      </div>
      <div className="border-t pt-4">
        {activeBlock?.includes('personal') && (
          <div className="pb-4">
            <ThemeProvider theme={theme}>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Bag_PersonalInfo_FirstName')}
              </label>
              <TextFieldComponent
                label=""
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName ?? null}
                autoComplete="firstName"
                maxLength={30}
                placeholder={''}
              />
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Bag_PersonalInfo_LastName')}
              </label>
              <TextFieldComponent
                label=""
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName ?? null}
                autoComplete="lastName"
                maxLength={30}
                placeholder={''}
              />

              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Bag_PersonalInfo_Email')}
              </label>
              <TextFieldComponent
                label=""
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email ?? null}
                autoComplete="email"
                maxLength={30}
                placeholder={''}
              />

              <label htmlFor="textmask" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Bag_PersonalInfo_Phone')}
              </label>
              <PhoneNumberComponent
                value={values.textmask}
                label=""
                id="textmask"
                onChange={changePhoneNumber}
                error={errors.phoneNumber ?? null}
              />
            </ThemeProvider>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalInformation;