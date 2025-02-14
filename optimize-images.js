require('dotenv').config();
const tinify = require("tinify");
const fs = require("fs");
const path = require("path");

// Set API key from environment variable
tinify.key = process.env.TINYPNG_API_KEY;

// Directory containing images
const imgDir = "img";

// Get all PNG and JPG files
const getImageFiles = (dir) => {
    const files = fs.readdirSync(dir);
    return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
    });
};

// Optimize images
async function optimizeImages() {
    const images = getImageFiles(imgDir);
    console.log(`Found ${images.length} images to optimize...`);

    for (const image of images) {
        const inputPath = path.join(imgDir, image);
        const outputPath = path.join(imgDir, `optimized-${image}`);
        
        try {
            console.log(`Optimizing ${image}...`);
            const source = tinify.fromFile(inputPath);
            await source.toFile(outputPath);
            
            // Replace original with optimized version
            fs.unlinkSync(inputPath);
            fs.renameSync(outputPath, inputPath);
            
            console.log(`✓ Successfully optimized ${image}`);
        } catch (err) {
            console.error(`Error optimizing ${image}:`, err.message);
        }
    }

    const remaining = tinify.compressionCount;
    console.log(`\nDone! You have ${500 - remaining} compressions remaining this month.`);
}

optimizeImages().catch(console.error);