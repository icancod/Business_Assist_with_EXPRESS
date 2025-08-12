import { productsData } from "./data.js";
export const getdatabypath  = (req,res) => {

    const{field,term}=req.params
    const allowedfields = ['title','price','category']
    if (!allowedfields.includes(field)){
        return res.status(400).json({ Message: " Field not defined Allowed fields are title,price,category "})
    }

    let filtereddata = productsData . filter( product => 
        product[field].toLowerCase() .includes(term.toLowerCase())
    )

    res.json(filtereddata)

}