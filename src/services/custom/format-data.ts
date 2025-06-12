export const formatDate = (dateString?: Date | string, locale: string = 'en-GB') => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);

  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export const formatDateFromDate = (date?: Date | string) => {
  if (!date) return 'N/A';
  const validDate = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(validDate.getTime())) return 'N/A';

  validDate.setHours(validDate.getHours() - 3);

  return validDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export const formatDateWithTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);

  date.setHours(date.getHours() - 3);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};