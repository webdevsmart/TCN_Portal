const moment = require('moment');
const Transaction = require('../models/transactionModel.js');
const vendMachine = require('../models/vendMachineModel.js');
const Utility = require('../utility/utility.js');

const getPriceData = async (req, res) => {
    let retData = {
        totalPrice: 0,
        cardPriceState: {
            totalPrice: 0,
            masterPrice: 0,
            visaPrice: 0,
        },
        cashPriceState: {
            totalPrice: 0,
            coinPrice: 0,
            billPrice: 0,
        }
    };
    const filter = req.body.filter;
    let condition = {
        "status" : "success", 
        "time": {
            $gte: new Date(filter.date[0]),
            $lte: new Date(filter.date[1])
        }
    }

    if ( filter.siteID.length > 0 ) {
        condition["$or"] = [];
        filter.siteID.map(item => {
            condition["$or"].push({"siteID" : item})
        });
    }

    let totalPrice = await Transaction.aggregate([
        {
            $match: condition,
        },
        {
            $group : {
                _id : null, 
                sum : {$sum : '$product.price'},
                refund : {$sum : '$refund'},
                fee : {$sum : {$toDouble: '$fee'}},
            }
        }
    ]);

    condition['type'] = 'CARD';
    let cardPrice = await Transaction.aggregate([
        {
            $match: condition
        },
        {
            $group : {
                _id : null, 
                sum : {$sum : '$product.price'}
            }   
        }
    ]);

    condition['subType'] = 'VISA';
    visaPrice = await Transaction.aggregate([
        {
            $match: condition
        },
        {
            $group : {
                _id : null, 
                sum : {$sum : '$product.price'}
            }   
        }
    ]);

    condition['subType'] = 'MASTERCARD';
    masterPrice = await Transaction.aggregate([
        {
            $match: condition
        },
        {
            $group : {
                _id : null, 
                sum : {$sum : '$product.price'}
            }   
        }
    ]);

    delete condition.subType;
    condition.type = 'CASH';
    // console.log(cardPrice);return;
    let cashPrice = await Transaction.aggregate([
        {
            $match: condition
        },
        {
            $group : {
                _id : null,
                sum : {$sum : '$product.price'}
            }   
        }
    ]);

    condition.subType = 'BILL';
    billPrice = await Transaction.aggregate([
        {
            $match: condition
        },
        {
            $group : {
                _id : null,
                sum : {$sum : '$product.price'}
            }   
        }
    ]);

    condition.subType = 'COIN';
    coinPrice = await Transaction.aggregate([
        {
            $match: condition
        },
        {
            $group : {
                _id : null,
                sum : {$sum : '$product.price'}
            }   
        }
    ]);
    retData.totalPrice = totalPrice.length > 0 ? Utility.numberWithCommas(Math.round(totalPrice[0].sum) / 100) : 0;
    retData.refundPrice = totalPrice.length > 0 ? Utility.numberWithCommas(Math.round(totalPrice[0].refund) / 100) : 0;
    retData.feePrice = totalPrice.length > 0 ? Utility.numberWithCommas(Math.round(totalPrice[0].fee) / 100) : 0;
    retData.cardPriceState.totalPrice = cardPrice.length > 0 ? Utility.numberWithCommas(Math.round(cardPrice[0].sum) / 100): 0;
    retData.cardPriceState.visaPrice = visaPrice.length > 0 ? Utility.numberWithCommas(Math.round(visaPrice[0].sum) / 100): 0;
    retData.cardPriceState.masterPrice = masterPrice.length > 0 ? Utility.numberWithCommas(Math.round(masterPrice[0].sum) / 100): 0;
    retData.cashPriceState.totalPrice = cashPrice.length > 0 ? Utility.numberWithCommas(Math.round(cashPrice[0].sum) / 100) : 0;
    retData.cashPriceState.coinPrice = coinPrice.length > 0 ? Utility.numberWithCommas(Math.round(coinPrice[0].sum) / 100) : 0;
    retData.cashPriceState.billPrice = billPrice.length > 0 ? Utility.numberWithCommas(Math.round(billPrice[0].sum) / 100) : 0;

    res.json({status : "success", data: retData})
}

