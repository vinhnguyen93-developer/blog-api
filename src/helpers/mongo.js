const { model, Types, connection } = require("mongoose");
const serverHelper = require("./server");
const config = require("../config");

const mongoHelper = {};
const nestedArrayDocConfig = ((config || {}).api || {}).nestedArrayDoc;
const isArray = Array.isArray;

mongoHelper.insertOne = async function (modelName, data) {
    var __modelName__ = modelName.toLowerCase();
    const result = new model(__modelName__)(data);
    await result.save();
    return result.toObject();
}

mongoHelper.find = async function (modelName, filter, { options = {}, projection = {}, multi = false } = {}) {
    var __modelName__ = modelName.toLowerCase();
    var handleModel = multi ? "find" : "findOne";

    const r = await model(__modelName__)[handleModel](filter, projection, options);
    if (r) {
        return (r.toObject && typeof r.toObject == "function") ? r.toObject() : r;
    }
}

mongoHelper.update = async function (modelName, filter = {}, data, { options = {}, multi = false } = {}) {
    var __modelName__ = modelName.toLowerCase();
    var handleModel = multi ? "updateMany" : "updateOne";

    return await model(__modelName__)[handleModel](filter, data, options);
}

mongoHelper.deleteOne = async function (modelName, filter, { options = {}, multi = false } = {}) {
    var __modelName__ = modelName.toLowerCase();
    var handleModel = multi ? "deleteMany" : "deleteOne";

    return await model(__modelName__)[handleModel](filter, options);
}

mongoHelper.paginationWrapperMiddleware = function (modelName, filter, { projection = {}, options = {} } = {}) {
    return async function (req, res, next) {
        const pageIndex = req.pagination.index;
        const pageSize = req.pagination.size;

        const docs = await mongoHelper.find(modelName, filter, { projection, multi: true, options: {...options, skip: pageIndex * pageSize, limit: pageSize } });
        serverHelper.successResponse(res, docs);
        return next();
    }
}

mongoHelper.ObjectID = Types.ObjectId;

mongoHelper.aggregate =  async function (collection, operators) {
    return await connection.collection(collection).aggregate(operators).toArray()
}

mongoHelper.insertNestedArrayDoc = async function (collection, filter = {}, primaryKey, refCollection, foreignKey, nestedDoc, data, { document } = {}) {
    const doc = document || await mongoHelper.find(collection, filter);
    if (!doc) return;

    var lastIndex = doc.lastIndex;
    if (lastIndex == null) {
        lastIndex = 0;
        mongoHelper.update(collection, filter, { lastIndex: 0 });
    }

    await mongoHelper.update(refCollection, { [foreignKey]: doc[primaryKey], index: lastIndex }, { $push: { [nestedDoc]: data } });

    return data;
};

mongoHelper.paginationNestedArrayDocMiddleware = async function (collection, filter = {}, primaryKey, refCollection, foreignKey, nestedDoc, data, { document, pageIndex, pageSize, projection } = {}) {
    const doc = document || await mongoHelper.find(collection, filter);
    if (!doc) return null;
    
    var lastIndex = doc.lastIndex;
    var skip = pageIndex * pageSize;
    var paginationIndex = skip / nestedArrayDocConfig.size;
    if (paginationIndex >= lastIndex) paginationIndex = lastIndex;
    if (projection) {
        Object.assign(projection, { [nestedDoc]: 1 });
    }
    var refDoc = await mongoHelper.find(refCollection, { [foreignKey]: doc[primaryKey], index: paginationIndex }, { projection });
    var nestedArrayDocs = refDoc[nestedDoc];
    if (!nestedArrayDocs || !isArray(nestedArrayDocs)) return;

    var paginationData = nestedArrayDocs.slice(skip, pageSize);
    var omissionItem = pageSize - paginationData.length;

    if (omissionItem > 0 || paginationIndex < pageSize) {
        var addtionalRefDoc = await mongoHelper.find(refCollection, { [foreignKey]: doc[primaryKey], index: paginationIndex + 1 }, { projection });
        nestedArrayDocs = addtionalRefDoc[nestedDoc];
        if (!nestedArrayDocs || !isArray(nestedArrayDocs)) {
            refDoc[nestedDoc] = paginationData;
            return refDoc;
        }
        omissionItem = nestedArrayDocs.slice(0, omissionItem);
        paginationData = paginationData.concat(omissionItem);
    }
    
    refDoc[nestedDoc] = paginationData;
    return refDoc;
}

mongoHelper.validate = {
    array: {
        minSize: function (size) {
            return [
                function (value) {
                    if (size == null) return true;
                    return value.length >= size;
                },
                "{PATH} must greater than " + size
            ]
        }
    }
}

module.exports = mongoHelper;