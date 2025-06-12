import React, { useEffect, useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormControl } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/uk'; 
import 'dayjs/locale/es'; 
import 'dayjs/locale/fr'; 
import '../../index.css';
interface BirthdayFieldComponentProps {
  birthday: string; 
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  name: string; 
}

const MyDatePicker: React.FC<BirthdayFieldComponentProps> = ({ birthday, handleChange, name }) => {
  const { i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs(birthday));

  useEffect(() => {

    if (birthday) {
      setSelectedDate(dayjs(birthday));
    }
  }, [birthday]);

  const getLocale = () => {
    switch (i18n.language) {
      case 'uk':
        return dayjs.locale('uk');
      case 'es':
        return dayjs.locale('es');
      case 'fr':
        return dayjs.locale('fr');
      default:
        return 'en'; 
    }
  };

  const onDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    const formattedDate = date ? date.format('YYYY-MM-DD') : '';

    const syntheticEvent = {
      target: {
        name,
        value: formattedDate,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(syntheticEvent); 
  };

  return (
    <FormControl fullWidth variant="outlined">
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={getLocale()}>
      <DatePicker
        value={selectedDate}
        onChange={onDateChange}
        slotProps={{
          textField: {
            variant: "standard",
            size: "small",
            sx: {
              border: 'none', 
              backgroundColor: 'transparent', 
              '& input': {
                margin: '1', 
                fontFamily: "'Satoshi', sans-serif",
              },
            },
            error: !selectedDate && !birthday, 
          },
        }}
      />
    </LocalizationProvider>
  </FormControl>
  );
};

export default MyDatePicker;
