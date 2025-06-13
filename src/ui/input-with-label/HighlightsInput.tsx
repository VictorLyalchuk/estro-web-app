import { Add, Remove } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import React from 'react';
// import { TextField, IconButton } from '@material-ui/core';
// import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

interface HighlightsInputProps {
    name: string;
    highlights: string[];
    setHighlights: (name: string, highlights: string[]) => void;
    error: string | null;
}

const HighlightsInput: React.FC<HighlightsInputProps> = ({name, highlights, setHighlights, error }) => {
    const { t } = useTranslation();
    const handleChange = (index: number, value: string) => {
        const newHighlights = [...highlights];
        newHighlights[index] = value;
        setHighlights(name, newHighlights);
    };

    const handleAdd: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        if (highlights.length === 0 || highlights[highlights.length - 1] !== '') {
            setHighlights(name, [...highlights, '']);
        }
    };

    const handleRemove = (index: number) => {
        const newHighlights = highlights.filter((_, i) => i !== index);
        setHighlights(name, newHighlights);
    };

    return (
        <div>
            {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center mb-2">
                    <TextField
                        variant="standard"
                        value={highlight}
                        name="dsa"
                        onChange={(e) => handleChange(index, e.target.value)}
                        label={`${t('Add_Product_Features')} ${index + 1}`}

                        fullWidth
                        error={!!error}
                    />
                    <IconButton onClick={() => handleRemove(index)} color="secondary">
                        <Remove />
                    </IconButton>
                </div>
            ))}
            {error ? (
                <div className="h-6 text-xs text-red-500">Error: {error}</div>
            ) : (
                <div className="h-6 text-xs"> </div>
            )}

            <button
                onClick={handleAdd}
                className="p-2 mr-3 flex items-center justify-center rounded-md border px-8 py-2 text-base font-medium text-white   bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <Add className="mr-2" />
                {t('Add_Product_Add_Features')}
            </button>
        </div>
    );
};

export default HighlightsInput;
