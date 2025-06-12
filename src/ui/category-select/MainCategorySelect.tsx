import React from 'react';
import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { IMainCategory } from '../../interfaces/Category/Main-Category/IMainCategory'; 
import { getLocalizedField } from '../../utils/localized/localized';

interface MainCategorySelectProps {
    mainCategory: IMainCategory[];
    selectedMainCategory: IMainCategory | null;
    handleMainCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { mainCategory?: string };
    lang: string;
}

const MainCategorySelect: React.FC<MainCategorySelectProps> = ({
    mainCategory,
    selectedMainCategory,
    handleMainCategoryChange,
    errors,
    lang
}) => {
    return (
        <FormControl fullWidth variant="outlined">
            <TextField
                id="mainCategoryId"
                name="mainCategoryId"
                select
                value={selectedMainCategory?.id ?? ''}
                onChange={handleMainCategoryChange}
                error={!!errors.mainCategory}
            >
                {mainCategory.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                        {getLocalizedField(cat, 'name', lang)}
                    </MenuItem>
                ))}
            </TextField>
            {errors.mainCategory ? (
                <div className="h-6 text-xs text-red-500">Error: {errors.mainCategory}</div>
            ) : (<div className="h-6 text-xs "> </div>)}
        </FormControl>
    );
};

export default MainCategorySelect;
