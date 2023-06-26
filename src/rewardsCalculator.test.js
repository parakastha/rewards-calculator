import {calculateRewards, calculateRewardsPerCustomer} from './rewardsCalculator';

describe('calculateRewards', () => {
    it('should calculate rewards correctly', () => {
        expect(calculateRewards(60)).toBe(10);  // for amounts less than 100
        expect(calculateRewards(150)).toBe(150); // for amounts greater than 100
    });
});

describe('calculateRewardsPerCustomer', () => {
    it('should calculate rewards per customer correctly', () => {
        const transactions = [
            {id: 1, customerName: 'John Doe', amount: 120, date: '2023-04-01'},
            {id: 2, customerName: 'Jane Doe', amount: 90, date: '2023-04-20'},
            // Add more transactions as needed
        ];

        const formatYearMonth = (dateString) => {
            const [year, month] = dateString.split("-");
            return new Date(year, month - 1);
        };

        const expected = {
            'John Doe': {
                total: 90,
                monthly: {[formatYearMonth('2023-04')]: 90},
                transactions: [{...transactions[0], rewards: 90}]
            },
            'Jane Doe': {
                total: 40,
                monthly: {[formatYearMonth('2023-04')]: 40},
                transactions: [{...transactions[1], rewards: 40}]
            }
        };

        expect(calculateRewardsPerCustomer(transactions)).toEqual(expected);
    });
});

