import React from "react";
import FoodModel from "../../models/FoodModel";
import { Link } from 'react-router-dom'; 

export const SearchFood: React.FC<{food: FoodModel}>  = (props) => {
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.food.img ?
                            <img src={props.food.img}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                            :
                            <img src={require('./../../images/PublicImages/default_256.png')}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center 
                        align-items-center'>
                        {props.food.img ?
                            <img src={props.food.img}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                            :
                            <img src={require('./../../images/PublicImages/default_256.png')}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {props.food.cuisine}
                        </h5>
                        <h4>
                            {props.food.shortName}
                        </h4>
                        <p className='card-text'>
                            {props.food.description}
                        </p>
                    </div>
                </div>
                <div className='col-md-4 d-flex justify-content-center align-items-center'>
                    <Link className="btn btn-md main-color text-white" to={`/checkout/${props.food.id}`}>View Details</Link>
                </div>
            </div>
        </div>
    );
} 