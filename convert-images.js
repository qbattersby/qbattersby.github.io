const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = 'img';

// Create WebP directory if it doesn't exist
const webpDir = path.join(imageDir, 'webp');
if (!fs.existsSync(webpDir)) {
    fs.mkdirSync(webpDir);
}

// Get all images in the directory
fs.readdir(imageDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        // Process only image files
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
            const inputPath = path.join(imageDir, file);
            const outputPath = path.join(webpDir, `${path.parse(file).name}.webp`);

            sharp(inputPath)
                .webp({ quality: 80 }) // Adjust quality as needed
                .toFile(outputPath)
                .then(() => {
                    console.log(`Converted ${file} to WebP`);
                })
                .catch(err => {
                    console.error(`Error converting ${file}:`, err);
                });
        }
    });
}); 