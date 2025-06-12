import { useTranslation } from 'react-i18next';

const DeliveryAndPayment = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-gray-100 min-h-[900px]">
            <div className="max-w-2xl px-2 py-8 text-gray-700 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold mb-4 text-center">{t('Footer_Delivery')}</h2>
                <p className="text-lg mb-6">{t('Delivery&Payment1')}</p>

                <p className="text-lg mb-6">
                    {t('Delivery&Payment2')}
                </p>

                <p className="text-lg mb-6">
                    {t('Delivery&Payment3')}
                </p>

                <p className="text-lg mb-6">
                    {t('Delivery&Payment4')}
                </p>

                <ul className="list-disc list-inside text-lg mb-6">
                    <li>{t('Delivery&Payment5')}</li>
                    <li>{t('Delivery&Payment6')}</li>
                </ul>

                <p className="text-lg mb-6">
                    {t('Delivery&Payment7')}
                </p>

                <p className="text-lg mb-6">
                    {t('Delivery&Payment8')}
                </p>

                <p className="text-lg mb-6">
                    {t('Delivery&Payment9')}
                </p>

                <p className="text-lg mb-6">
                    {t('Delivery&Payment10')}
                </p>

                <ol className="list-decimal list-inside text-lg mb-6">
                    <li>{t('Delivery&Payment11')}</li>
                    <li>{t('Delivery&Payment12')}</li>
                    <li>{t('Delivery&Payment13')}</li>
                </ol>

                <p className="text-lg mb-6">
                    {t('Delivery&Payment14')}
                </p>

                <p className="text-lg mb-6">
                    {t('Delivery&Payment15')}
                </p>

                <ul className="list-disc list-inside text-lg mb-6">
                    <li>{t('Footer_Phone1')}</li>
                    <li>{t('Footer_Phone2')}</li>
                    <li>{t('Footer_Phone3')}</li>
                    <li>{t('Footer_Phone4')}</li>
                </ul>

                <p className="text-lg mb-6">
                    {t('Delivery&Payment16')}
                </p>

                <p className="text-lg mb-6">
                    {t('Delivery&Payment17')}
                </p>

                <img src="http://localhost:5173/public/images/payment.webp" alt="Payment methods" />
            </div>
        </div>
    );
};

export default DeliveryAndPayment;
