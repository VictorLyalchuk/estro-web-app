export const updateFilters = (filters: any[], name: string, value: string): any[] => {
    const newFilters = [...filters];
    const index = newFilters.findIndex((item) => item.name === name);

    if (index === -1) {
        newFilters.push({ name: name, values: [value] });
    } else {
        const valueIndex = newFilters[index].values.indexOf(value);
        if (valueIndex === -1) {
            newFilters[index].values.push(value);
        } else {
            newFilters[index].values.splice(valueIndex, 1);
        }

        if (newFilters[index].values.length === 0) {
            newFilters.splice(index, 1);
        }
    }
    
    return newFilters;
};

export const createQueryParams = (filters: any[]): { [key: string]: string | string[] } => {
    const queryParams: { [key: string]: string | string[] } = {};
    filters.forEach((filter) => {
        if (filter.values.length > 0) {
            queryParams[filter.name] = filter.values.join('_');
        }
    });
    queryParams['Page'] = '1';

    return queryParams;
};

export const onPageChangeQueryParams = (newPage: number, filters: any[],) => {
    const queryParams: { [key: string]: string | string[] } = {};
    filters.forEach((filter) => {
        if (filter.values.length > 0) {
            queryParams[filter.name] = filter.values.join('_');
        }
    });
    queryParams['Page'] = newPage.toString();
    return queryParams;
};

export const onSortChangeQueryParams = (sort: string, filters: any[],) => {
    const queryParams: { [key: string]: string | string[] } = {};
    filters.forEach((filter) => {
        if (filter.values.length > 0) {
            queryParams[filter.name] = filter.values.join('_');
        }
    });
    queryParams['Sort'] = sort.toString();
    return queryParams;
};