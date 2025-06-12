import { useTranslation } from 'react-i18next';
import { APP_ENV } from '../env/config';
import { getCurrentYear, getSeason } from '../utils/seasons/getSeason';

export const useCollections = () => {
    const { t } = useTranslation();
    const baseUrl = APP_ENV.BASE_URL;

    const createUrl = (basePath: string, params: Record<string, string | number>): string => {
        const searchParams = new URLSearchParams();
    
        Object.keys(params).forEach(key => {
            const value = params[key];
            if (Array.isArray(value)) {
                searchParams.append(key, value.join(','));
            } else {
                searchParams.append(key, value.toString());
            }
        });
    
        return `${basePath}?${searchParams.toString()}`;
    };
    return [
        {
            id: 1,
            gender: 'Women',
            name: t('Navbars_NewArrivals'),
            href: createUrl('/catalog-home/women', { Sort: 'newest' }),
            imageSrc: `${baseUrl}/uploads/800_home_page_2.webp`,
            imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
            id: 2,
            gender: 'Women',
            name: `${t('Navbars_Season_Autumn_Winter')} ${getCurrentYear()}`,
            href: createUrl('/catalog-home/women', { season: 'autumn_winter' }),
            imageSrc: `${baseUrl}/uploads/800_home_page_13.webp`,
            imageAlt: 'Close up of autumn winter collection. Shop now.',
            visibleIn: ['autumn_winter'],
        },
        {
            id: 3,
            gender: 'Women',
            name: `${t('Navbars_Season_Spring_Summer')} ${getCurrentYear()}`,
            href: createUrl('/catalog-home/women', { season: 'spring_summer' }),
            imageSrc: `${baseUrl}/uploads/800_home_page_7.webp`,
            imageAlt: 'Close up of spring summer collection. Shop now.',
            visibleIn: ['spring_summer'],
        },
        {
            id: 4,
            gender: 'Men',
            name: t('Navbars_NewArrivals'),
            href: createUrl('/catalog-home/men', { Sort: 'newest' }),
            imageSrc: `${baseUrl}/uploads/800_home_page_15.webp`,
            imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
            id: 5,
            gender: 'Men',
            name: `${t('Navbars_Season_Autumn_Winter')} ${getCurrentYear()}`,
            href: createUrl('/catalog-home/men', { season: 'autumn_winter' }),
            imageSrc: `${baseUrl}/uploads/800_home_page_14.webp`,
            imageAlt: 'Close up of autumn winter collection. Shop now.',
            visibleIn: ['autumn_winter'],
        },
        {
            id: 6,
            gender: 'Men',
            name: `${t('Navbars_Season_Spring_Summer')} ${getCurrentYear()}`,
            href: createUrl('/catalog-home/men', { season: 'spring_summer' }),
            imageSrc: `${baseUrl}/uploads/800_home_page_12.webp`,
            imageAlt: 'Close up of spring summer collection. Shop now.',
            visibleIn: ['spring_summer'],
        },
    ].filter(item => !item.visibleIn || item.visibleIn.includes(getSeason()));
};
