import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-gray-100 min-h-[900px]">
            <div className="max-w-2xl px-2 py-8 text-gray-700 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold mb-4 text-center">{t('Footer_Privacy')}</h2>
                <h3 className="text-2xl font-bold mb-2">{t('Privacy_GeneralTerms')}</h3>

                <p className="text-lg mb-6">
                    {t('Privacy_GeneralTerms1')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_GeneralTerms2')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_GeneralTerms3')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_GeneralTerms4')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_GeneralTerms5')}
                </p>

                <h3 className="text-2xl font-bold mb-2">{t('Privacy_PersonalData')}</h3>

                <p className="text-lg mb-6">
                    {t('Privacy_PersonalData1')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_PersonalData2')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_PersonalData3')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_PersonalData4')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_PersonalData5')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_PersonalData6')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_PersonalData7')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_PersonalData8')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_PersonalData9')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_PersonalData10')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_PersonalData11')}
                </p>

                <h3 className="text-2xl font-bold mb-2">{t('Privacy_SiteContent')}</h3>

                <p className="text-lg mb-6">
                    {t('Privacy_SiteContent1')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_SiteContent2')}
                </p>

                <h3 className="text-2xl font-bold mb-2">{t('Privacy_UseOfMaterials')}</h3>

                <p className="text-lg mb-6">
                    {t('Privacy_UseOfMaterials1')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_UseOfMaterials2')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_UseOfMaterials3')}
                </p>

                <h3 className="text-2xl font-bold mb-2">{t('Privacy_FinalProvisions')}</h3>

                <p className="text-lg mb-6">
                    {t('Privacy_FinalProvisions1')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_FinalProvisions2')}
                </p>

                <p className="text-lg mb-6">
                    {t('Privacy_FinalProvisions3')}
                </p>

                <p className="text-lg">
                    {t('Privacy_FinalProvisions4')}
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
