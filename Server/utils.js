/**
 * Utility
 */

/**
 * Change array of param error to message
 * @param errors error array
 */
exports.paramErrorMessage = function(errors) {
    let field = new Set();

    errors.array().forEach((item)=>{
        field.add(item.param);
    });

    return 'Invalid value for '+[...field].join(', ');
};