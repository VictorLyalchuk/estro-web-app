import {useTranslation} from "react-i18next";

const About = () => {
    const {t} = useTranslation();

    return (
        <div className="bg-gray-100 min-h-[900px]">
            <div className="max-w-5xl px-2 py-8 text-gray-700 mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100">
                <h2 className="text-4xl font-bold mb-4 text-center">{t('About_Title')}</h2>
                <p className="text-lg mb-6">
                    {t('About_Paragraph1')}
                </p>

                <p className="text-lg mb-6">
                    {t('About_Paragraph2')}
                </p>

                <p className="text-lg mb-6">
                    {t('About_Paragraph3')}
                </p>

                <p className="text-lg mb-6">
                    {t('About_Paragraph4')}
                </p>

                <p className="text-lg mb-6">
                    {t('About_Paragraph5')}
                </p>
            </div>
        </div>
    );
};

export default About;
