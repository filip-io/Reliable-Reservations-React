import axios from 'axios'
import { useState } from 'react'
import { Category } from '../utils/enums'

export default function dishCreate() {


    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: Category.PickACategory,
        isPopular: false,
        availabilityStatus: false,
    });


    const handleInputChange = (event) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [event.target.name]: event.target.value,
        }));
    };


    const handleBooleanInputChange = (event) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [event.target.name]: event.target.checked,
        }));
    };


    const getBooleanDisplay = (booleanValue) => booleanValue ? 'Yes' : 'No';


    async function handleSubmit(event) {
        event.preventDefault();

        const menuItem = {
            name: formData.name,
            description: formData.description,
            price: parseInt(formData.price, 10),
            category: formData.category,
            isPopular: formData.isPopular,
            availabilityStatus: formData.availabilityStatus
        };

        console.log(menuItem)

        try {
            await axios.post('https://localhost:7271/api/MenuItem/create', menuItem);
        } catch (error) {
            console.error('Error creating menu item:', error);
        }
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor='name'>Name:</label>
                <input
                    id='name'
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <br />
                <label>Description:</label>
                <input
                    id='description'
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />
                <br />
                <label>Price:</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                />
                <br />
                <label>Category:</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                >
                    {Object.entries(Category).map(([key, value]) => (
                        <option key={key} value={value} disabled={value === ""}>
                            {value || "Pick a category..."}
                        </option>
                    ))}
                </select>
                <br />
                <label>Is Popular:</label>
                <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleBooleanInputChange}
                />
                <span>{getBooleanDisplay(formData.isPopular)}</span>
                <br />
                <label>Availability Status:</label>
                <input
                    type="checkbox"
                    name="availabilityStatus"
                    checked={formData.availabilityStatus}
                    onChange={handleBooleanInputChange}
                />
                <span>{getBooleanDisplay(formData.availabilityStatus)}</span>
                <br />
                <button type='submit'>Add menu item</button>
            </form>
        </>
    );
}