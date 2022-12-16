import React from 'react';
import { useState, useEffect } from 'react';
import FoodModel from '../../models/FoodModel';
import ReviewModel from '../../models/ReviewModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { StarsReview } from '../Utils/StarReview';
import { CheckoutAndReviewBox } from './CheckoutAndReviewBox';
import { LatestReviews } from './LatestReviews';
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from '../../models/ReviewRequestModel';

export const FoodCheckoutPage = () => {

    const { authState } = useOktaAuth();
    const [food, setFood] = useState<FoodModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [currentOrderCount, setCurrentOrderCount] = useState(0);
    const [isLoadingCurrentOrderCount, setIsLoadingCurrentOrderCount] = useState(true);

    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingFoodCheckedOut, setIsLoadingFoodCheckedOut] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    const foodId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/foods/${foodId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();

            const loadedFood: FoodModel = {
                id: responseJson.id,
                shortName: responseJson.shortName,
                cuisine: responseJson.cuisine,
                description: responseJson.description,
                stock: responseJson.stock,
                stockAvailable: responseJson.stockAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setFood(loadedFood);
            setIsLoading(false);
        };
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchFoodReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByFoodId?foodId=${foodId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    food_id: responseData[key].foodId,
                    reviewDescription: responseData[key].reviewDescription,
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchFoodReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewLeft]);

    useEffect(() => {
        const fetchUserReviewFood = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/reviews/secure/user/food/?foodId=${foodId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken && authState.accessToken.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const userReview = await fetch(url, requestOptions);
                if (!userReview.ok) {
                    throw new Error('Something went wrong');
                }
                const userReviewResponseJson = await userReview.json();
                setIsReviewLeft(userReviewResponseJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReviewFood().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    }, [authState]);

    useEffect(() => {
        const fetchUserCurrentOrderCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/foods/secure/currentorder/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: { 
                        Authorization: `Bearer ${authState.accessToken && authState.accessToken.accessToken}`,
                        'Content-Type': 'application/json'
                     }
                };
                const currentLoansCountResponse = await fetch(url, requestOptions);
                if (!currentLoansCountResponse.ok)  {
                    throw new Error('Something went wrong!');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentOrderCount(currentLoansCountResponseJson);
            }
            setIsLoadingCurrentOrderCount(false);
        }
        fetchUserCurrentOrderCount().catch((error: any) => {
            setIsLoadingCurrentOrderCount(false);
            setHttpError(error.message);
        })
    }, [authState, isCheckedOut]);

    useEffect(() => {
        const fetchUserCheckedOutFood = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/foods/secure/ischeckedout/byuser/?foodId=${foodId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken && authState.accessToken.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const bookCheckedOut = await fetch(url, requestOptions);

                if (!bookCheckedOut.ok) {
                    throw new Error('Something went wrong!');
                }

                const bookCheckedOutResponseJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutResponseJson);
            }
            setIsLoadingFoodCheckedOut(false);
        }
        fetchUserCheckedOutFood().catch((error: any) => {
            setIsLoadingFoodCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState]);

    if (isLoading || isLoadingReview || isLoadingCurrentOrderCount || isLoadingFoodCheckedOut || isLoadingUserReview) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    async function checkoutFood() {

        const url = `http://localhost:8080/api/foods/secure/checkout/?foodId=${food && food.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState && authState.accessToken && authState.accessToken.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsCheckedOut(true);
    }

    async function submitReview(starInput: number, reviewDescription: string) {
        let foodId: number = 0;
        if (food && food.id) {
            foodId = food.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, foodId, reviewDescription);
        const url = `http://localhost:8080/api/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState && authState.accessToken && authState.accessToken.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsReviewLeft(true);
    }

    return(
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        <img src={food && food.img} width='226' height='349' alt='Book' />
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{food && food.shortName}</h2>
                            <h5 className='text-primary'>{food && food.cuisine}</h5>
                            <p className='lead'>{food && food.description}</p>
                            { <StarsReview rating={totalStars} size={32} /> }
                        </div>
                    </div>
                    <CheckoutAndReviewBox food={food} mobile={false} currentOrderCount={currentOrderCount} 
                        isAuthenticated={authState && authState.isAuthenticated} isCheckedOut={isCheckedOut} checkoutFood={checkoutFood}
                        isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                </div>
                <hr />
                 <LatestReviews reviews={reviews} foodId={food && food.id} mobile={false}/>
            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center alighn-items-center'>
                    <img src={food && food.img} width='226' height='349' alt='Book' />
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{food && food.shortName}</h2>
                        <h5 className='text-primary'>{food && food.cuisine}</h5>
                        <p className='lead'>{food && food.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                {/* <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount} 
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} 
                    checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/> */}
                <hr />
                <LatestReviews reviews={reviews} foodId={food && food.id} mobile={true} />
            </div>
        </div>
    );
}