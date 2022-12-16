import React from "react";
import { useOktaAuth } from '@okta/okta-react';
import { useState } from 'react';
import AddFoodRequest from "../../models/AddFoodRequest";

export const AddNewFood = () => {

    const { authState } = useOktaAuth();

    // New Food
    const [shortName, setShortName] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryField(value: string) {
        setCategory(value);
    }

    async function base64ConversionForImages(e: any) {
        if (e.target.files[0]) {
            getBase64(e.target.files[0]);
        }
    }

    function getBase64(file: any) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setSelectedImage(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error', error);
        }
    }

    async function submitNewFood() {
        const url = `http://localhost:8080/api/admin/secure/add/food`;
        if (authState && authState.isAuthenticated && shortName !== '' && cuisine !== '' && category !== 'Category' 
            && description !== '' && stock >= 0) {
                const food: AddFoodRequest = new AddFoodRequest(shortName, cuisine, description, stock, category);
                food.img = selectedImage;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authState && authState.accessToken && authState.accessToken.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(food)
                };

                const submitNewFoodResponse = await fetch(url, requestOptions);
                if (!submitNewFoodResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                setShortName('');
                setCuisine('');
                setDescription('');
                setStock(0);
                setCategory('Category');
                setSelectedImage(null);
                setDisplayWarning(false);
                setDisplaySuccess(true);
            } else {
                setDisplayWarning(true);
                setDisplaySuccess(false);
            }
    }

    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess && 
                <div className='alert alert-success' role='alert'>
                    Food added successfully
                </div>
            }
            {displayWarning && 
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }
            <div className='card'>
                <div className='card-header'>
                    Add a new food
                </div>
                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Short Name</label>
                                <input type="text" className='form-control' name='shortName' required 
                                    onChange={e => setShortName(e.target.value)} value={shortName} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Cuisine </label>
                                <input type="text" className='form-control' name='cuisine' required 
                                    onChange={e => setCuisine(e.target.value)} value={cuisine}/>
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Category</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button' 
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                        {category}
                                </button>
                                <ul id='addNewFoodId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li><a onClick={() => categoryField('Pizza')} className='dropdown-item'>Pizza</a></li>
                                    <li><a onClick={() => categoryField('Steak')} className='dropdown-item'>Steak</a></li>
                                    <li><a onClick={() => categoryField('Burger')} className='dropdown-item'>Burger</a></li>
                                    <li><a onClick={() => categoryField('Tacos')} className='dropdown-item'>Tacos</a></li>
                                    <li><a onClick={() => categoryField('Curry')} className='dropdown-item'>Curry</a></li>
                                    <li><a onClick={() => categoryField('Burrito')} className='dropdown-item'>Burrito</a></li>
                                    <li><a onClick={() => categoryField('Breakfast')} className='dropdown-item'>Breakfast</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea className='form-control' id='exampleFormControlTextarea1' rows={3} 
                                onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Stock</label>
                            <input type='number' className='form-control' name='Stock' required 
                                onChange={e => setStock(Number(e.target.value))} value={stock}/>
                        </div>
                        <input type='file' onChange={e => base64ConversionForImages(e)}/>
                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitNewFood}>
                                Add Food
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}