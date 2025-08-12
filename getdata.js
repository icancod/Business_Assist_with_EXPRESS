import {productsData} from './data.js';
export const getdata = (req,res) => {

    let filtereddata = productsData//.products || productsData; // Adjusted to access products array if available
    const { title,price,category } = req.query
    if(title){
        filtereddata = filtereddata.filter(product =>
            product.title.toLowerCase().includes(title.toLowerCase())
        )
    }

    if(price){
        filtereddata=filtereddata.filter(product => 
            product.price === parseFloat(price)
        )
    }

    if(category){
        filtereddata = filtereddata.filter(product =>
            product.category.toLowerCase().includes(category.toLowerCase())
        )
    }
res.json(filtereddata)

}

// import { productsData } from './data.js';

// export const getdata = (req, res) => {
//     try {
//         let filtereddata = productsData;
//         const { title, price, category } = req.query;

//         if (title) {
//             filtereddata = filtereddata.filter(product =>
//                 product.title?.toLowerCase().includes(title.toLowerCase())
//             );
//         }

//         if (price) {
//             filtereddata = filtereddata.filter(product =>
//                 product.price === parseFloat(price)
//             );
//         }

//         if (category) {
//             filtereddata = filtereddata.filter(product =>
//                 product.category?.toLowerCase().includes(category.toLowerCase())
//             );
//         }

//         res.json(filtereddata);
//     } catch (err) {
//         console.error("Error in getdata:", err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
