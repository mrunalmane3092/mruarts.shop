import { use, useEffect, useState } from "react";
import "../../src/style.scss";
import Header from "../components/Header";
import './Shop.scss';
import { products as shopProducts } from '../assets/data/products';
import { Modal, Button, Carousel } from 'react-bootstrap';
import { Bias, Products } from "../assets/data/globalConstants";
import { X } from 'lucide-react';

const Shop = () => {
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState(false);

    const [usdRate, setUsdRate] = useState<number>(0.012); // fallback rate

    const [filterState, setFilterState] = useState({
        option: ''
    });

    const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outStock'>('all');

    const [selectedFilter, setSelectedFilter] = useState('All');

    const [stock, setStock] = useState({
        inStock: false,
    });

    const [members, setMembers] = useState<{ data: string[] }>({
        data: [],
    });

    const [prodTypes, setProdTypes] = useState<{ data: string[] }>({
        data: [],
    });

    const [productData, setProductData] = useState({
        data: shopProducts,
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
        setLoader(true);
        setSelectedFilter(option === 'bias' ? 'Bias' : 'Products');

        setTimeout(() => {
            let filteredProducts = shopProducts;

            // Apply Bias filter if members selected
            if (members.data.length > 0) {
                filteredProducts = filteredProducts.filter((product: any) =>
                    product.members?.some((member: string) =>
                        members.data.includes(member)
                    )
                );
            }

            // Apply Product Type filter if product types selected
            if (prodTypes.data.length > 0) {
                filteredProducts = filteredProducts.filter((product: any) =>
                    prodTypes.data.includes(product.category)
                );
            }

            // Apply Stock filter if needed
            setStockFilter('all');

            // Update state
            setProductData((prevState: any) => ({
                ...prevState,
                data: filteredProducts
            }));

            setLoader(false);
            handleClose();
        }, 500);

    };


    const filterAllProducts = () => {
        setLoader(true);
        setTimeout(() => {
            setProductData((prevState: any) => {
                return {
                    ...prevState,
                    data: shopProducts
                }
            })
            setSelectedFilter('All')
            setLoader(false);
        }, 500);
    }



    const handleMemberRemove = (member: string) => {
        // Update members state
        const updatedMembers = members.data.filter((item: string) => item !== member);
        setMembers((prevState: any) => ({
            ...prevState,
            data: updatedMembers
        }));

        // Filter products based on updated members + existing product types
        const filteredByMembers = shopProducts.filter((product: any) => {
            return (
                updatedMembers.length === 0 ||
                product.members?.some((m: string) => updatedMembers.includes(m))
            );
        });

        // Step 2: filter the already filtered list by product types
        const filteredProducts = filteredByMembers.filter((product: any) => {
            return (
                prodTypes.data.length === 0 ||
                prodTypes.data.includes(product.category)
            );
        });

        // Update product data
        setProductData((prevState: any) => ({
            ...prevState,
            data: filteredProducts
        }));
    };

    const handleProdRemove = (prod: string) => {
        // Update productTypes state
        const updatedProds = prodTypes.data.filter((item: string) => item !== prod);
        setProdTypes((prevState: any) => ({
            ...prevState,
            data: updatedProds
        }));

        // Step 1: filter by product types first
        const filteredByProds = shopProducts.filter((product: any) => {
            return (
                updatedProds.length === 0 ||
                updatedProds.includes(product.category)
            );
        });

        // Step 2: filter the already filtered list by members
        const filteredProducts = filteredByProds.filter((product: any) => {
            return (
                members.data.length === 0 ||
                product.members?.some((m: string) => members.data.includes(m))
            );
        });


        setProductData((prevState: any) => ({
            ...prevState,
            data: filteredProducts
        }));
    }

    useEffect(() => {
        setTimeout(() => {
            let filteredProducts: any = [];
            if (stock.inStock) {
                // If previously false, now show only in-stock
                filteredProducts = productData.data.filter((product: any) => product.inStock === true);
            } else {
                // If previously true, show all
                filteredProducts = shopProducts;
            }

            setProductData((prevState: any) => ({
                ...prevState,
                data: filteredProducts
            }));

            setSelectedFilter('In Stock');
            setLoader(false);
        }, 500);
    }, [stock])

    const applyFilters = (option: string) => {
        let filteredProducts = shopProducts;

        // Apply Bias filter
        if (members.data.length > 0) {
            filteredProducts = filteredProducts.filter((product: any) =>
                product.members?.some((member: string) =>
                    members.data.includes(member)
                )
            );
        }

        // Apply Product Type filter
        if (prodTypes.data.length > 0) {
            filteredProducts = filteredProducts.filter((product: any) =>
                prodTypes.data.includes(product.category)
            );
        }

        // Apply Stock filter from dropdown
        if (option === 'inStock') {
            filteredProducts = filteredProducts.filter((product: any) => product.inStock === true);
        } else if (option === 'outStock') {
            filteredProducts = filteredProducts.filter((product: any) => product.inStock === false);
        }
        setProductData({ data: filteredProducts });
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


    return (
        <section className="main-section">
            <Header />

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


            {loader ? <div className="loader">Loading...</div> : <div className="product-grid">
                {productData.data.map((item: any, index: number) => {
                    return (
                        <div className="product-card" key={item.id || index}>
                            <div className="product-image"
                                onClick={() => handleImageClick(item)}
                                style={{ cursor: "pointer" }}>
                                <img src={item.images[0]} alt={item.name} />
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
                            <p className="fontSize-13px">{selectedProduct?.description}</p>
                        </>

                    )}
                </Modal.Body>
            </Modal>
        </section>
    );
};

export default Shop;
