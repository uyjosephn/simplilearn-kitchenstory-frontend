import React from 'react';
import { Link } from 'react-router-dom';

export const ExploreFood = () => {
    return (
        <div className="p-5 mb-4 bg-dark header">
            <div className="container-fluid py-5 text-white d-flex justify-content-center align-items-center">
                <div>
                    <h1 className="display-5 fw-bold">Find your favorite food</h1>
                    <p className="col-md-8">What is your cravings today</p>
                    <Link className="btn main-color btn-lg text-white" type="button" to="/search">Our best sellers</Link>
                </div>

            </div>
        </div>
    )
}