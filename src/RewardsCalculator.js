import React, {useEffect, useState} from "react";
import axios from "axios";
import {Grid} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
        <Grid container spacing={3} justifyContent={"center"}>
            {Object.entries(calculateRewardsPerCustomer(transactions)).map(([customerName, customerData]) => (
                <Grid item xs={12} sm={9} key={customerName}>
                    <h2>{customerName}</h2>
                    <h3>Total rewards: {customerData.total} points</h3>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="right">Rewards</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {customerData.transactions.map((transaction) => (
                                    <TableRow key={transaction.date}>
                                        <TableCell>{transaction.date}</TableCell>
                                        <TableCell align="right">${transaction.amount}</TableCell>
                                        <TableCell align="right">{transaction.rewards}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <h3>Monthly Rewards</h3>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Month</TableCell>
                                    <TableCell align="right">Rewards</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(customerData.monthly).map(([month, rewards]) => {
                                    const date = new Date(month);
                                    const formattedMonth = date.toLocaleString('default', {month: 'long'});

                                    return (
                                        <TableRow key={month}>
                                            <TableCell>{formattedMonth}</TableCell>
                                            <TableCell align="right">{rewards}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            ))}
        </Grid>
    );
}