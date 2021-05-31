const Transaction = require('../models/transactionModel.js');
const vendMachine = require('../models/vendMachineModel.js');

const getTotalData = async (req, res) => {
    let result = {};
    totalPrice = await Transaction.aggregate([
        {
            $match: {
                "status" : "success", 
                "time": {
                    $gte: new Date(req.body.data.startDate),
                    $lte: new Date(req.body.data.endDate)
                }
            },
        },
        {
            $group : {
                _id : null, 
                sum : {$sum : '$price'},
                refund : {$sum : '$refund'},
            }   
        }
    ]);
    cardPrice = await Transaction.aggregate([
        {
            $match: {
                "status" : "success", 
                "type" : "CARD",
                "time": {
                    $gte: new Date(req.body.data.startDate),
                    $lte: new Date(req.body.data.endDate)
                }
            }
        },
        {
            $group : {
                _id : null, 
                sum : {$sum : '$price'}
            }   
        }
    ]);
    cashPrice = await Transaction.aggregate([
        {
            $match: {
                "status" : "success", 
                "type" : "CASH",
                "time": {
                    $gte: new Date(req.body.data.startDate),
                    $lte: new Date(req.body.data.endDate)
                }
            }
        },
        {
            $group : {
                _id : null,
                sum : {$sum : '$price'}
            }   
        }
    ]);

    result.totalPrice = totalPrice.length > 0 ? Math.round(totalPrice[0].sum / 100, 2).toLocaleString(undefined, {maximumFractionDigits:2}) : 0;
    result.refundPrice = totalPrice.length > 0 ? Math.round(totalPrice[0].refund / 100, 2).toLocaleString(undefined, {maximumFractionDigits:2}) : 0;
    result.cardPrice = cardPrice.length > 0 ? Math.round(cardPrice[0].sum / 100, 2).toLocaleString(undefined, {maximumFractionDigits:2}): 0;
    result.cashPrice = cashPrice.length > 0 ? Math.round(cashPrice[0].sum / 100, 2).toLocaleString(undefined, {maximumFractionDigits:2}) : 0;

    res.json({status : "success", data: result})
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
    if (condition.sortDir === "ascend") 
        mysort[condition.sort] = 1;
    else 
        mysort[condition.sort] = -1;
    // if (query["$or"].length > 0) {
        detailList.totalSize = await Transaction.countDocuments(query);
    if (condition.sort === 'price')
        detailList.list = await Transaction.find(query).limit(condition.length).skip(condition.start).sort(mysort).forEach(function(doc) {
            db.collection.update(
               { _id: doc._id },
               { $set: { price: parseInt(doc.price) } }
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

module.exports = {getTotalData, getMachineList, getDetail};