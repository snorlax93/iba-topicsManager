const mariadb = require('../utils/db');

/**
 * method: queryDatabase
 * params: object query: { queryString : string, options : {tableName : string, queryData: [data1, data2, ...]} }
 * description: to query the database for the application. will log each transaction before and after singular attempt is made
 * returns: { data : [ ... ], statusCode : code, statusMessage : message }
 */

const queryDatabase = async (query) => {
    let databaseReturn = {
        data: null,
        statusCode: null,
        statusMessage: null
    };
    
    let queriedData = [];
    const connection = await mariadb.pool.getConnection();

    try {
        const response = await connection.query(query.queryString, query.options.queryData);

        if (response.length) {
            for (let i = 0; i <= response.length - 1; i++) {
                queriedData.push(response[i]);
            }
        }
        if (response.affectedRows > 0) {
            databaseReturn.statusCode = 'Success';
            databaseReturn.statusMessage = 'Successfully modified the database';
        } else if (response.affectedRows == 0) {
            databaseReturn.statusCode = 'Error';
            databaseReturn.statusMessage = 'There was no modification to the database. Review Query';
        } else {
            databaseReturn.data = queriedData.length > 0 ? queriedData : null;
            databaseReturn.statusCode = 'Success';
            databaseReturn.statusMessage = 'Successfully queried the database';
        }


    } catch (error) {
        databaseReturn.statusCode = 'Error';
        databaseReturn.statusMessage = JSON.stringify(error.text);
        // log error
    } finally {
        if (connection) {
            await connection.end();
        };
    }

    return databaseReturn;
};


module.exports = {
    queryDatabase
};