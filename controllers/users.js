const mariadb = require('../utils/db');

const createUser = async (userData) => {
    let returnData = {
        errorMsg: "Need to include Usesrname, Password and Email Address"
    };

    if (userData) {
        if (userData.userName !== null && userData.userName != "") {
            if (userData.password !== null && userData.password != "") {
                if (userData.emailAddress !== null && userData.emailAddress != "") {
                    let dateTime = new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace('T', ' ');

                    const queryData = [
                        userData.userId || null,
                        userData.userName,
                        userData.emailAddress,
                        userData.password,
                        userData.refreshToken || null,
                        userData.userLevel || 0,
                        dateTime,
                        dateTime
                    ]

                    let conn;

                    try {
                        conn = await mariadb.pool.getConnection();
                        const userNameExistRes = await conn.query("SELECT * FROM users WHERE userName = ?", userData.userName);
                        const emailAddressExistRes = await conn.query("SELECT * FROM users WHERE emailAddress = ?", userData.emailAddress);

                        if (userNameExistRes.length > 0) {
                            returnData = { errorMsg: "username already exists. choose another" };
                        } else if (emailAddressExistRes.length > 0) {
                            returnData = { errorMsg: "emailAddress already exists. choose another" };
                        } else {
                            await conn.query("INSERT INTO users value (?, ?, ?, ?, ?, ?, ?, ?)", queryData);
                        }
                    } catch (err) {
                        throw err;
                    } finally {
                        if (conn) await conn.end();
                        returnData = queryData;
                    };
                } else {
                    returnData = {
                        errorMsg: "no email address entered"
                    }
                }
            } else {
                returnData = {
                    errorMsg: "no password entered"
                };
            }

        } else {
            returnData = {
                errorMsg: "no userName entered"
            };
        }
    }

    return returnData;
}

const getUsers = async (flags) => {
    let users = [];
    let query = "SELECT * FROM users";
    
    // make db call with query made above
    try {
        conn = await mariadb.pool.getConnection();
        const res = await conn.query(query);
        for (let i = 0; i <= res.length - 1; i++) {
            users.push(res[i]);
        }
    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.end();
    };

    // return users array
    return users;
};

const getUser = async (userId) => {
    let user = [];
    let query = "SELECT * FROM users WHERE userId = ?";
    try {
        conn = await mariadb.pool.getConnection();
        const res = await conn.query(query, userId);
        user.push(res[0]);
    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.end();
    };

    return user;
};

const updateUser = async (userId, reqBody) => {
    let user = [];
    let query = "UPDATE users SET userName=?, emailAddress=?, password=?, refreshToken=?, userLevel=?, updatedAt=? WHERE userId=?";
    let dateTime = new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace('T', ' ');

    const queryData = [
        reqBody.userName || null ,
        reqBody.emailAddress || null ,
        reqBody.password || null ,
        reqBody.refreshToken || null,
        reqBody.userLevel || 0,
        dateTime
    ]

    queryData.push(userId);
    try {
        conn = await mariadb.pool.getConnection();
        const res = await conn.query(query, queryData);
        res.affectedRows > 0 ? user = true : user = false;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) await conn.end();
    };

    return user;
};

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser
};