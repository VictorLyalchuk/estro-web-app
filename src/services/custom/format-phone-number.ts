export const formatPhoneNumber = (phoneNumber: number | string | undefined) => {
  if (!phoneNumber) return '';
    const cleaned = phoneNumber.toString().replace(/\D+/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}` : phoneNumber.toString();
  };