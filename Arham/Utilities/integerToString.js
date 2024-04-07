const convertToString = function (value){
    if(value>=100000 && value<=9999999){
        return(`${value/100000} lacs`);
    }else if (value === 10000000) {
        return `${value / 10000000} crore`;
    }
    else{
        return(`${value/10000000} crores` );
    }
}
module.exports = convertToString;