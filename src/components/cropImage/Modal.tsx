import CloseIcon from "./CloseIcon";
import ImageCropper from "./ImageCropper";

interface ModalProps {
  changeImage: (file: File) => void;
    closeModal: () => void;
    file: File;
  }

const Modal: React.FC<ModalProps> = ({ changeImage, closeModal, file  }) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all "></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center items-center px-2 py-12 text-center ">
          <div className="relativew-[80%] sm:w-[80%] min-h-[1vh] rounded-2xl 
           text-slate-100 text-lefttransition-all">
            <div className="px-4 py-3">
             {/* bg-gray-800  shadow-xl */}
              <ImageCropper
                changeImage={changeImage}
                closeModal={closeModal}
                file={file}
              />
              <button
                type="button"
                className="absolute top-3 right-7 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={closeModal}
              >
              <CloseIcon />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
