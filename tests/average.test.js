const { average } = require('../utils/for_testing.js');

describe('Average testing', () => {
    test('of one value is the value itself', () => {
        expect(average([1])).toBe(1);
    });

    test('of many is calculated correctly', () => {
        expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5);
    });

    test('of empty array is zero', () => {
        expect(average([])).toBe(0);
    });

    test('of not a number', () => {
        expect(average([NaN])).toBe(false);
    });
});
