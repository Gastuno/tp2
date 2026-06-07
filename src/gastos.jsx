    
import axios from 'axios';

const URL = 'http://localhost:3001';

export const fetchExpenses = async () => {
  const response = await axios.get(`${URL}/gastos`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await axios.get(`${URL}/categorias`);
  return response.data;
};

export const addExpense = async (newExpense) => {
  const response = await axios.post(`${URL}/gastos`, newExpense);
  return response.data;
};

export const deleteExpense = async (id) => {
  return axios.delete(`${URL}/gastos/${id}`);
};