const getMachineList = async(req, res) => {
    machineNameList = [];
    machineList = await vendMachine.find();
    machineList.map((machine) => {
        item = {
            devName : machine.config.DEV_NAME,
            UID: machine.machineUID
        };
        machineNameList.push(item)
    })
    res.json({status : "success", data: machineNameList})
}

const getDetail = async(req, res) => {
    let detailList = {};
    let condition = {
        "machineUIDs" : req.body.data.machineUIDs,
        "start" : req.body.data.start,
        "length" : req.body.data.length,
        "sort" : req.body.data.sort,
        "sortDir" : req.body.data.sortDir,
        "dateRange" : req.body.data.dateRange.dateRange,
    };
    let query = {
        "time": {
            $gte: new Date(condition.dateRange.startDate),
            $lte: new Date(condition.dateRange.endDate)
        },
    };
    if (condition.machineUIDs.length > 0) {
        query["$or"] = [];
        condition.machineUIDs.map(item => {
            query["$or"].push({"machineUID" : item})
        })
    }
    let mysort = {};
    if ( condition.sort == 'price' ) {
        condition.sort = "product.price";
    }
    if (condition.sortDir === "ascend") 
        mysort[condition.sort] = 1;
    else 
        mysort[condition.sort] = -1;
    // if (query["$or"].length > 0) {
        detailList.totalSize = await Transaction.countDocuments(query);
    if (condition.sort === 'price')
        detailList.list = await Transaction.find(query).limit(condition.length).skip(condition.start).sort(mysort).forEach( async (doc) => {
            db.collection.update(
               { _id: doc._id },
               { $set: { "product.price": parseInt(doc.product.price) } }
            )
        });
    else
        detailList.list = await Transaction.find(query).limit(condition.length).skip(condition.start).sort(mysort);
    
    // }
    // else {
    //     detailList.totalSize = await Transaction.find().estimatedDocumentCount();
    //     detailList.list = await Transaction.find().limit(condition.length).skip(condition.start).sort(mysort);
    // } 
    res.json({status : "success", data: detailList})
}

const getSiteIDs = async (req, res) => {
    vendMachine.distinct("siteID")
    .then( result => {
        res.json({status : "success", data: result})
    })
    .catch( err => {
        res.json({status : "error", message: "Server Error"})
    })
}

