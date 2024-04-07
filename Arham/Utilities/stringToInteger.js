const convertToInteger = function(value) {
    const mapping = {
        lac: 100000,
        crore: 10000000
    };

    const [number, unit] = value.toLowerCase().split(/\s+/); 
    return mapping[unit] ? parseInt(number) * mapping[unit] : null;
}
module.exports = convertToInteger;