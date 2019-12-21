var path = require('path');

module.exports = {
    entry: {
        // modules: ["./main.js", "./modules/weather.js", "./modules/backgroundImage.js", "./modules/date_time.js", "./modules/location.js", "./modules/language.js", "./modules/map.js", "./modules/speachRecognition.js", "./names.js"]
        modules: ["./main.js", './index.js']
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    }  
};