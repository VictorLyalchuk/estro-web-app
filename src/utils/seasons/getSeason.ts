export const getSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring_summer';
    if (month >= 6 && month <= 8) return 'spring_summer';
    if (month >= 9 && month <= 11) return 'autumn_winter';
    return 'autumn_winter';
}

export const getCurrentYear = () => {
    return new Date().getFullYear();
}