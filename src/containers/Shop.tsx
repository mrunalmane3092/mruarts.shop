import { use, useEffect, useState, useRef } from "react";
import "../../src/style.scss";
import Header from "../components/Header";
import Loader from "../containers/Loader";

import './Shop.scss';
// import { products as shopProducts } from '../assets/data/products';
import { Modal, Button, Carousel } from 'react-bootstrap';
import { Bias, Products } from "../assets/data/globalConstants.js";

import { X, ShoppingCart, Plus, Minus } from 'lucide-react';
import Footer from "./Footer";
import API from "../apis/api";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

const Shop = () => {
    const fetchOnce = useRef(false);

    const [show, setShow] = useState(false);

    const [loader, setLoader] = useState(true);

    const [usdRate, setUsdRate] = useState<number>(0.012); // fallback rate

    const [filterState, setFilterState] = useState({
        option: ''
    });

    const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outStock'>('all');

    const [members, setMembers] = useState<{ data: string[] }>({
        data: [],
    });

    const [prodTypes, setProdTypes] = useState<{ data: string[] }>({
        data: [],
    });

    const [productData, setProductData] = useState({
        data: [],
    });

    const bias = [
        { key: Bias.OT7, value: 'OT 7', },
        { key: Bias.RM, value: 'RM', },
        { key: Bias.JIN, value: "Jin", },
        { key: Bias.SUGA, value: 'Suga', },
        { key: Bias.JHOPE, value: 'JHope' },
        { key: Bias.JIMIN, value: 'Jimin' },
        { key: Bias.V, value: 'V', },
        { key: Bias.JUNGKOOK, value: 'Jungkook', },
    ];

    const productFilters = [
        { key: Products.KEYCHAIN, value: 'Keychain' },
        { key: Products.STANDEE, value: 'Standee' },
        { key: Products.ACRYLIC_PIN, value: "Acrylic Pin" },
        { key: Products.ENAMEL_PIN, value: 'Enamel Pin' },
        { key: Products.PHOTOCARD, value: 'Photocards' },
        { key: Products.PC_HOLDER, value: 'PC Holder' },
        { key: Products.OTHER, value: 'Other' }
    ];

    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const [cartProducts, setCartProducts] = useState<Record<string, CartItem>>({});

    useEffect(() => {
        if (fetchOnce.current) return;
        fetchOnce.current = true;

        API.get('/products')
            .then((res: any) => {
                if (res.data.length > 0) {
                    setProductData((prevState: any) => ({
                        ...prevState,
                        data: res.data
                    }));
                }
                setLoader(false);
            })
            .catch((err: any) => console.error(err));
    }, []);


    const handleBiasCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, key: string, value: string) => {
        if (event.target.checked) {
            setMembers((prevState: any) => {
                return {
                    ...prevState,
                    data: [...prevState.data, key]
                }
            })
        } else {
            setMembers((prevState: any) => {
                return {
                    ...prevState,
                    data: prevState.data.filter((item: any) => item !== key),
                }
            })
        }
    };

    const handleProdTypesCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, key: string, value: string) => {
        if (event.target.checked) {
            setProdTypes((prevState: any) => {
                return {
                    ...prevState,
                    data: [...prevState.data, key]
                }
            })
        } else {
            setProdTypes((prevState: any) => {
                return {
                    ...prevState,
                    data: prevState.data.filter((item: any) => item !== key),
                }
            })
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = (option: string) => {
        setShow(true);
        setFilterState((prevState: any) => ({
            ...prevState,
            data: option === 'bias' ? bias : productFilters,
            option: option
        }));
    };

    const handleClear = () => {
        if (filterState.option === 'bias') {
            setMembers({ data: [] });
        } else {
            setProdTypes({ data: [] });
        }
    }

    const handleApply = (option: string) => () => {
        fetchProduct();
        handleClose();
    };

    const handleMemberRemove = (member: string) => {
        // Update members state
        const updatedMembers = members.data.filter((item: string) => item !== member);
        setMembers((prevState: any) => ({
            ...prevState,
            data: updatedMembers
        }));

        fetchProduct(prodTypes.data, updatedMembers, stockFilter);
        handleClose();
    };

    const handleProdRemove = (prod: string) => {
        // Update productTypes state
        const updatedProds = prodTypes.data.filter((item: string) => item !== prod);
        setProdTypes((prevState: any) => ({
            ...prevState,
            data: updatedProds
        }));

        fetchProduct(updatedProds, members.data, stockFilter);
        handleClose();
    }

    const applyFilters = (option: string) => {
        fetchProduct(prodTypes.data, members.data, option);
        handleClose();
    };

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const res = await fetch("https://api.exchangerate.host/latest?base=INR&symbols=USD");
                const data = await res.json();
                if (data?.rates?.USD) {
                    setUsdRate(data.rates.USD);
                }
            } catch (error) {
                console.error("Error fetching exchange rate:", error);
            }
        };
        fetchRate();
    }, []);

    const handleImageClick = (product: any) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    // Centralized fetch function
    const fetchProduct = (categories: string[] = prodTypes.data, biases: string[] = members.data, stock: string = stockFilter) => {
        setLoader(true);
        const selectedCategories = categories;
        const selectedBiases = biases;
        const selectedStock = stock;

        const params: any = {
            category: selectedCategories.join(','),
            bias: selectedBiases.join(','),
            stock: selectedStock
        };

        API.get('/product', { params })
            .then((res) => {
                setProductData({ data: res.data });
                setLoader(false);
            })
            .catch((err) => {
                console.error('Error fetching products', err);
                setLoader(false);
            });
    };

    const addToCart = (e: any, item: any) => {
        e.stopPropagation();

        const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price, // unit price
        };

        setCartProducts((prevState: any) => {
            const updatedCart = { ...prevState };

            if (updatedCart[item.id]) {
                const newQty = updatedCart[item.id].quantity + 1;
                updatedCart[item.id].quantity = newQty;
                updatedCart[item.id].totalPrice = newQty * updatedCart[item.id].price;
            } else {
                updatedCart[item.id] = {
                    ...cartItem,
                    quantity: 1,
                    totalPrice: cartItem.price
                };
            }

            return updatedCart;
        });
    };

    const decrement = (e: any, id: string) => {
        e.stopPropagation();

        setCartProducts((prevState: any) => {
            const updatedCart = { ...prevState };

            if (updatedCart[id]) {
                if (updatedCart[id].quantity > 1) {
                    const newQty = updatedCart[id].quantity - 1;
                    updatedCart[id].quantity = newQty;
                    updatedCart[id].totalPrice = newQty * updatedCart[id].price;
                } else {
                    delete updatedCart[id];
                }
            }

            return updatedCart;
        });
    };

    useEffect(() => {
        console.log(cartProducts)
    }, [cartProducts])



    return (
        <>
            <section className="main-section">
                <Header cartProducts={cartProducts} />
                <div className="filter-section">
                    <div className="button-group">
                        <select
                            value={stockFilter}
                            onChange={(e) => {
                                setStockFilter(e.target.value as 'all' | 'inStock' | 'outStock');
                                applyFilters(e.target.value); // re-run filtering when dropdown changes
                            }}
                            className="stock-dropdown btn btn-primary"
                        >
                            <option value="all">All Products</option>
                            <option value="inStock">In Stock</option>
                            <option value="outStock">Out of Stock</option>
                        </select>
                        <button onClick={() => handleShow('bias')}>Bias</button>
                        <button onClick={() => handleShow('products')}>Products</button>
                    </div>

                    {(members.data.length > 0 || prodTypes.data.length > 0) && (
                        <div className="selected-options">
                            {members.data.length > 0 && (
                                <div>
                                    <p className="selectedOption-label">Selected Bias:</p>
                                    {members.data.map((member: any, index: number) => (
                                        <span key={index} className="selectedChips">
                                            {member}
                                            <X size={18} color="#4b0082" className="selectedChips-close" onClick={() => handleMemberRemove(member)} />
                                        </span>
                                    ))}
                                </div>
                            )}

                            {prodTypes.data.length > 0 && (
                                <div>
                                    <p className="selectedOption-label">Selected Type:</p>
                                    {prodTypes.data.map((prod: any, index: number) => (
                                        <span key={index} className="selectedChips">
                                            {prod.replace(/_/g, ' ')}
                                            <X size={18} color="#4b0082" className="selectedChips-close" onClick={() => handleProdRemove(prod)} />
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {loader ?
                    <Loader></Loader>
                    : <div className="product-grid">
                        {productData.data.map((item: any, index: number) => {
                            return (
                                <div className="product-card" key={item.id || index} onClick={() => handleImageClick(item)}>


                                    <div className="product-image"
                                        style={{ cursor: "pointer" }}>
                                        <img src={item.images[0]} alt={item.name} />

                                        {item.inStock && (
                                            <div className="quantity-selector">
                                                <button
                                                    onClick={(e) => addToCart(e, item)}
                                                    className="quantity-btns"
                                                    disabled={item.stock <= (cartProducts[item.id]?.quantity)}
                                                >
                                                    <Plus
                                                        size={20}
                                                        className="absolute bottom-0 right-0 bg-white rounded-full"
                                                        strokeWidth={3} />
                                                </button>
                                                <span>{cartProducts[item.id]?.quantity || 0}</span>
                                                <button
                                                    onClick={(e) => decrement(e, item.id)}
                                                    disabled={!cartProducts[item.id] || cartProducts[item.id].quantity < 1}
                                                    className="quantity-btns"
                                                >
                                                    <Minus size={20} strokeWidth={3} className="absolute bottom-0 right-0 bg-white rounded-full" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <p className="prod-details title"><b>{item.name}</b></p>
                                        <p className="prod-details">
                                            <span>
                                                Price: <b>₹{item.price}</b>
                                                <small style={{ marginLeft: "8px" }}>
                                                    (${(item.price * usdRate).toFixed(2)})
                                                </small>
                                            </span>
                                        </p>
                                        <p className="prod-details stock-info">({item.inStock ? 'In Stock' : 'Out Of Stock'})</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>}

                <Modal
                    show={show}
                    onHide={handleClose}
                    dialogClassName="custom-top-modal"
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {filterState.option === 'bias' ? 'Select Your Bias' : 'Select Product Type'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            {filterState.option === 'bias' ? (
                                <>
                                    {bias.map((item: any, index: number) => {
                                        const checkboxId = `customCheckbox-${index}`;
                                        return (
                                            <div className="col-6 custom-checkbox" key={index}>
                                                <input
                                                    type="checkbox"
                                                    id={checkboxId}
                                                    className="checkbox-input"
                                                    onChange={(event) => handleBiasCheckboxChange(event, item.key, item.value)}
                                                    checked={members.data.includes(item.key)}
                                                />
                                                <label htmlFor={checkboxId} className="checkbox-label">
                                                    {item.value}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </>
                            ) : (
                                <>
                                    {productFilters.map((item: any, index: number) => {
                                        const checkboxId = `customCheckbox-${index}`;
                                        return (
                                            <div className="col-6 custom-checkbox" key={index}>
                                                <input
                                                    type="checkbox"
                                                    id={checkboxId}
                                                    className="checkbox-input"
                                                    onChange={(event) => handleProdTypesCheckboxChange(event, item.key, item.value)}
                                                    checked={prodTypes.data.includes(item.key)}
                                                />
                                                <label htmlFor={checkboxId} className="checkbox-label">
                                                    {item.value}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary" onClick={handleClear} disabled={filterState.option === 'bias' ? !members.data.length : !prodTypes.data.length}>
                            Clear
                        </button>
                        <button className="btn btn-primary" onClick={handleApply(filterState.option)}>
                            Apply
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <p>
                            <Modal.Title>{selectedProduct?.name}</Modal.Title>
                        </p>

                    </Modal.Header>
                    <Modal.Body>
                        {selectedProduct && (
                            <>
                                <Carousel>
                                    {selectedProduct.images.map((img: string, idx: number) => (
                                        <Carousel.Item key={idx}>
                                            <img
                                                className="d-block w-100"
                                                src={img}
                                                alt={`${selectedProduct.name} ${idx + 1}`}
                                                style={{ maxHeight: "500px", objectFit: "contain" }}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                                <p className="fontSize-13px marginTop-30">{selectedProduct?.description}</p>
                            </>
                        )}
                    </Modal.Body>
                </Modal>
            </section>
            <Footer />
        </>
    );
};

export default Shop;
