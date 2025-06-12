import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { useTranslation } from 'react-i18next';

export default function Logo() {
    const { t } = useTranslation();
    return (
        <>
            <header
                className="relative bg-white-container-header flex justify-center items-center text-center hover:text-indigo-500"
            >
                <Link to="/" className="relative z-10">
                    <h1 className="text-neon text-white text-9xl mb-1 mt-10 hover:text-indigo-300">estro</h1>
                    <p className="text-neon text-white text-sx mb-10 hover:text-indigo-100">{t('Logo_Paragraph')}</p>
                </Link>
            </header>
        </>
    )
}