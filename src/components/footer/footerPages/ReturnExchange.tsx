import { useTranslation } from 'react-i18next';

const ReturnExchange = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-gray-100 min-h-[900px]">
            <div className="max-w-2xl px-2 py-8 text-gray-700 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8" style={{ minHeight: '900px' }}>
                <h2 className="text-4xl font-bold mb-4 text-center">{t('ReturnExchange_Title')}</h2>

                <p className="text-lg mb-6">{t('ReturnExchange1')}</p>

                <p className="text-lg mb-6">{t('ReturnExchange2')}</p>

                <p className="text-lg mb-6">{t('ReturnExchange3')}</p>

                <p className="text-lg mb-6">{t('ReturnExchange4')}</p>

                <p className="text-lg mb-6">{t('ReturnExchange5')}</p>

                <p className="text-lg mb-6">{t('ReturnExchange6')}</p>

                <p className="text-lg mb-6">{t('ReturnExchange7')}</p>

                <p className="text-lg mb-6">{t('ReturnExchange8')}</p>

                <p className="text-lg mb-6">{t('ReturnExchange9')}</p>

                <p className="text-lg mb-6">{t('ReturnExchange10')}</p>

                <ul className="list-disc list-inside text-lg mb-6">
                    <li className={"underline font-bold italic"}>{t('Footer_Phone1')}</li>
                    <li className={"underline font-bold italic"}>{t('Footer_Phone2')}</li>
                    <li className={"underline font-bold italic"}>{t('Footer_Phone3')}</li>
                    <li className={"underline font-bold italic"}>{t('Footer_Phone4')}</li>
                </ul>
            </div>
        </div>
    );
};

export default ReturnExchange;
