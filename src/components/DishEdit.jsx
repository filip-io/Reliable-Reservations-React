import { useState } from 'react'
import axios from 'axios'

export default function dishEdit({ dish, closeEdit, refreshList }) {

    const [name, setName] = useState(dish.name);
    const [description, setDescription] = useState(dish.description);

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const updatedDish = { id: dish.menuItemId, name, description }
            await axios.put(`https://localhost:7271/api/MenuItem/${menuItemId}`, updatedDish)

            refreshList();
        } catch (error) {
            console.log('error occured', error)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type='text'
                    value={name}
                    onChange={event => setName(event.target.value)}
                    required
                />

                <label>Description</label>
                <input
                    type='text'
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    required
                />

                <button type='submit'>Add</button>
                <button type='button' onClick={closeEdit}>Cancel</button>
            </form>
        </>
    )
}