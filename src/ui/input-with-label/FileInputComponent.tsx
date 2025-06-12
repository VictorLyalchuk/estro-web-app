import { Button, FormControl } from '@material-ui/core';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import {t} from "i18next";

interface FileFieldComponentProps {
    selectedImage: string | null;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectFile: () => void;
  }

  const FileInputComponent: React.FC<FileFieldComponentProps> = ({ selectedImage, handleFileChange, handleSelectFile }) => (
    <FormControl fullWidth variant="outlined">
    <div className="mb-5 mt-2 flex justify-center items-center gap-x-3 relative">
      {selectedImage ? (
        <img src={selectedImage} alt="Selected" className="h-12 w-12 rounded-full" />
      ) : (
        <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={handleSelectFile}
      >
          {t('RegisterPage_Select')}
      </Button>
    </div>
  </FormControl>
);

export default FileInputComponent;
