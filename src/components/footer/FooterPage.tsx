import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube, faTelegram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import {useTranslation} from "react-i18next";

const FooterPage = () => {
    const {t} = useTranslation();

    return (

        <footer className="bg-gray-100 p-8 ">
            <div className="border-t p-8 mx-auto max-w-screen-2xl px-2 sm:px-2 lg:px-2 justify-items-center">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Column 1 */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-4 text-center">{t('Footer_Company')}</h3>
                        <ul className='text-gray-500'>
                            <li className="mb-1 hover:text-indigo-500 text-center">
                                <Link to="/about">{t('Footer_About')}</Link>
                            </li>
                            <li className="mb-1 hover:text-indigo-500 text-center">
                                <Link to="/our-brand">{t('Footer_Brand')}</Link>
                            </li>
                            <li className="mb-1 hover:text-indigo-500 text-center">
                                <Link to="/privacy-policy">{t('Footer_Privacy')}</Link>
                            </li>
                            <li className="mb-1 hover:text-indigo-500 text-center">
                                <Link to="/store-locations">{t('Footer_Stores')}</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-4 text-center">{t('Footer_Information')}</h3>
                        <ul className='text-gray-500'>
                            <li className="mb-1 hover:text-indigo-500 text-center">
                                <Link to="/delivery-and-payment">{t('Footer_Delivery')}</Link>
                            </li>
                            <li className="mb-1 hover:text-indigo-500 text-center">
                                <Link to="/return-exchange">{t('Footer_Return')}</Link>
                            </li>
                            <li className="mb-1 hover:text-indigo-500 text-center">
                                <Link to="/warranty-product-care">{t('Footer_Warranty')}</Link>
                            </li>
                            <li className="mb-1 hover:text-indigo-500 text-center">
                                <a href='https://www.google.com.ua/maps/search/estro+%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B8/@48.3857507,25.280604,6.75z?hl=uk&entry=ttu'>{t('Footer_Map')}</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-4 text-center">{t('Footer_Support')}</h3>
                        <ul className='text-gray-500'>
                            <li className="mb-1 hover:text-indigo-500 cursor-pointer text-center">
                                <a href="tel:+380991679999">{t('Footer_Phone1')}</a>
                            </li>
                            <li className="mb-1 hover:text-indigo-500 cursor-pointer text-center">
                                <a href="tel:+380981679999">{t('Footer_Phone2')}</a>
                            </li>
                            <li className="mb-1 hover:text-indigo-500 cursor-pointer text-center">
                                <a href="tel:+380731679999">{t('Footer_Phone3')}</a>
                            </li>
                            <li className="mb-1 hover:text-indigo-500 cursor-pointer text-center">
                                <a href="tel:+380800330770">{t('Footer_Phone4')}</a>
                            </li>
                            <li className="text-xs mb-4 text-gray-400 text-center">{t('Footer_WorkingDays')}</li>
                        </ul>
                    </div>
                    {/* Column 4 */}
                    <div className="mb-4 order-2 ">
                        <h3 className="text-lg font-bold mb-4 text-center">{t('Footer_SocMedia')}</h3>
                        <ul className="flex space-x-2 text-gray-500 flex justify-center">
                            <li className="mb-4 hover:text-indigo-500">
                                <a href="https://www.facebook.com/EstroUkraine"><FontAwesomeIcon icon={faFacebook} /></a>
                            </li>
                            <li className="mb-4 hover:text-indigo-500">
                                <a href="https://www.instagram.com/estro.ua"><FontAwesomeIcon icon={faInstagram} /></a>
                            </li>
                            <li className="mb-4 hover:text-indigo-500">
                                <a href="https://www.linkedin.com/company/estro-ua"><FontAwesomeIcon icon={faLinkedin} /></a>
                            </li>
                            <li className="mb-4 hover:text-indigo-500">
                                <a href="https://t.me/EstroUkraine"><FontAwesomeIcon icon={faTelegram} /></a>
                            </li>
                            <li className="mb-4 hover:text-indigo-500">
                                <a href="https://www.youtube.com/@EstroUkraine"><FontAwesomeIcon icon={faYoutube} /></a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500 hover:text-indigo-500">&copy; 2024 Estro Shop Team, Inc. {t('Footer_Rights')}.</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterPage;