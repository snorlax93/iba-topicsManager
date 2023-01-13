const mariadb = require('../utils/db');

const createTopic = async (topicData) => {
    let returnData = {
        errorMsg: "Need to include TopicUrl and TopicName"
    };

    if (topicData) {
        if (topicData.topicName !== null && topicData.topicName != "") {
            if (topicData.topicUrl !== null && topicData.topicUrl != "") {
                let dateTime = new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' ');

                const queryData = [
                    topicData.topicId || null, 
                    topicData.topicName, 
                    topicData.topicUrl, 
                    topicData.createdBy || "TESTING", 
                    topicData.episode || "TESTING", 
                    topicData.completed || "FALSE", 
                    dateTime, dateTime
                ]

                let conn;

                try {
                    conn = await mariadb.pool.getConnection();
                    await conn.query("INSERT INTO topics value (?, ?, ?, ?, ?, ?, ?, ?)", queryData);
                } catch (err) {
                    throw err;
                } finally {
                    if (conn) await conn.end();
                    returnData = queryData;
                };

            } else {
                returnData = {
                    errorMsg: "no topic url entered"
                };
            }

        } else {
            returnData = {
                errorMsg: "no topic name entered"
            };
        }
    }

    return returnData;
};

const getTopics = async (flags) => {
    let topics = [];
    let query = "";

    if (flags && flags.completed && flags.completed === "TRUE") {
        query = "SELECT * FROM topics";
    } else {
        query = "SELECT * FROM topics WHERE completed != \"TRUE\"";
    }
    // make db call with query made above
    try {
        conn = await mariadb.pool.getConnection();
        const res = await conn.query(query);
        for (let i = 0; i <= res.length - 1; i++) {
            topics.push(res[i]);
        }
    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.end();
    };

    // return topics array
    return topics;
};

const getTopic = async (topicId) => {
    let topic = [];
    let query = "SELECT * FROM ibatool.topics WHERE topicId = ?";
    try {
        conn = await mariadb.pool.getConnection();
        const res = await conn.query(query, topicId);
        topic.push(res[0]);
    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.end();
    };

    return topic;
};

const updateTopic = async (topicId, reqBody) => {
    let topic = [];
    let query = "UPDATE topics SET topicName=?, topicUrl=?, createdBy=?, plannedEpisode=?, completed=? WHERE topicId=?";
    let queryData = [
        reqBody.topicName ? reqBody.topicName : '', 
        reqBody.topicUrl ? reqBody.topicUrl : '', 
        reqBody.createdBy ? reqBody.createdBy : '', 
        reqBody.plannedEpisode ? reqBody.plannedEpisode : '', 
        reqBody.completed ? reqBody.completed : 'FALSE'
    ];
    queryData.push(topicId);
    try {
        conn = await mariadb.pool.getConnection();
        const res = await conn.query(query, queryData);
        res.affectedRows > 0 ? topic = true : topic = false;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) await conn.end();
    };

    return topic;
};

const deleteTopic = async (topicId) => {
    let topic = [];
    let query = "DELETE FROM topics WHERE topicId=?";
    try {
        conn = await mariadb.pool.getConnection();
        const res = await conn.query(query, [topicId]);
        res.affectedRows > 0 ? topic = true : topic = false;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) await conn.end();
    };

    return topic;
}

module.exports = {
    createTopic,
    getTopics,
    getTopic,
    updateTopic,
    deleteTopic
};