const getTodayData = async (req, res) => {
    todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0)
    todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999)
    yesterdayStart = new Date(moment().subtract(1, 'days'));
    yesterdayStart.setHours(0, 0, 0, 0)
    yesterdayEnd = new Date(moment().subtract(1, 'days'));
    yesterdayEnd.setHours(23, 59, 59, 999)

    let retData = {
        transactions: {
            totalCount: 0,
            successCount: 0,
            lastRate: 0,
            currentRate: 0
        },
        cardRate: {
            totalPrice: 0,
            cardPrice: 0,
            lastRate: 0,
            currentRate: 0
        }
    }
    const siteID = req.body.siteID;
    let condition = {};
    if ( siteID.length > 0 ) {
        condition["$or"] = [];
        siteID.map(item => {
            condition["$or"].push({"siteID" : item})
        });
    }

    // get total transaction count
    condition['time'] = {
        $gte: todayStart,
        $lte: todayEnd
    },
    retData.transactions.totalCount = await Transaction.countDocuments(condition)
    condition['status'] = 'success'
    retData.transactions.successCount = await Transaction.countDocuments(condition)
    retData.transactions.currentRate = retData.transactions.totalCount == 0 ? 0 : Math.round((retData.transactions.successCount / retData.transactions.totalCount) * 100)
    
    // get success transaction count
    condition['time'] = {
        $gte: yesterdayStart,
        $lte: yesterdayEnd
    }
    delete condition.status;
    yesterdayTotalCount = await Transaction.countDocuments(condition)
    condition['status'] = 'success'
    yesterdaySuccessCount = await Transaction.countDocuments(condition)
    // calculate yesterdays rate
    retData.transactions.lastRate = yesterdayTotalCount === 0 ? 0 : Math.round((yesterdaySuccessCount / yesterdayTotalCount) * 100)

    // get card Rate
    condition['time'] = {
        $gte: todayStart,
        $lte: todayEnd
    };
    let totalPrice = await Transaction.aggregate([
        {
            $match: condition
        },
        {
            $group : {
                _id : null, 
                sum : {$sum : '$product.price'}
            }   
        }
    ]);
    retData.cardRate.totalPrice = totalPrice.length > 0 ? Utility.numberWithCommas(Math.round(totalPrice[0].sum) / 100) : 0;
    condition['type'] = 'CARD';
    let cardPrice = await Transaction.aggregate([
        {
            $match: condition
        },
        {
            $group : {
                _id : null, 
                sum : {$sum : '$product.price'}
            }   
        }
    ]);
    retData.cardRate.cardPrice = cardPrice.length > 0 ? Utility.numberWithCommas(Math.round(cardPrice[0].sum) / 100) : 0;
    retData.cardRate.currentRate = (totalPrice.length == 0 || cardPrice == 0) ? 0 : (totalPrice[0].sum == 0 ? 0 : Math.round((cardPrice[0].sum / totalPrice[0].sum) * 100));
    condition['time'] = {
        $gte: yesterdayStart,
        $lte: yesterdayEnd
    };
    delete condition.type;
    totalPrice = await Transaction.aggregate([
        {
            $match: condition
        },
        {
            $group : {
                _id : null, 
                sum : {$sum : '$product.price'}
            }   
        }
    ]);
    condition['type'] = 'CARD';
    cardPrice = await Transaction.aggregate([
        {
            $match: condition
        },
        {
            $group : {
                _id : null, 
                sum : {$sum : '$product.price'}
            }   
        }
    ]);
    retData.cardRate.lastRate = (totalPrice.length == 0 || cardPrice.length == 0) ? 0 : (totalPrice[0].sum === 0 ? 0 : Math.round( ( cardPrice[0].sum / totalPrice[0].sum) * 100 ));
    // 

    res.json({status : "success", data: retData})
}

const getChartData = async ( req, res ) => {
    let retData = {
        labels: [],
        data: []
    }
    const filter = req.body.filter;
    const tab = req.body.tab;
    let condition = {
        'status' : 'success',
        'time' : {
            $gte: new Date(filter.date[0]),
            $lte: new Date(filter.date[1])
        }
    }
    
    if ( filter.siteID.length > 0 ) {
        condition["$or"] = [];
        filter.siteID.map(item => {
            condition["$or"].push({"siteID" : item})
        });
    }

    if ( tab == 'cardPrice' ) {
        condition.type = "CARD";
    } else if ( tab == 'cashPrice' ) {
        condition.type = "CASH";
    }

    Transaction.aggregate([
        {
            "$match" : condition,
        },
        {
            "$group" : {
                "_id" : { $dateToString: { format: "%m-%d", date: "$time" } },
                "totalPrice": {"$sum" : "$product.price"},
            }
        },
        {
            "$sort" : { _id: 1 }
        }
    ])
    .then( result => {
        result.map( item => {
            retData.labels.push(item._id);
            retData.data.push(Math.round(item.totalPrice) / 100);
        })
        res.json({status : "success", data: retData});
    })
    .catch( err => {
        return res.json({status : "error", "message": "Server Error!"});
    });

}

module.exports = {getPriceData, getMachineList, getDetail, getSiteIDs, getTodayData, getChartData};