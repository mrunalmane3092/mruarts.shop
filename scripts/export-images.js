// scripts/export-images.js
require('dotenv').config();
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with .env credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Function to fetch all images
async function fetchImages() {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            resource_type: 'image',
            max_results: 500 // adjust if you have more images
        });

        // Extract only the secure URLs
        const urls = result.resources.map(img => img.secure_url);

        // Save URLs to a JSON file
        fs.writeFileSync('cloudinary-images.json', JSON.stringify(urls, null, 2));

        console.log(`✅ Saved ${urls.length} image URLs to cloudinary-images.json`);
    } catch (error) {
        console.error('❌ Error fetching images:', error);
    }
}

fetchImages();
