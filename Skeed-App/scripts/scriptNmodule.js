const fs = require('fs');

fs.unlinkSync('./node_modules/react-native-slideshow/Slideshow.js');
fs.copyFileSync('scripts/Slideshow.js', './node_modules/react-native-slideshow/Slideshow.js');