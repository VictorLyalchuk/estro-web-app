import { useRef, useState, useEffect } from "react";
import { getLocalizedField } from "../../utils/localized/localized";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { APP_ENV } from "../../env/config";
import { IProduct } from "../../interfaces/Product/IProduct";
import { Link } from "react-router-dom";

interface SimpleCarouselProps {
  product: IProduct;
  lang: string;
  isHovered: boolean;
}

const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ product, lang, isHovered }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const baseUrl = APP_ENV.BASE_URL;

  const images = product.images || [];

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        carouselRef.current.scrollTo({
          left: currentIndex * carouselRef.current.clientWidth,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Викликати handleResize під час першого рендеру, щоб позиція каруселі була правильною
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  const goToPrev = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (carouselRef.current) {
      setCurrentIndex(prevIndex => {
        const newIndex = (prevIndex === 0 ? images.length - 1 : prevIndex - 1);
        carouselRef.current?.scrollTo({
          left: newIndex * carouselRef.current.clientWidth,
          behavior: 'smooth'
        });
        return newIndex;
      });
    }
  };

  const goToNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (carouselRef.current) {
      setCurrentIndex(prevIndex => {
        const newIndex = (prevIndex === images.length - 1 ? 0 : prevIndex + 1);
        carouselRef.current?.scrollTo({
          left: newIndex * carouselRef.current.clientWidth,
          behavior: 'smooth'
        });
        return newIndex;
      });
    }
  };

  const handleIndicatorClick = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.clientWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={carouselRef}
        className="flex overflow-hidden whitespace-nowrap h-full"
      >
        <Link to={`/product/${product.id}`} className="group">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                className="inline-block w-full h-full flex-shrink-0"
              >
                <img
                  src={`${baseUrl}/uploads/1200_${image.imagePath || 'imagenot.webp'}`}
                  alt={getLocalizedField(product, 'name', lang)}
                  className="object-cover h-full w-full "
                />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <img
                src={`${baseUrl}/uploads/imagenot.webp`}
                alt="Image Not Available"
                className="h-full w-full object-cover object-center "
              />
            </div>
          )}
        </Link>
      </div>

      {isHovered && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[rgba(79,80,80,0.3)] text-white hover:bg-[rgba(79,80,80,0.5)] transition-all duration-300 ease-in-out p-3.5 rounded-full flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[rgba(79,80,80,0.3)] text-white hover:bg-[rgba(79,80,80,0.5)] transition-all duration-300 ease-in-out p-3.5 rounded-full flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>
          <div className={`absolute bottom-0 left-0 w-full bg-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${isHovered ? 'h-10 py-2 opacity-100' : 'h-0 py-0 opacity-0'}`}>
            <div className="flex justify-center items-center h-full">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(event) => handleIndicatorClick(index, event)}
                  className={`h-2 w-9 mx-1 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-[rgba(79,80,80,0.3)] hover:bg-[rgba(79,80,80,0.5)] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg'} focus:outline-none`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleCarousel;
