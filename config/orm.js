var connection = require('../config/connection.js');

function objToSql(ob) {
    var arr = [];

    // loop through the keys and push the key/value as a string int arr
    for (var key in ob) {
        var value = ob[key];
        // check to skip hidden properties
        if (Object.hasOwnProperty.call(ob, key)) {
            // if string with spaces, add quotations (Fresca Burger => 'Fresca Burger')
            if (typeof value === "string" && value.indexOf(" ") >= 0) {
                value = "'" + value + "'";
            }
            // e.g. {burger_name: 'Fresca Burger'} => ["burger_name='Fresca Burger'"]
            // e.g. {devoured: true} => ["devoured=true"]
            arr.push(key + "=" + value);
        }
    }

    // translate array of strings to a single comma-separated string
    return arr.toString();
}


var orm = {
    selectAll: function(table, callback){
        var queryString = "SELECT * FROM " + table + ";"
        connection.query(queryString, function(err, result) {
            if (err) throw err;
            callback(result);
        });
    },
    insertOne: function(table, cols, values, callback){
        var queryString = "INSERT INTO " + table;
        queryString += " (";
        queryString += cols.toString();
        queryString += ") ";
        queryString += "VALUES (?";
        queryString += ") ";

        connection.query(queryString, values, function(err, result) {
            if (err) {
                throw err;
            }
            callback(result);
        });
    },
    updateOne: function(table, objColVals, condition, callback) {
        console.log(objColVals)
        var queryString = "UPDATE " + table;
        queryString += " SET ";
        queryString += objToSql(objColVals);
        queryString += " WHERE ";
        queryString += condition;

        console.log(queryString);
        connection.query(queryString, function(err, result) {
            if (err) {
                throw err;
            }
            callback(result);
        });
    },
}
module.exports = orm;