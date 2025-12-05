import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } from '../../services/api/cartService';
import { createOrderFromProduct } from '../../services/api/orderService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const token = localStorage.getItem('token');

    const fetchCart = async () => {
        try {
            const { cartItems, totalPrice } = await getCart(token);
            const mappedItems = cartItems.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.productName,
                image: item.productImage,
                price: item.price,
                quantity: item.quantity,
            }));
            setCartItems(mappedItems);
            setTotalPrice(totalPrice);
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error.message);
            setCartItems([]);
            setTotalPrice(0);
        }
    };

    const addToCartAction = async (productId, quantity) => {
        try {
            const { cartItems, totalPrice } = await addToCart(token, productId, quantity);
            const mappedItems = cartItems.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.productName,
                image: item.productImage,
                price: item.price,
                quantity: item.quantity,
            }));
            setCartItems(mappedItems);
            setTotalPrice(totalPrice);
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error.message);
            throw error;
        }
    };

    const updateQuantity = async (productId, delta) => {
        const item = cartItems.find(item => item.productId === productId);
        if (!item) return;

        const newQuantity = item.quantity + delta;
        if (newQuantity < 0) return;

        try {
            const { cartItems, totalPrice } = await updateCartQuantity(token, productId, newQuantity);
            const mappedItems = cartItems.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.productName,
                image: item.productImage,
                price: item.price,
                quantity: item.quantity,
            }));
            setCartItems(mappedItems);
            setTotalPrice(totalPrice);
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng:', error.message);
            throw error;
        }
    };

    const removeItem = async (productId) => {
        try {
            const { cartItems, totalPrice } = await removeFromCart(token, productId);
            const mappedItems = cartItems.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.productName,
                image: item.productImage,
                price: item.price,
                quantity: item.quantity,
            }));
            setCartItems(mappedItems);
            setTotalPrice(totalPrice);
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error.message);
            throw error;
        }
    };

    const clearCartAction = async () => {
        try {
            const { cartItems, totalPrice } = await clearCart(token);
            setCartItems(cartItems);
            setTotalPrice(totalPrice);
        } catch (error) {
            console.error('Lỗi khi xóa giỏ hàng:', error.message);
            throw error;
        }
    };

    const orderNow = async (orderData) => {
        try {
            const order = await createOrderFromProduct(token, orderData);
            return order;
        } catch (error) {
            console.error('Lỗi khi đặt hàng trực tiếp:', error.message);
            throw error;
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, totalPrice, addToCart: addToCartAction, updateQuantity, removeItem, clearCart: clearCartAction, fetchCart, orderNow }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);