import React from "react"
import { ReturnFood } from "./ReturnFood";
import { useEffect, useState } from "react";
import FoodModel from "../../models/FoodModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const Carousel = () => {

    const [foods, setFoods] = useState<FoodModel[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchFoods = async () => {
            const baseUrl: string = "http://localhost:8080/api/foods";

            const url: string = `${baseUrl}?page=0&size=3`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            console.log(responseJson);

            const responseData = responseJson._embedded.foods;

            const loadedFood: FoodModel[] = [];

            for (const key in responseData) {
                loadedFood.push({
                    id: responseData[key].id,
                    shortName: responseData[key].shortName,
                    cuisine: responseData[key].cuisine,
                    description: responseData[key].description,
                    stock: responseData[key].stock,
                    stockAvailable: responseData[key].stockAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setFoods(loadedFood);
            setIsLoading(false);
        };

        fetchFoods().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []); 

    if(isLoading) {
        return(
            <SpinnerLoading/>
        )
    }

    if(httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    return (
        <div className="container md-5" style={{ height: 550 }}>
            <div className="homepage-carousel-title">
                <h3>Find your cravings here.</h3>
            </div>
            <div id="carouselExampleControls" className="carousel carousel-dark slide mt-5 d-none d-lg-block" data-bs-interval="false">
                {/* Desktop */}
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="rod d-flex justify-content-center align-items-center">
                            {foods.slice(0, 3).map(food => (
                                    <ReturnFood food={food} key={food.id} />
                                ))}
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
}