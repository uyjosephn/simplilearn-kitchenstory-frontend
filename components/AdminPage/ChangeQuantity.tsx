import React from "react";
import { useEffect, useState } from "react";
import FoodModel from "../../models/FoodModel";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { ChangeQtyFood } from "./ChangeQtyFood";

export const ChangeQuantityOfFood = () => {

    const [foods, setFoods] = useState<FoodModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [foodsPerPage] = useState(5);
    const [totalAmountOfFoods, setTotalAmountOfFoods] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [foodDelete, setFoodDelete] = useState(false);

    useEffect(() => {
        const fetchFoods = async () => {
            const baseUrl: string = `http://localhost:8080/api/foods?page=${currentPage - 1}&size=${foodsPerPage}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.foods;

            setTotalAmountOfFoods(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedFoods: FoodModel[] = [];

            for (const key in responseData) {
                loadedFoods.push({
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

            setFoods(loadedFoods);
            setIsLoading(false);
        };
        fetchFoods().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, foodDelete]);

    const indexOfLastFood: number = currentPage * foodsPerPage;
    const indexOfFirstFood: number = indexOfLastFood - foodsPerPage;
    let lastItem = foodsPerPage * currentPage <= totalAmountOfFoods ?
        foodsPerPage * currentPage : totalAmountOfFoods;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteFood = () => setFoodDelete(!foodDelete);

    if (isLoading) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className='container mt-5'>
            {totalAmountOfFoods > 0 ?
                <>
                    <div className='mt-3'>
                        <h3>Number of results: ({totalAmountOfFoods})</h3>
                    </div>
                    <p>
                        {indexOfFirstFood + 1} to {lastItem} of {totalAmountOfFoods} items: 
                    </p>
                    {foods.map(food => (
                       <ChangeQtyFood food={food} key={food.id} deleteFood={deleteFood}/>
                    ))}
                </>
                :
                <h5>Add a food before changing quantity</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}