class AddFoodRequest {
    shortName: string;
    cuisine: string;
    description: string;
    stock: number;
    category: string;
    img?: string;

    constructor(shortName: string, cuisine: string, description: string, stock: number, 
        category: string) {
            this.shortName = shortName;
            this.cuisine = cuisine;
            this.description = description;
            this.stock = stock;
            this.category = category;
        }
}

export default AddFoodRequest;