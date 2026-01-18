/**
 * Safely parses a field that might be stringified JSON or an actual array.
 * Useful for fields like 'prizes', 'winners', 'studyMaterial', 'questions'
 * which are sometimes returned as JSON strings from the database.
 */
export const parseArrayField = (field, defaultValue = []) => {
    if (!field) return defaultValue;
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
        try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed : defaultValue;
        } catch (e) {
            console.error('Error parsing array field:', e);
            return defaultValue;
        }
    }
    return defaultValue;
};

export const parseObjectField = (field, defaultValue = null) => {
    if (!field) return defaultValue;
    if (typeof field === 'object' && !Array.isArray(field)) return field;
    if (typeof field === 'string') {
        try {
            const parsed = JSON.parse(field);
            return (typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : defaultValue;
        } catch (e) {
            console.error('Error parsing object field:', e);
            return defaultValue;
        }
    }
    return defaultValue;
};
