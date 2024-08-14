import React, { useCallback, useContext, useEffect, useState } from "react"
import axios from 'axios'
import Observer from './../Observer/Observer'
import CacheService from './../Cache/CacheService'

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {
    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const observer = new Observer()
    const cacheService = new CacheService()

    const fetchData = useCallback(async (url, setStateFunc, cacheKey) => {
        try {
            const response = await axios.get(url)
            setStateFunc(response.data)
            cacheService.set(cacheKey, response.data, 60000)
            observer.notify({ type: cacheKey, data: response.data })
            return response.data
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred')
            return null
        }
    }, [])

    const fetchIncomes = useCallback(() => fetchData(`${BASE_URL}incomes/get-incomes`, setIncomes, 'incomes'), [fetchData])
    const fetchExpenses = useCallback(() => fetchData(`${BASE_URL}expenses/get-expenses`, setExpenses, 'expenses'), [fetchData])

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            await Promise.all([fetchIncomes(), fetchExpenses()])
            setLoading(false)
        }
        loadData()
    }, [fetchIncomes, fetchExpenses])

    const addIncome = async (income) => {
        try {
            setLoading(true)
            const response = await axios.post(`${BASE_URL}incomes/add-income`, income)
            if (response.data === "Income Added") {
                const newIncomes = await fetchIncomes()
                setIncomes(newIncomes)
                observer.notify({ type: 'incomes', data: newIncomes })
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add income')
        } finally {
            setLoading(false)
        }
    }

    const deleteIncome = async (id) => {
        try {
            setLoading(true)
            await axios.delete(`${BASE_URL}incomes/delete-income/${id}`)
            const newIncomes = await fetchIncomes()
            setIncomes(newIncomes)
            observer.notify({ type: 'incomes', data: newIncomes })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete income')
        } finally {
            setLoading(false)
        }
    }

    const addExpense = async (expense) => {
        try {
            setLoading(true)
            const response = await axios.post(`${BASE_URL}expenses/add-expense`, expense)
            if (response.data === "Expense Added") {
                const newExpenses = await fetchExpenses()
                setExpenses(newExpenses)
                observer.notify({ type: 'expenses', data: newExpenses })
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense')
        } finally {
            setLoading(false)
        }
    }

    const deleteExpense = async (id) => {
        try {
            setLoading(true)
            await axios.delete(`${BASE_URL}expenses/delete-expense/${id}`)
            const newExpenses = await fetchExpenses()
            setExpenses(newExpenses)
            observer.notify({ type: 'expenses', data: newExpenses })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete expense')
        } finally {
            setLoading(false)
        }
    }

    const totalIncome = useCallback(() => {
        return incomes.reduce((total, income) => total + Number(income.amount), 0);
    }, [incomes])

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

    return (
        <GlobalContext.Provider value={{
            addIncome,
            deleteIncome,
            incomes,
            addExpense,
            deleteExpense,
            expenses,
            totalIncome,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError,
            loading,
            setLoading,
            fetchIncomes,
            fetchExpenses,
            observer,
            cacheService
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}