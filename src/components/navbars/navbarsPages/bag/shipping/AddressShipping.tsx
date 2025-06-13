import TextFieldComponent from "../../../../../ui/input-with-label/TextFieldComponent";
import { theme } from "../../../../../theme/theme";
import { t } from "i18next";
import { ThemeProvider } from "@mui/material/styles";

interface AddressShippingProps {
    errors: { country?: string; city?: string; state?: string; street?: string };
    shippingData: { country: string, city: string, state: string, street: string, }
    handleChangeShipping: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddressShipping: React.FC<AddressShippingProps> = ({ shippingData, errors, handleChangeShipping }) => (
    <div className="mt-5">
        <ThemeProvider theme={theme}>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Bag_AddressShipping_Country')}
            </label>
            <TextFieldComponent
                label=""
                name="country"
                id="country"
                value={shippingData?.country}
                onChange={handleChangeShipping}
                error={errors.country ?? null}
                autoComplete="country"
                maxLength={30}
                placeholder={''}
            />
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Bag_AddressShipping_City')}
            </label>
            <TextFieldComponent
                label=""
                name="city"
                id="city"
                value={shippingData.city}
                onChange={handleChangeShipping}
                error={errors.city ?? null}
                autoComplete="city"
                maxLength={30}
                placeholder={''}
            />

            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Bag_AddressShipping_State')}
            </label>
            <TextFieldComponent
                label=""
                name="state"
                id="state"
                value={shippingData.state}
                onChange={handleChangeShipping}
                error={errors.state ?? null}
                autoComplete="state"
                maxLength={30}
                placeholder={''}
            />

            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Bag_AddressShipping_Street')}
            </label>
            <TextFieldComponent
                label=""
                name="street"
                id="street"
                value={shippingData.street}
                onChange={handleChangeShipping}
                error={errors.street ?? null}
                autoComplete="street"
                maxLength={50}
                placeholder={''}
            />
        </ThemeProvider>
    </div>
);

export default AddressShipping;