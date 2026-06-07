import { useState, useEffect } from 'react'
import './App.css'
import { fetchExpenses, fetchCategories, addExpense, deleteExpense } from './gastos';

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

    const loadExpenses = async () => {
      try {
        const data = await fetchExpenses();
        setExpenses(data);
      } catch (error) {
        console.error('Error cargando gastos', error);
      }
    };

    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error cargando categorias', error);
      }
    };

    const handleDeleteExpense = async (id) => {
      try {
        if (window.confirm("Seguro que deseas eliminar esta expensa?"))
        {
          await deleteExpense(id);
          setExpenses((prev) => prev.filter((expense) => expense.id !== id));
        }
      } 
        catch (error) {
        console.error('Error eliminando gasto', error);
      }
    };

    const handleAddExpense = async (newExpense) => {
      try {
        await addExpense(newExpense);
        await loadExpenses();
        setLoading(false);
        setShowAddForm(false);
        resetForm();
      } catch (error) {
        console.error('Error agregando gasto', error);
        setLoading(false);
      }
    };

    useEffect(() => {
      loadExpenses();
      loadCategories();
    }, []);


    const totalAmount = expenses.reduce(
      (acc, expense) => acc + Number(expense.monto), 0
    );

    const sortedHighest = [...expenses].sort(
      (a, b) => Number(b.monto) - Number(a.monto)
    );
    
    const [selectedCategory, setSelectedCategory] = useState('');

    const filteredExpenses = selectedCategory
      ? expenses.filter(expense => expense.categoria == selectedCategory)
      : expenses;

  return (
    <>
      <div className="content-section">
          <h2>Gastos</h2>
          <h3>Total Gastado: {totalAmount}$</h3>
          <h3>Mayor Gasto: {sortedHighest[0]?.descripcion} - {sortedHighest[0]?.monto}$</h3>
          <button onClick={() => setShowAddForm(true)}>Agregar nuevo gasto</button>
          <div><label>Filtrar</label><br/><select value={selectedCategory} onChange={e=>setSelectedCategory(e.target.value)} required>
            <option value="">todos </option>
              {categories.map(category => (
            <option key={category.id} value={category.id}>{category.nombre}</option>
          ))}
          </select></div>
          {filteredExpenses.length > 0 ? (
          <table className="expenses-table">
            <thead> Total: {filteredExpenses.length} </thead>
            <thead>
              <tr>
                <th></th>
                <th>Id</th>
                <th>Descripcion</th>
                <th>Monto</th>
                <th>Categoria</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, index) => {
                const cat = categories.find(category => category.id == expense.categoria);
                console.log(cat);
                return (
                <tr key={expense.id}>
                  <td>{index + 1}</td>
                  <td>{expense.id}</td>
                  <td>{expense.descripcion}</td>
                  <td>{expense.monto}$</td>
                  <td>{cat ? cat.nombre : expense.categoria}</td>
                  <td>{expense.fecha}</td>
                  <td><button onClick={() => handleDeleteExpense(expense.id)}>Eliminar</button></td>
                </tr>
                )
              })}
            </tbody>
          </table>
          ) : (
            <p>No hay gastos en la categoria seleccionada! :)</p>
          )}
      </div>

      {showAddForm && (<div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={(e) => {
              e.preventDefault();
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
                <option hidden value="">Selecciona una categoría </option>
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
