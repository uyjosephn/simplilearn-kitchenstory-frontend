import React from "react";


import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";

export const Signup = () => {

    const { authState } = useOktaAuth();

    return(
        <div>
            <div className='d-none d-lg-block'>
                <div className='row g-0 mt-5'>
                    <div className='col-sm-6 col-md-6'>
                        <div className='col-image-left'></div>
                    </div>
                    <div className='col-4 col-md-4 container d-flex justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>What food do you want to try today?</h1>
                            <p className='lead'>
                                Try our best sellers today!
                            </p>
                            {authState && authState.isAuthenticated ? 
                                <Link type='button' className='btn main-color btn-lg text-white'
                                    to='search'>Explore our delicious food</Link>
                                :
                                <Link className='btn main-color btn-lg text-white' to='/login'>Sign up</Link>
                        }
                        </div>
                    </div>
                </div>
                <div className='row g-0'>
                    <div className='col-4 col-md-4 container d-flex 
                        justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>Our food collection is world class!</h1>
                            <p className='lead'>
                                We work nonstop to provide the most delicious food
                            </p>
                        </div>
                    </div>
                    <div className='col-sm-6 col-md-6'>
                        <div className='col-image-right'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}