import Loader from "./loader";

const LoaderModal  = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Loader />
        </div>
    );
};

export default LoaderModal ;