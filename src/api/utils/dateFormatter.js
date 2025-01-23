import { format } from 'date-fns';

export const formatDate = (date) => {
    if (!date) return ''; //Handle null or undefined dates
    return format(new Date(date), 'yyyy-MM-dd'); // Or any other format you prefer
};