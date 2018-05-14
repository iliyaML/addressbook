const isEmpty = value =>
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0);

module.exports = validateBodyInput = data => {
    const errors = {};

    data.fullname = !isEmpty(data.fullname) ? data.fullname : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.phone = !isEmpty(data.phone) ? data.phone : '';
    data.address = !isEmpty(data.address) ? data.address : '';

    if(data.fullname.length > 150){
        errors.fullname = 'Full name field is invalid';
    }

    if(data.email.length > 150){
        errors.email = 'Email field is invalid';
    }

    if(data.phone.length > 15){
        errors.phone = 'Phone number field is invalid';
    }

    if(data.address.length > 150){
        errors.address = 'Address field is invalid';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}