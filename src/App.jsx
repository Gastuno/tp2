import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newDescription, setNewDescription] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newDate, setNewDate] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);


    const resetForm = () => {
      setNewDescription('');
      setNewAmount('');
      setNewCategory('');
      setNewDate('');
    };

    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/gastos');
        setExpenses(response.data);
      } catch (error) {
        console.error("Error cargando gastos", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/categorias');
        setCategories(response.data);
      } catch (error) {
        console.error("Error cargando gastos", error);
      }
    };

    const handleDeleteExpense = async (id) => {
      try {
        await axios.delete(`http://localhost:3001/gastos/${id}`);
        setExpenses(expenses.filter(expense => expense.id !== id));
      } catch (error) {
        console.error("Error eliminando gasto", error);
      }
    };

    const handleAddExpense = async (newExpense) => {
      try {
        const response = await axios.post('http://localhost:3001/gastos', newExpense);
        fetchExpenses();
        setLoading(false);
        setShowAddForm(false)
        resetForm();
      } catch (error) {
        console.error("Error eliminando gasto", error);
      }
    };

    useEffect(() => {
      fetchExpenses();
      fetchCategories();
    }, []);

  return (
    <>
      <div className="content-section">
          <h2>Gastos</h2>
          <button onClick={() => setShowAddForm(true)}>Agregar</button>
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Descripcion</th>
                <th>Monto</th>
                <th>Categoria</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              
              {expenses.map(expense => {
                const cat = categories.find(category => category.id == expense.categoria);
                console.log(cat);
                return (
                <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{expense.descripcion}</td>
                  <td>{expense.monto}</td>
                  <td>{cat ? cat.nombre : expense.categoria}</td>
                  <td>{expense.fecha}</td>
                  <td><button onClick={() => handleDeleteExpense(expense.id)}>Eliminar</button></td>
                </tr>
                )
              })}
            </tbody>
          </table>
      </div>

      {showAddForm && (<div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={(e) => {
              setLoading(true);
              handleAddExpense({
                descripcion: newDescription,
                monto: newAmount,
                categoria: newCategory,
                fecha: newDate
              });
            }}>
              <h3>Agregar nuevo gasto</h3>
              <div><label>Descripción</label><br/><textarea value={newDescription} maxLength={30} onChange={e=>setNewDescription(e.target.value)} required /></div>
              <div><label>Monto</label><br/><input value={newAmount} max={999999999} type="number"onChange={e=>setNewAmount(e.target.value)} required /></div>
              <div><label>Categoria</label><br/><select value={newCategory} onChange={e=>setNewCategory(e.target.value)} required>
                <option value="">Selecciona una categoría </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.nombre}</option>
                ))}
              </select></div>
              <div><label>Fecha</label><br/><input value={newDate} type="date" onChange={e=>setNewDate(e.target.value)} required/></div>
              <div style={{marginTop:8}}>
              <button type="submit" disabled={loading}> {loading ? 'Guardando...' : 'Agregar'}</button>
              <button type="button" onClick={()=>{setShowAddForm(false); resetForm();}}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default App
