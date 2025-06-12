import { useTranslation } from 'react-i18next';

const WarrantyProductCare = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-gray-100 min-h-[900px]">
            <div className="max-w-2xl px-2 py-8 text-gray-700 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold mb-4 text-center">{t('WarrantyProductCare_Title')}</h2>

                <h3 className="text-2xl font-bold mb-2">{t('WarrantyProductCare_WarrantyTerms')}</h3>

                <p className="text-lg mb-6">{t('WarrantyProductCare1')}</p>

                <ol className="list-decimal list-inside text-lg mb-6">
                    <li>{t('WarrantyProductCare2')}</li>
                    <li>{t('WarrantyProductCare3')}</li>
                    <li>{t('WarrantyProductCare4')}</li>
                </ol>

                <p className="text-lg mb-6">{t('WarrantyProductCare5')}</p>

                <ul className="list-disc list-inside text-lg mb-6">
                    <li>{t('WarrantyProductCare6')}</li>
                    <li>{t('WarrantyProductCare7')}</li>
                    <li>{t('WarrantyProductCare8')}</li>
                </ul>

                <p className="text-lg mb-6">{t('WarrantyProductCare9')}</p>

                <ul className="list-disc list-inside text-lg mb-6">
                    <li>{t('WarrantyProductCare10')}</li>
                    <li>{t('WarrantyProductCare11')}</li>
                    <li>{t('WarrantyProductCare12')}</li>
                </ul>

                <p className="text-lg mb-6">{t('WarrantyProductCare13')}</p>

                <ul className="list-disc list-inside text-lg mb-6">
                    <li>{t('WarrantyProductCare14')}</li>
                    <li>{t('WarrantyProductCare15')}</li>
                    <li>{t('WarrantyProductCare16')}</li>
                    <li>{t('WarrantyProductCare17')}</li>
                    <li>{t('WarrantyProductCare18')}</li>
                </ul>

                <h3 className="text-2xl font-bold mb-2">{t('WarrantyProductCare19')}</h3>

                <p className="text-lg mb-6">{t('WarrantyProductCare20')}</p>

                <ul className="list-disc list-inside text-lg">
                    <li>{t('WarrantyProductCare21')}</li>
                    <li>{t('WarrantyProductCare22')}</li>
                    <li>{t('WarrantyProductCare23')}</li>
                    <li>{t('WarrantyProductCare24')}</li>
                    <li>{t('WarrantyProductCare25')}</li>
                    <li>{t('WarrantyProductCare26')}</li>
                </ul>
            </div>
        </div>
    );
};

export default WarrantyProductCare;
