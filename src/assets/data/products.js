import { Bias, Products } from "../data/globalConstants";
import RoomStandee1 from "../images/roomStandee/roomStandee1.JPG";
import RoomStandee2 from "../images/roomStandee/roomStandee2.JPG";
import RoomStandee3 from "../images/roomStandee/roomStandee3.JPG";



export const products = [
    {
        "id": 1,
        "name": "Room Standee",
        "category": Products.STANDEE,
        "price": 550,
        "currency": "INR",
        "inStock": true,
        "images": [
            RoomStandee1,
            RoomStandee2,
            RoomStandee3
        ],
        "members": [Bias.RM, Bias.JIN, Bias.SUGA, Bias.JHOPE, Bias.JIMIN, Bias.V, Bias.JUNGKOOK, Bias.OT7],
        "description": "Brighten up your space with this beautiful BTS Life Goes On Room Standee 🌸 A perfect keepsake to feel their warmth and love every day 💜"
    },
    {
        "id": 2,
        "name": "TaeKook Couple Standee",
        "category": Products.STANDEE,
        "price": 299,
        "currency": "INR",
        "inStock": false,
        "images": [
            "https://example.com/images/bts-standee-front.jpg",
            "https://example.com/images/bts-standee-back.jpg"
        ],
        "members": [Bias.JUNGKOOK],
        "description": "Cute BTS TaeKook acrylic standee to decorate your desk or shelf."
    },
    {
        "id": 3,
        "name": "TaeKook Acrylic Pin",
        "category": Products.KEYCHAIN,
        "price": 199,
        "currency": "INR",
        "inStock": false,
        "images": [
            "https://example.com/images/bts-acrylic-pin.jpg"
        ],
        "members": [Bias.V],
        "description": "Stylish BTS TaeKook acrylic pin for ARMYs."
    },
    {
        "id": 4,
        "name": "TaeKook Enamel Pin",
        "category": Products.ENAMEL_PIN,
        "price": 249,
        "currency": "INR",
        "inStock": false,
        "images": [
            "https://example.com/images/bts-enamel-pin.jpg"
        ],
        "members": [Bias.OT7],
        "description": "High-quality BTS TaeKook enamel pin with glossy finish."
    },
    {
        "id": 5,
        "name": "TaeKook Photocard",
        "category": Products.PHOTOCARD,
        "price": 149,
        "currency": "INR",
        "inStock": true,
        "images": [
            "https://example.com/images/bts-photocard.jpg"
        ],
        "members": ["jimin"],
        "description": "Exclusive BTS TaeKook photocard for collectors."
    },
    {
        "id": 6,
        "name": "TaeKook PC Holder",
        "category": Products.PC_HOLDER,
        "price": 349,
        "currency": "INR",
        "inStock": false,
        "images": [
            "https://example.com/images/bts-pc-holder.jpg"
        ],
        "members": [Bias.JIMIN, Bias.JHOPE],
        "description": "Durable TaeKook photocard holder to protect your collection."
    },
    {
        "id": 7,
        "name": "TaeKook Other Holder",
        "category": Products.OTHER,
        "price": 299,
        "currency": "INR",
        "inStock": true,
        "images": [
            "https://example.com/images/bts-other-holder.jpg"
        ],
        "members": [Bias.RM, Bias.JIN, Bias.SUGA],
        "description": "Multi-purpose TaeKook holder for your BTS merch."
    }
];
