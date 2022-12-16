import React from "react";
import FoodModel from "../../models/FoodModel";
import { Link } from 'react-router-dom';

export const ReturnFood: React.FC<{food: FoodModel}> = (props) => {
    return(
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="text-center">
                {props.food.img ? 
                    <img
                        src={props.food.img}
                        width='151'
                        height='233'
                        alt='food'
                    />
                    :
                    <img src={require('./../../images/PublicImages/default_256.png')} width='151' height='233' alt="food" />
                }
                
                <h6 className="mt-2">{props.food.shortName}</h6>
                <p>{props.food.cuisine}</p>
                <Link className='btn main-color text-white' to={`checkout/${props.food.id}`}>Order</Link>
            </div>
        </div>  
    );
}       