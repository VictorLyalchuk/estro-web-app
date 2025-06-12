import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../../../node_modules/flag-icons/css/flag-icons.min.css';
import i18next from "i18next";
import {useTranslation} from "react-i18next";

interface Language {
    code: string;
    name: string;
}
interface FlagIconProps {
    countryCode: string;
}


function FlagIcon({ countryCode = "" }: FlagIconProps) {
    if (countryCode === "en") {
        countryCode = "gb";
    }
    if (countryCode === "uk") {
        countryCode = "ua";
    }
    return (
        <span
            className={`fi fis fi-${countryCode} fiCircle inline-block mr-2 fi-${countryCode}`}
        />
    );
}
const LanguageSelector = () => {
    const {t} = useTranslation();
    const languages: Language[] = [
        { code: 'en', name: t('LanguageSelector_Eng') },
        { code: 'es', name: t('LanguageSelector_Esp') },
        { code: 'fr', name: t('LanguageSelector_Fr') },
        { code: 'uk', name: t('LanguageSelector_Ukr') },
    ];
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef<any>(null);
    const dropdown = useRef<any>(null);
    const getInitialLanguage = () => {
        const storedLanguageCode = localStorage.getItem('i18nextLng');
        if (storedLanguageCode) {
            const foundLanguage = languages.find(lang => lang.code === storedLanguageCode);
            if (foundLanguage) {
                return foundLanguage;
            }
        }
        return languages[0];
    };

    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(getInitialLanguage());

    useEffect(() => {
        // Save selected language to localStorage when it changes
        if (selectedLanguage) {
            localStorage.setItem('i18nextLng', selectedLanguage.code);
        }
    }, [selectedLanguage]);
    const handleDropdownClick = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setDropdownOpen(!dropdownOpen);
    };

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!dropdown.current) return;
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    const changeLanguage = (language: Language) => {
        setSelectedLanguage(language);
        i18next.changeLanguage(language.code);
        window.location.reload(); // Reload the page when language changes
    };

    return (
        <div className="relative">
            <Link
                ref={trigger}
                onClick={handleDropdownClick}
                className="flex items-center gap-4 mt-3.5"
                to="#"
            >
                <div className=" text-right lg:block hover:text-indigo-500  ">
                </div>
                <div className="h-8.5 block text-sm font-medium text-gray-900 hover:text-indigo-500  whitespace-nowrap" >
                    {selectedLanguage && <FlagIcon countryCode={selectedLanguage.code} />}
                    {selectedLanguage?.code}
                </div>
            </Link>
            <div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute mt-4 flex w-34 flex-col rounded-sm border border-stroke bg-gray-100 shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? 'block' : 'hidden'
                    }`}
            >
                <div className="py-4 grid grid-cols-1 gap-5">
                    {languages.map((language, index) => {
                        return (
                            <button
                                key={language.code}
                                onClick={() => {changeLanguage(language); i18next.changeLanguage(language.code)}}
                                className={`${selectedLanguage?.code === language.code
                                    ? "bg-gray-100 text-gray-900 font-bold"
                                    : "text-gray-700"
                                    } block px-4 py-0 text-sm text-left items-center inline-flex hover:bg-gray-100 duration-300 ease-in-out text-gray-900 hover:text-indigo-500 ${index % 2 === 0 ? 'rounded-r' : 'rounded-l'}`}
                                role="menuitem"
                            >
                                <FlagIcon countryCode={language.code}/>
                                <span onClick={() => setDropdownOpen(false)} className="truncate">{language.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LanguageSelector;