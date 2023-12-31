import React, { useEffect, useState } from "react";
import "./Shop.css";
import Product from "../product/Product";
import Cart from "../cart/Cart";
import {
  addToLocalDb,
  deleteShoppingCartFromLDB,
  getShoppingCart,
} from "../../utilities/localDB";
import { Link } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  // Load data from database
  useEffect(() => {
    fetch("products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);
  // Load data from Local storage
  useEffect(() => {
    const storedCart = getShoppingCart();
    const savedCart = [];
    // step 1: get id
    for (const id in storedCart) {
      // step 2: get the product by using id
      const addedProduct = products.find((product) => product.id === id);
      if (addedProduct) {
        // step 3: add quantity
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        // step 4: add the added product to the saved cart
        savedCart.push(addedProduct);
        // console.log(addedProduct);
      }
    }
    // step 5: set the cart
    setCart(savedCart);
  }, [products]);

  const handleAddToCard = (product) => {
    // const newCart = [...cart, product];
    let newCart = [];
    const exists = cart.find((pd) => pd.id === product.id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd.id !== product.id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToLocalDb(product.id);
  };

  // clear cart to db
  const clearCartHandler = () => {
    setCart([]);
    deleteShoppingCartFromLDB();
  };

  return (
    <div className="shop_container">
      <div className="products_container">
        {products.map((product) => (
          <Product
            key={product.id}
            product={product}
            handleAddToCard={handleAddToCard}
          ></Product>
        ))}
      </div>
      <div className="order_summary">
        <Cart cart={cart} clearCartHandler={clearCartHandler}>
          <Link to="/review">
            <button className="px-4 p-0.5 w-full mr-40 bg-yellow-600 text-white flex justify-between rounded-sm">
              <span>Review Order</span>
              <span>icon</span>
            </button>
          </Link>
        </Cart>
      </div>
    </div>
  );
};

export default Shop;
