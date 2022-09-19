const _ = require("lodash");

class InvalidMessageError extends Error {}
class MismatchMessageCodeError extends Error {}

function checkfield(fieldtype, fieldvalue, fieldoptions){
    switch(fieldtype){
        case "str":
            return _.isString(fieldvalue);
        case "dict":
            return _.isPlainObject(fieldvalue);
        case "list":
            return _.isArray(fieldvalue);
        case "id":
            return (
                typeof fieldvalue == "bigint" ||
                (_.isInteger(fieldvalue) && fieldvalue >= 1)
            );
        case "uri": 
            return _.isString(fieldvalue); // TODO more strict
        default:
            return false;
    }
}



const exported = function(format, format_options){
    // format: [code, { name, type }, ...]
    const code = format[0];
    let ret = function(params_dict){
        let built = [code];
        for(let i=1; i<format.length; i++){
            let { name: fieldname, type: fieldtype, options: fieldoptions } =
                format[i];
            let fieldvalue = params_dict[fieldname];

            if(!fieldoptions) fieldoptions = {};

            if(fieldvalue === undefined && fieldoptions.default !== undefined){
                built.push(fieldoptions.default);
            } else {
                if(checkfield(fieldtype, fieldvalue, fieldoptions)){
                    built.push(fieldvalue);
                } else {
                    console.error(
                        "Failed building message: " +
                        `Field ${fieldname} with value ${fieldvalue}`
                    );
                    throw new InvalidMessageError();
                }
            }
        }
        return built;
    }

    ret.code = code;
    ret.parse = function(data_list){
        if(!_.isArray(data_list)){
            throw new InvalidMessageError();
        }
        if(data_list[0] != code){
            throw new MismatchMessageCodeError();
        }
        if(!(
            data_list.length == format.length ||
            ( format_options && format_options.minlength && format_options.maxlength && (
                data_list.length <= format_options.maxlength &&
                data_list.length >= format_options.minlength
            ))
        )){
            console.error("c");
            throw new InvalidMessageError();
        }

        const parsed = {};
        for(let i=1; i<data_list.length; i++){
            let { name: fieldname, type: fieldtype } = format[i];
            let fieldvalue = data_list[i];

            if(checkfield(fieldtype, fieldvalue)){
                parsed[fieldname] = fieldvalue;
            } else {
                console.error("d", fieldname, fieldtype, fieldvalue);
                throw new InvalidMessageError();
            }
        }
        return parsed;
    }

    return ret;
}

exported.InvalidMessageError = InvalidMessageError;
exported.MismatchMessageCodeError = MismatchMessageCodeError;


export default exported;
