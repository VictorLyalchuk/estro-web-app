import { useRef, useState, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  PixelCrop,
  PercentCrop,
} from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';
import setCanvasPreview from "./setCanvasPreview";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const dataURLToFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

interface ImageCropperProps {
  closeModal: () => void;
  changeImage: (file: File) => void;
  file: File;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ closeModal, changeImage, file }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<PercentCrop>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const imageElement = new Image();
        const imageUrl = reader.result?.toString() || "";
        imageElement.src = imageUrl;

        imageElement.addEventListener("load", (event) => {
          if (error) setError("");
          const { naturalWidth, naturalHeight } = event.currentTarget as HTMLImageElement;
          if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
            setError("Image must be at least 150 x 150 pixels.");
            return setImgSrc("");
          }
        });
        setImgSrc(imageUrl);
      });
      reader.readAsDataURL(file);
    }
  }, [file, error]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const onCropComplete = (pixelCrop: PixelCrop) => {
    if (imgRef.current && previewCanvasRef.current && pixelCrop.width && pixelCrop.height) {
      setCanvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        pixelCrop
      );
    }
  };

  return (
    <>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {imgSrc && (
        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(_pixelCrop, percentCrop) => setCrop(percentCrop)}
            onComplete={onCropComplete}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <button
            className="w-1/5 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              if (imgRef.current && previewCanvasRef.current && crop) {
                const pixelCrop = convertToPixelCrop(
                  crop,
                  imgRef.current.width,
                  imgRef.current.height
                );
                setCanvasPreview(
                  imgRef.current,
                  previewCanvasRef.current,
                  pixelCrop
                );
                const dataUrl = previewCanvasRef.current.toDataURL();
                const croppedFile = dataURLToFile(dataUrl, file.name);
                changeImage(croppedFile);
                closeModal();
              }
            }}
          >
            Crop Image
          </button>
        </div>
      )}
      <canvas
        ref={previewCanvasRef}
        className="mt-4"
        style={{
          display: "none",
          border: "1px solid black",
          objectFit: "contain",
          width: 150,
          height: 150,
        }}
      />
    </>
  );
};

export default ImageCropper;
