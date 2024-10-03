import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import DishEdit from './DishEdit'

export default function popularDishesList() {

    const [dishes, setDishes] = useState([]);
    const [dishToEdit, setDishToEdit] = useState(null)

    async function getDishes() {
        try {
            const response = await axios.get('https://localhost:7271/api/MenuItem/all')
            console.log(response);
            setDishes(response.data)
        } catch (error) {
            console.log("Error fetching dishes: ", error)
        }
    }

    useEffect(() => {
        getDishes();
    }, [])


    function closeEdit() {
        setDishToEdit(null);
    }

    function renderDishEdit() {
        if (dishToEdit !== null) {
            return <DishEdit dish={dishToEdit} closeEdit={closeEdit} refreshList={getDishes}/>
        }
    }


    async function handleDelete(menuItemId) {
        try {
            await axios.delete(`https://localhost:7271/api/MenuItem/${menuItemId}`);
            setDishes(dishes.filter(d => d.menuItemId !== menuItemId))
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <h2>Popular Dishes</h2>
            <ul>
                {dishes.map(dish => (
                    <div key={dish.menuItemId}>
                        <li>
                            {dish.name}
                        </li>
                        <button onClick={() => setDishToEdit(dish)}>Edit</button>
                        <button onClick={() => handleDelete(dish.menuItemId)}>Delete</button>
                    </div>
                ))}
            </ul>
            {renderDishEdit()}
        </>
    )
}