export function getFromLocalStorage(key: string, defaultValue?: any): any {
    const value = localStorage.getItem(key);
    if (value == null) return defaultValue;
    try {
        const data = JSON.parse(value);
        if (data != null && defaultValue != null && typeof data === 'object' && typeof defaultValue === 'object') {
            return { ...defaultValue, ...data };
        }
        return data;
    } catch (e) {
        return value;
    }
}

export function setIntoLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}
