class ReviewRequestModel {
    rating: number;
    foodId: number;
    reviewDescription?: string;

    constructor(rating: number, foodId: number, reviewDescription: string) {
        this.rating = rating;
        this.foodId = foodId;
        this.reviewDescription = reviewDescription;
    }
}

export default ReviewRequestModel;