const fs = require('fs');

function base64_encode(file) {
    return "data:image/gif;base64," + fs.readFileSync(file, 'base64');
}

module.exports = base64_encode