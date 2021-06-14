const Transaction = require('../../models/transactionModel.js');

const getTransactionList = async ( req, res ) => {
    let retData = {
        list: [],
        totalSize: 0
    };
    const filter = req.body.data.filter;
    const pageFilter = req.body.data.pageFilter;
    const type = req.body.data.type;
    let query = {
        "time": {
            $gte: new Date(filter.date[0]),
            $lte: new Date(filter.date[1])
        }
    }
    
    query["$and"] = [];
    let $or = {"$or" : []};
    if ( filter.siteID.length > 0 ) {
        filter.siteID.map(item => {
            $or['$or'].push({"siteID" : item});
        });
        query['$and'].push($or);
    } else {
        $or['$or'][0] = {"siteID" : "none"};
        query['$and'].push($or);
    }

    $or = {"$or" : []};
    if ( filter.productID != "all" &&  filter.productID.length > 0) {
        filter.productID.map(item => {
            $or['$or'].push({"product.productID" : item});
        });
        query['$and'].push($or);
    } else if (filter.productID.length == 0) {
        $or['$or'][0] = {"productID" : "none"};
        query['$and'].push($or);
    }

    if ( type == 'CARD' || type == 'CASH' ) {
        query['type'] = type;
    }
    
    if (filter.paymentType == 'CARD' || filter.paymentType == 'CASH') {
        query['type'] = filter.paymentType;
    } else if (filter.paymentType != 'all') {
        query['subType'] = filter.paymentType;
    }

    let mysort = {};
    if ( pageFilter.sort == 'price' ) {
        pageFilter.sort = "product.price";
    }
    if ( pageFilter.sortDir === "ascend" ) 
        mysort[pageFilter.sort] = 1;
    else 
        mysort[pageFilter.sort] = -1;

    retData.totalSize = await Transaction.countDocuments(query);
    if ( pageFilter.sort === 'price' )
        retData.list = await Transaction.find(query).limit(pageFilter.length).skip(pageFilter.start).sort(mysort).forEach( async (doc) => {
            db.collection.update(
               { _id: doc._id },
               { $set: { "product.price": parseInt(doc.product.price) } }
            )
        });
    else
        retData.list = await Transaction.find(query).limit(pageFilter.length).skip(pageFilter.start).sort(mysort);
    
    res.json({status : "success", data: retData})
}

module.exports = { getTransactionList };