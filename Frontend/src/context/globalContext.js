import React, { useCallback, useContext, useEffect, useState } from "react"
import axios from 'axios'
import Observer from './../Observer/Observer'
import CacheService from './../Cache/CacheService'

const BASE_URL = "http://localhost:5000/";

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {
    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)
    const observer = new Observer()
    const cacheService = new CacheService()

    const fetchData = useCallback(async (url, setStateFunc, cacheKey) => {
        const cachedData = cacheService.get(cacheKey)
        if (cachedData) {
            setStateFunc(cachedData)
            return
        }

        try {
            const response = await axios.get(url)
            setStateFunc(response.data)
            cacheService.set(cacheKey, response.data)
            observer.notify({ type: cacheKey, data: response.data })
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred')
        }
    }, [])

    const getIncomes = useCallback(() => fetchData(`${BASE_URL}api/v1/incomes/get-incomes`, setIncomes, 'incomes'), [fetchData])
    const getExpenses = useCallback(() => fetchData(`${BASE_URL}api/v1/expenses/get-expenses`, setExpenses, 'expenses'), [fetchData])

    useEffect(() => {
        getIncomes()
        getExpenses()

        const handleDataUpdate = (data) => {
            if (data.type === 'incomes') setIncomes(data.data)
            if (data.type === 'expenses') setExpenses(data.data)
        }

        observer.subscribe(handleDataUpdate)

        return () => observer.unsubscribe(handleDataUpdate)
    }, [getIncomes, getExpenses])

    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}api/v1/incomes/add-income`, income)
            getIncomes()
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred')
        }
    }

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}api/v1/incomes/delete-income/${id}`)
            getIncomes()
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred')
        }
    }

    const totalIncome = useCallback(() => {
        return incomes.reduce((total, income) => total + Number(income.amount), 0);
    }, [incomes])

    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}api/v1/expenses/add-expense`, expense)
            getExpenses()
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred')
        }
    }

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}api/v1/expenses/delete-expense/${id}`)
            getExpenses()
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred')
        }
    }

    const totalExpenses = useCallback(() => {
        return expenses.reduce((total, expense) => total + Number(expense.amount), 0);
    }, [expenses])

    const totalBalance = useCallback(() => {
        return totalIncome() - totalExpenses()
    }, [totalIncome, totalExpenses])

    const transactionHistory = useCallback(() => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => new Date(b.date) - new Date(a.date))
        return history.slice(0, 3)
    }, [incomes, expenses])

    const getStockData = async (symbol) => {
        try {
            const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=LKYKNZ4M7BT7S2GC`);
            const timeSeriesData = response.data['Time Series (Daily)'];
            const formattedData = Object.entries(timeSeriesData)
                .map(([date, values]) => ({
                    date,
                    close: parseFloat(values['4. close'])
                }))
                .slice(0, 30);

            return formattedData;
        } catch (error) {
            console.error('Error fetching stock data:', error);
            setError('Error fetching stock data')
        }
    };

    return (
        <GlobalContext.Provider value={{
            observer,
            cacheService,
            getStockData,
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}