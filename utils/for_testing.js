const palindrome = (string) => {
    if (typeof string === 'undefined') return;
    return string.split('').reverse().join('');
};

const average = (array) => {
    if (!Array.isArray(array)) return false;
    if (array.length === 0) return 0;
    if (!array.every((num) => typeof num === 'number' && !isNaN(num)))
        return false;

    const sum = array.reduce((acc, num) => acc + num, 0);
    return sum / array.length;
};

module.exports = {
    palindrome,
    average,
};
