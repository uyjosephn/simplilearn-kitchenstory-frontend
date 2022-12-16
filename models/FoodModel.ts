class FoodModel {
    id: number;
    shortName?: string;
    cuisine?: string;
    description?: string;
    stock?: number;
    stockAvailable?: number;
    category?: string;
    img?: string;

    constructor(id: number, shortName: string, cuisine: string, descrption: string, stock: number, stockAvailable: number,
        category: string, img: string) {

        this.id = id;
        this.shortName = shortName;
        this.cuisine = cuisine;
        this.description = descrption; 
        this.stock = stock; 
        this.stockAvailable = stockAvailable; 
        this.category = category;
        this.img = img;
    }
}

export default FoodModel;