import { useState, useEffect } from 'react';
import { IHomeImage } from '../../../interfaces/Catalog/IHomeImage';
import { APP_ENV } from "../../../env/config";
import { GetAllImage } from '../../../services/images/images-services';
import Loader from '../../../common/Loader/loader';


const OurBrand = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const [images, setImages] = useState<IHomeImage[]>([]);
    const [loading, setLoading] = useState(false);
    const imageClass = "w-full h-full flex p-0 justify-center items-center object-cover grayscale transition duration-300 ease-in-out hover:grayscale-0";

    useEffect(() => {
        homePage();
    }, []);

    const homePage = async () => {
        setLoading(true);
        await GetAllImage()
            .then(data => setImages(data))
            .catch(error => console.error('Error fetching images data:', error));
        setLoading(false);
    }


    return (
        <div className="bg-gray-100">
            <div className="mx-auto max-w-2xl px-2 py-8 lg:max-w-screen-2xl lg:px-2 justify-center">
                <div className="flex flex-wrap justify-center">
                    {loading ? (
                        <tr>
                            <td colSpan={8} className="text-center py-4 min-h-[662px]">
                                <div className="min-h-[662px] flex items-center justify-center">
                                    <Loader />
                                </div>
                            </td>
                        </tr>
                    ) : (

                        images.length >= 15 && (
                            <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-screen-2xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                                <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block mt-7 bp-7">
                                    <img src={`${baseUrl}/uploads/${images[0].imagePath}`} className={imageClass} />
                                </div>

                                <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8 mt-7 bp-7">
                                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                        <img src={`${baseUrl}/uploads/${images[2].imagePath}`} className={imageClass} />
                                    </div>
                                    <div className="aspect-h-2 aspect-w-3 rounded-lg">
                                        <div className="bg-white-container-home flex flex-col justify-center items-center h-full p-4">
                                            <h1 className="text-white text-7xl hover:text-indigo-300">estro</h1>
                                            <p className="text-white text-sx mb-10 hover:text-indigo-300">SHOES & ACCESSORIES</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg mt-7 bp-7">
                                    <img src={`${baseUrl}/uploads/${images[3].imagePath}`} className={imageClass} />
                                </div>

                                <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block mt-7 bp-7">
                                    <img src={`${baseUrl}/uploads/${images[1].imagePath}`} className={imageClass} />
                                </div>

                                <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8 mt-7 bp-7">
                                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                        <img src={`${baseUrl}/uploads/${images[8].imagePath}`} className={imageClass} />
                                    </div>
                                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                        <img src={`${baseUrl}/uploads/${images[5].imagePath}`} className={imageClass} />
                                    </div>
                                </div>

                                <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8 mt-7 bp-7">
                                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                        <img src={`${baseUrl}/uploads/${images[6].imagePath}`} className={imageClass} />
                                    </div>
                                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                        <img src={`${baseUrl}/uploads/${images[4].imagePath}`} className={imageClass} />
                                    </div>
                                </div>

                                <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block mt-7 bp-7">
                                    <img src={`${baseUrl}/uploads/${images[8].imagePath}`} className={imageClass} />
                                </div>

                                <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8 mt-7 bp-7">
                                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                        <img src={`${baseUrl}/uploads/${images[9].imagePath}`} className={imageClass} />
                                    </div>
                                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                        <img src={`${baseUrl}/uploads/${images[12].imagePath}`} className={imageClass} />
                                    </div>
                                </div>

                                <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg mt-7 bp-7">
                                    <img src={`${baseUrl}/uploads/${images[11].imagePath}`} className={imageClass} />
                                </div>

                                <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block mt-7 bp-7">
                                    <img src={`${baseUrl}/uploads/${images[10].imagePath}`} className={imageClass} />
                                </div>

                                <div className="lg:grid lg:grid-cols-1 lg:gap-y-8 mt-7 bp-7">
                                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                        <img src={`${baseUrl}/uploads/${images[13].imagePath}`} className={imageClass} />
                                    </div>
                                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                        <img src={`${baseUrl}/uploads/${images[7].imagePath}`} className={imageClass} />
                                    </div>
                                </div>

                                <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg mt-7 bp-7">
                                    <img src={`${baseUrl}/uploads/${images[14].imagePath}`} className={imageClass} />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default OurBrand;