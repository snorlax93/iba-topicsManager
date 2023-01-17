const mariadb = require('../utils/db');
const logger = require('../controllers/logging');

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

        await logger.setLoggingInfo('databaseController', 3, 'info', '4000', JSON.stringify(query), {'userId': null, 'userIpAddress': null, 'reqHost': null});

        let queryString = '';

        for (const queryPiece of query.options.buildPattern) {
            queryString += query.options[queryPiece] + ' ';
        }
        
       queryString = queryString.slice(0, queryString.lastIndexOf(' undefined'));

        let queryData = query.options.queryData !== null ? query.options.queryData : null;

        const response = await connection.query(queryString, queryData);

        await logger.setLoggingInfo('databaseController', 3, 'info', '4001', response, {'userId': null, 'userIpAddress': null, 'reqHost': null});

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
        databaseReturn['statusMessage'] = error.message;
        await logger.setLoggingInfo('databaseController', 3, 'error', '4003', JSON.stringify(databaseReturn), {'userId': null, 'userIpAddress': null, 'reqHost': null});
        // log error
    } finally {
        if (connection) {
            await connection.end();
        };
    }

    await logger.setLoggingInfo('databaseController', 3, 'info', '4002', JSON.stringify(databaseReturn), {'userId': null, 'userIpAddress': null, 'reqHost': null});
    return databaseReturn;
};


module.exports = {
    queryDatabase
};