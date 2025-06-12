export const formatCardNumber = (cardNumber: string) => {
  return cardNumber.replace(/(.{4})(?=.)/g, '$1-').trim();
};