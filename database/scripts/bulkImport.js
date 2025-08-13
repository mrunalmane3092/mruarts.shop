import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import products from '../json/products.js'; // your existing file

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ MongoDB Connected');

        // Create an array to store products that are new or need updating
        const productsToInsert = [];

        for (const product of products) {
            // Find a product by its unique identifier (e.g., SKU, name, or a combination)
            // Assuming 'name' is a unique identifier for this example.
            // You should replace 'name' with the actual unique field from your schema.
            const existingProduct = await Product.findOne({ name: product.name });

            if (!existingProduct) {
                // If the product doesn't exist, add it to our insertion array
                productsToInsert.push(product);
            } else {
                console.log(`⚠️ Product "${product.name}" already exists. Skipping insertion.`);
            }
        }

        // Insert only the new products
        if (productsToInsert.length > 0) {
            await Product.insertMany(productsToInsert);
            console.log(`🎉 Successfully imported ${productsToInsert.length} new products!`);
        } else {
            console.log('✅ No new products to import.');
        }

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });