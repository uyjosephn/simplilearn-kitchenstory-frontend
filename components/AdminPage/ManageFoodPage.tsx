import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AddNewFood } from './AddNewFood';
import { ChangeQuantityOfFood } from './ChangeQuantity';

export const ManageLibraryPage = () => {

    const { authState } = useOktaAuth();

    const [changeQuantityOfFoodClick, setChangeQuantityOfFoodClick] = useState(false);

    function addFoodClickFunction() {
        setChangeQuantityOfFoodClick(false);
    }

    function changeQuantityOfFoodClickFunction() {
        setChangeQuantityOfFoodClick(true);
    }

    if (authState &&  authState.accessToken && authState.accessToken.claims.userType === undefined) {
        return <Redirect to='/home'/>
    }

    return (
        <div className='container'>
            <div className='mt-5'>
                <h3>Manage Library</h3>
                <nav>
                    <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                        <button onClick={addFoodClickFunction} className='nav-link active' id='nav-add-food-tab' data-bs-toggle='tab' 
                            data-bs-target='#nav-add-food' type='button' role='tab' aria-controls='nav-add-food' 
                            aria-selected='false'
                        >
                            Add new food
                        </button>
                        <button onClick={changeQuantityOfFoodClickFunction} className='nav-link' id='nav-quantity-tab' data-bs-toggle='tab' 
                            data-bs-target='#nav-quantity' type='button' role='tab' aria-controls='nav-quantity' 
                            aria-selected='true'
                        >
                            Change quantity
                        </button>
                    </div>
                </nav>
                <div className='tab-content' id='nav-tabContent'> 
                    <div className='tab-pane fade show active' id='nav-add-food' role='tabpanel'
                        aria-labelledby='nav-add-food-tab'>
                            <AddNewFood/>
                    </div>
                    <div className='tab-pane fade' id='nav-quantity' role='tabpanel' aria-labelledby='nav-quantity-tab'>
                       {changeQuantityOfFoodClick ? <ChangeQuantityOfFood/> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );

}