import React from "react";
import { Link } from "react-router-dom";
import FoodModel from "../../models/FoodModel";
import { LeaveAReview } from "../Utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{ food: FoodModel | undefined, mobile: boolean,
    currentOrderCount: number, isAuthenticated: any, isCheckedOut: boolean, checkoutFood: any,
    isReviewLeft: boolean, submitReview: any}> = (props) => {

    function buttonRender() {
        if (props.isAuthenticated) {
            if (!props.isCheckedOut && props.currentOrderCount < 10) {
                return (<button onClick={() => props.checkoutFood()} className='btn btn-success btn-lg'>Checkout</button>)
            } else if (props.isCheckedOut) {
                return (<p><b>Food checked out. Enjoy!</b></p>)
            } 
        }
        return (<Link to={'/login'} className='btn btn-success btn-lg'>Sign in</Link>)
    }

    function reviewRender() {
        if (props.isAuthenticated && !props.isReviewLeft) {
            return(
            <p>
                <LeaveAReview submitReview={props.submitReview}/>
            </p>
            )
        } else if (props.isAuthenticated && props.isReviewLeft) {
            return(
            <p>
                <b>Thank you for your review!</b>
            </p>
            )
        }
        return (
        <div>
            <hr/>
            <p>Sign in to be able to leave a review.</p>
        </div>
        )
    }

    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className='card-body container'>
                <div className='mt-3'>
                    <p>
                        <b>{props.currentOrderCount} </b>
                        Food checked out
                    </p>
                    <hr />
                    <h4 className='text-success'>
                        Available
                    </h4>
                    <div className='row'>
                        <p className='col-6 lead'>
                            <b>{props.food && props.food.stock} </b>
                            items
                        </p>
                        <p className='col-6 lead'>
                            <b>{props.food && props.food.stockAvailable} </b>
                            available
                        </p>
                    </div>
                </div>
                {buttonRender()}
                <hr />
                <p className='mt-3'>
                    This number can change until placing order has been complete.
                </p>
                {reviewRender()}
            </div>
        </div>
    );
}