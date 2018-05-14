const isEmpty = value =>
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0);

module.exports = validateBodyInput = data => {
    const errors = {};
    const tmpData = {}

    tmpData.fullname = !isEmpty(data.fullname) ? data.fullname : '';
    tmpData.email = !isEmpty(data.email) ? data.email : '';
    tmpData.phone = !isEmpty(data.phone) ? data.phone : '';
    tmpData.address = !isEmpty(data.address) ? data.address : '';

    if(tmpData.fullname.length > 150){
        errors.fullname = 'Full name field is invalid';
    }

    if(tmpData.email.length > 150){
        errors.email = 'Email field is invalid';
    }

    if(tmpData.phone.length > 15){
        errors.phone = 'Phone number field is invalid';
    }

    if(tmpData.address.length > 150){
        errors.address = 'Address field is invalid';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}