import React, {useEffect, useState} from "react";
import axios from "axios";

export const RewardsCalculator = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await axios.get('http://localhost:3001/transactions');
            setTransactions(response.data);
        };
        fetchTransactions();
    }, []);

    //Function to calculate rewards

    const calculateRewards = (amount) => {
        let rewards = 0;
        if (amount > 100) {
            rewards = (amount - 100) * 2 + 50;
        } else {
            rewards = amount - 50;
        }
        return rewards;
    }

    const calculateRewardsPerCustomer = (transactions) => {
        return transactions.reduce((acc, transaction) => {
            const rewards = calculateRewards(transaction.amount);
            const {customerName, date} = transaction;
            const [year, month, day] = date.split("-").map(Number);
            const localDate = new Date(year, month - 1, day);
            const yearMonth = new Date(localDate.getFullYear(), localDate.getMonth());


            if (!acc[customerName]) {
                acc[customerName] = {total: 0, monthly: {}, transactions: []};
            }

            acc[customerName].total += rewards;
            acc[customerName].monthly[yearMonth] = (acc[customerName].monthly[yearMonth] || 0) + rewards;
            acc[customerName].transactions.push({...transaction, rewards});


            return acc;
        }, {});
    };


    return (
        <div>
            {Object.entries(calculateRewardsPerCustomer(transactions)).map(([customerName, data]) => (
                <div key={customerName}>
                    <h2>{customerName}</h2>
                    <p>Total rewards: {data.total}</p>
                    {Object.entries(data.monthly).map(([yearMonth, rewards]) => {
                        const monthName = new Date(yearMonth).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric'
                        }); // We get both the month and the year from the date object
                        return <p key={yearMonth}>Rewards in {monthName}: {rewards}</p>
                    })}

                    <h3>Transactions:</h3>
                    {data.transactions.map((transaction, index) => (
                        <div key={index}>
                            <p>Date: {transaction.date}</p>
                            <p>Amount: ${transaction.amount}</p>
                            <p>Rewards: {transaction.rewards}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}