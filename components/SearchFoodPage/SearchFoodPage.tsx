import React from "react";
import { useEffect, useState } from 'react';
import FoodModel from "../../models/FoodModel";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchFood } from "./SearchFood";

export const SearchFoodPage = () => {

    const [foods, setFoods] = useState<FoodModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [foodsPerPage] = useState(5);
    const [totalAmountOfFoods, setTotalAmountOfFoods] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [cuisineSelection, setCuisineSelection] = useState('Food category');

    useEffect(() => {
        const fetchFoods = async () => {
            const baseUrl: string = "http://localhost:8080/api/foods";

            let url: string = '';

            if(searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${foodsPerPage}`;
            } else {
                url = baseUrl + searchUrl;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.foods;

            setTotalAmountOfFoods(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages)

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
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (isLoading) {
        return (
            <SpinnerLoading/>
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const searchHandleChange = () => {
        if(search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByShortNameContaining?shortName=${search}&page=0&size=${foodsPerPage}`)
        }
    }

    const cuisineField = (value: string) => {
        if (
            value.toLowerCase() === 'mexican' || 
            value.toLowerCase() === 'american' || 
            value.toLowerCase() === 'indian' || 
            value.toLowerCase() === 'italian'
        ) {
            setCuisineSelection(value);
            setSearchUrl(`/search/findByCuisine?cuisine=${value}&page=0&size=${foodsPerPage}`)
        } else {
            setCuisineSelection('All');
            setSearchUrl(`?page=0&size=${foodsPerPage}`)
        }
    }

    const indexOfLastFood: number = currentPage * foodsPerPage;
    const indexOfFirstFood: number = indexOfLastFood - foodsPerPage;
    let lastItem = foodsPerPage * currentPage <= totalAmountOfFoods ? foodsPerPage * currentPage: totalAmountOfFoods;
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input className='form-control me-2' type='search'
                                        placeholder='Search' aria-labelledby='Search'
                                        onChange={e => setSearch(e.target.value)}/>
                                <button className='btn btn-outline-success'
                                    onClick={() => searchHandleChange()}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="dropdown">
                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown'
                                    aria-expanded='false'>
                                    {cuisineSelection}
                                </button>
                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li>
                                        <a onClick={() => cuisineField('All')} className='dropdown-item' href='#'>
                                            All
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={() => cuisineField('American')} className='dropdown-item' href='#'>
                                            American
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={() => cuisineField('Italian')} className='dropdown-item' href='#'>
                                            Italian
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={() => cuisineField('Mexican')} className='dropdown-item' href='#'>
                                            Mexican
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={() => cuisineField('Italian')} className='dropdown-item' href='#'>
                                            Indian
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>  
                    {totalAmountOfFoods > 0 ? 
                    <>
                        <div className="mt-3">
                            <h5>Number of results: ({totalAmountOfFoods})</h5>
                        </div>
                        <p>
                            {indexOfFirstFood + 1} to {lastItem} of {totalAmountOfFoods} items:
                        </p>
                        {foods.map(food => (
                            <SearchFood food={food} key={food.id}/>
                        ))}
                    </> 
                    :
                    <div className='m-5'>
                        <h3>
                            Can't find what you are looking for?
                        </h3>
                        <a type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-white'
                            href='#'>Food Services</a>
                    </div>
                    }
                    {totalPages > 1 && 
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>
                    }
                </div>
            </div>
        </div>
    );

}