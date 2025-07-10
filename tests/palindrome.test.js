const { palindrome } = require('../utils/for_testing.js');

describe('Palindrome testing', () => {
    test('palindrome of licus', () => {
        const result = palindrome('licus');

        expect(result).toBe('sucil');
    });

    test('palindrome of empty string', () => {
        const result = palindrome('');

        expect(result).toBe('');
    });

    test('palindrome of undefined', () => {
        const result = palindrome();

        expect(result).toBeUndefined();
    });
});
