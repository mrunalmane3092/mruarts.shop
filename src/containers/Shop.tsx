import { useEffect, useState, useRef } from "react";
import "../../src/style.scss";
import Header from "../components/Header";
import Loader from "../containers/Loader";

import "./Shop.scss";
import { Modal, Carousel } from "react-bootstrap";
import { Bias, Products } from "../assets/data/globalConstants.js";

import { X, Plus, Minus } from "lucide-react";
import Footer from "./Footer";
import API from "../apis/api";
import { useCart } from "../context/CartContext"; // ✅ Global Cart

const Shop = () => {
    const fetchOnce = useRef(false);

    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState(true);
    const [usdRate, setUsdRate] = useState<number>(0.012); // fallback rate

    const [filterState, setFilterState] = useState({ option: "" });
    const [stockFilter, setStockFilter] = useState<
        "all" | "inStock" | "outStock"
    >("all");

    const [members, setMembers] = useState<{ data: string[] }>({ data: [] });
    const [prodTypes, setProdTypes] = useState<{ data: string[] }>({ data: [] });

    const [productData, setProductData] = useState({ data: [] });

    const bias = [
        { key: Bias.OT7, value: "OT 7" },
        { key: Bias.RM, value: "RM" },
        { key: Bias.JIN, value: "Jin" },
        { key: Bias.SUGA, value: "Suga" },
        { key: Bias.JHOPE, value: "JHope" },
        { key: Bias.JIMIN, value: "Jimin" },
        { key: Bias.V, value: "V" },
        { key: Bias.JUNGKOOK, value: "Jungkook" },
    ];

    const productFilters = [
        { key: Products.KEYCHAIN, value: "Keychain" },
        { key: Products.STANDEE, value: "Standee" },
        { key: Products.ACRYLIC_PIN, value: "Acrylic Pin" },
        { key: Products.ENAMEL_PIN, value: "Enamel Pin" },
        { key: Products.PHOTOCARD, value: "Photocards" },
        { key: Products.PC_HOLDER, value: "PC Holder" },
        { key: Products.OTHER, value: "Other" },
    ];

    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // ✅ Global Cart Context
    const { cartProducts, addToCart, decrementFromCart } = useCart();

    useEffect(() => {
        if (fetchOnce.current) return;
        fetchOnce.current = true;

        API.get("/products")
            .then((res: any) => {
                if (res.data.length > 0) {
                    setProductData((prevState: any) => ({
                        ...prevState,
                        data: res.data,
                    }));
                }
                setLoader(false);
            })
            .catch((err: any) => console.error(err));
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = (option: string) => {
        setShow(true);
        setFilterState((prevState: any) => ({
            ...prevState,
            data: option === "bias" ? bias : productFilters,
            option: option,
        }));
    };

    const handleClear = () => {
        if (filterState.option === "bias") {
            setMembers({ data: [] });
        } else {
            setProdTypes({ data: [] });
        }
    };

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
                const res = await fetch(
                    "https://open.er-api.com/v6/latest/INR"
                );

                const data = await res.json();

                if (data?.rates?.USD) {
                    setUsdRate(data.rates.USD);
                    localStorage.setItem('USD_RATE', data.rates.USD);

                }
            } catch (error) {
                console.error("Error fetching exchange rate:", error);
            }
        };
        fetchRate();
    }, []);


    useEffect(() => {
        fetch("https://ipapi.co/json/")
            .then(res => res.json())
            .then(data => {
                if (data.country_name !== "India") {
                    localStorage.setItem('INTERNATIONAL', 'true')
                } else {
                    localStorage.setItem('INTERNATIONAL', 'false')
                }
            });
    }, []);

    const handleImageClick = (product: any) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    // ✅ Fetch products with filters
    const fetchProduct = (
        categories: string[] = prodTypes.data,
        biases: string[] = members.data,
        stock: string = stockFilter
    ) => {
        setLoader(true);

        const params: any = {
            category: categories.join(","),
            bias: biases.join(","),
            stock: stock,
        };

        API.get("/product", { params })
            .then((res) => {
                setProductData({ data: res.data });
                setLoader(false);
            })
            .catch((err) => {
                console.error("Error fetching products", err);
                setLoader(false);
            });
    };

    // ✅ Use context for cart updates
    const handleAddToCart = (e: any, item: any) => {
        e.stopPropagation();
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            totalPrice: item.price,
            images: item.images,
        });
    };

    const handleDecrement = (e: any, id: string) => {
        e.stopPropagation();
        decrementFromCart(id);
    };

    return (
        <>
            <section className="main-section">
                <Header cartProducts={cartProducts} />
                <div className="filter-section">
                    <div className="button-group">
                        <select
                            value={stockFilter}
                            onChange={(e) => {
                                setStockFilter(e.target.value as "all" | "inStock" | "outStock");
                                applyFilters(e.target.value);
                            }}
                            className="stock-dropdown btn btn-primary"
                        >
                            <option value="all">All Products</option>
                            <option value="inStock">In Stock</option>
                            <option value="outStock">Out of Stock</option>
                        </select>
                        <button onClick={() => handleShow("bias")}>Bias</button>
                        <button onClick={() => handleShow("products")}>Products</button>
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

                {loader ? (
                    <Loader />
                ) : (
                    <div className="product-grid">
                        {productData.data.map((item: any, index: number) => {
                            return (
                                <div
                                    className="product-card"
                                    key={item.id || index}
                                    onClick={() => handleImageClick(item)}
                                >
                                    <div className="product-image" style={{ cursor: "pointer" }}>
                                        <img src={item.images[0]} alt={item.name} />

                                        {item.inStock && (
                                            <div className="quantity-selector">
                                                <button
                                                    onClick={(e) => handleAddToCart(e, item)}
                                                    className="quantity-btns"
                                                    disabled={
                                                        item.stock <= (cartProducts[item.id]?.quantity || 0)
                                                    }
                                                >
                                                    <Plus
                                                        size={20}
                                                        className="absolute bottom-0 right-0 bg-white rounded-full"
                                                        strokeWidth={3}
                                                    />
                                                </button>
                                                <span>{cartProducts[item.id]?.quantity || 0}</span>
                                                <button
                                                    onClick={(e) => handleDecrement(e, item.id)}
                                                    disabled={
                                                        !cartProducts[item.id] ||
                                                        cartProducts[item.id].quantity < 1
                                                    }
                                                    className="quantity-btns"
                                                >
                                                    <Minus
                                                        size={20}
                                                        strokeWidth={3}
                                                        className="absolute bottom-0 right-0 bg-white rounded-full"
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-name">{item.name}</h3>
                                        {(item.stock == 1 || item.stock == 2) && (
                                            <p className="product-left">
                                                Last {item.stock} left!!
                                            </p>
                                        )}

                                        <p className="product-price">
                                            ₹{item.price}
                                            <span className="usd"> (${(item.price * usdRate).toFixed(2)})</span>
                                        </p>

                                        <p className={`stock-status ${item.inStock ? "in-stock" : "out-of-stock"}`}>
                                            {item.inStock ? "✅ In Stock" : "❌ Out of Stock"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Filters Modal */}
                <Modal
                    show={show}
                    onHide={handleClose}
                    dialogClassName="custom-top-modal"
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {filterState.option === "bias"
                                ? "Select Your Bias"
                                : "Select Product Type"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            {filterState.option === "bias"
                                ? bias.map((item: any, index: number) => {
                                    const checkboxId = `customCheckbox-${index}`;
                                    return (
                                        <div className="col-6 custom-checkbox" key={index}>
                                            <input
                                                type="checkbox"
                                                id={checkboxId}
                                                className="checkbox-input"
                                                onChange={(event) =>
                                                    setMembers((prev) => ({
                                                        ...prev,
                                                        data: event.target.checked
                                                            ? [...prev.data, item.key]
                                                            : prev.data.filter((m) => m !== item.key),
                                                    }))
                                                }
                                                checked={members.data.includes(item.key)}
                                            />
                                            <label htmlFor={checkboxId} className="checkbox-label">
                                                {item.value}
                                            </label>
                                        </div>
                                    );
                                })
                                : productFilters.map((item: any, index: number) => {
                                    const checkboxId = `customCheckbox-${index}`;
                                    return (
                                        <div className="col-6 custom-checkbox" key={index}>
                                            <input
                                                type="checkbox"
                                                id={checkboxId}
                                                className="checkbox-input"
                                                onChange={(event) =>
                                                    setProdTypes((prev) => ({
                                                        ...prev,
                                                        data: event.target.checked
                                                            ? [...prev.data, item.key]
                                                            : prev.data.filter((p) => p !== item.key),
                                                    }))
                                                }
                                                checked={prodTypes.data.includes(item.key)}
                                            />
                                            <label htmlFor={checkboxId} className="checkbox-label">
                                                {item.value}
                                            </label>
                                        </div>
                                    );
                                })}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-primary"
                            onClick={handleClear}
                            disabled={
                                filterState.option === "bias"
                                    ? !members.data.length
                                    : !prodTypes.data.length
                            }
                        >
                            Clear
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleApply(filterState.option)}
                        >
                            Apply
                        </button>
                    </Modal.Footer>
                </Modal>

                {/* Product Modal */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProduct?.name}</Modal.Title>
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
                                <p className="fontSize-13px marginTop-30">
                                    {selectedProduct?.description}
                                </p>
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
