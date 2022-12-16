import React from "react";
import { useEffect, useState } from "react";
import { useOktaAuth } from '@okta/okta-react';
import FoodModel from "../../models/FoodModel";

export const ChangeQtyFood: React.FC<{ food: FoodModel, deleteFood: any }> = (props, key) => {
    
    const { authState } = useOktaAuth();
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        const fetchFoodInState = () => {
            props.food.stock ? setQuantity(props.food.stock) : setQuantity(0);
            props.food.stockAvailable ? setRemaining(props.food.stockAvailable) : setRemaining(0);
        };
        fetchFoodInState();
    }, []);

    async function increaseQuantity() {
        const url = `http://localhost:8080/api/admin/secure/increase/food/quantity/?foodId=${props.food.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState && authState.accessToken && authState.accessToken.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);
        if (!quantityUpdateResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setQuantity(quantity + 1);
        setRemaining(remaining + 1);
    }

    async function decreaseQuantity() {
        const url = `http://localhost:8080/api/admin/secure/decrease/food/quantity/?foodId=${props.food.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState && authState.accessToken && authState.accessToken.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);
        if (!quantityUpdateResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setQuantity(quantity - 1);
        setRemaining(remaining - 1);
    }

    async function deleteFood() {
        const url = `http://localhost:8080/api/admin/secure/delete/food/?foodId=${props.food.id}`;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState && authState.accessToken && authState.accessToken.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const updateResponse = await fetch(url, requestOptions);
        if (!updateResponse.ok) {
            throw new Error('Something went wrong!');
        }
        props.deleteFood();
    }
    
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                         <img src={props.food.img} width='123' height='196' alt='Food' />
                    </div>
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        <img src={props.food.img} width='123' height='196' alt='Food' />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>{props.food.cuisine}</h5>
                        <h4>{props.food.shortName}</h4>
                        <p className='card-text'> {props.food.description} </p>
                    </div>
                </div>
                <div className='mt-3 col-md-4'>
                    <div className='d-flex justify-content-center algin-items-center'>
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Food Remaining: <b>{remaining}</b></p>
                    </div>
                </div>
                <div className='mt-3 col-md-1'>
                    <div className='d-flex justify-content-start'>
                        <button className='m-1 btn btn-md btn-danger' onClick={deleteFood}>Delete</button>
                    </div>
                </div>
                <button className='m1 btn btn-md main-color text-white' onClick={increaseQuantity}>Add Quantity</button>
                <button className='m1 btn btn-md btn-warning' onClick={decreaseQuantity}>Decrease Quantity</button>
            </div>
        </div>
    );
}