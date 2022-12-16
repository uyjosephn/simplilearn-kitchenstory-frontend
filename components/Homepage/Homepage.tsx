import React from "react";
import { Carousel } from "./Carousel";
import { ExploreFood } from "./ExploreFood";
import { FoodServices } from "./FoodServices";
import { Signup } from "./Signup";

export const HomePage = () => {
    return (
        <>
            <ExploreFood/>
            <Carousel/>
            <Signup/>
            <FoodServices/>
        </>
    );
}
