const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');
const PlanogramModel = require('../../models/planogramModel');
const vendMachineModel = require('../../models/vendMachineModel');
const ProductModel = require('../../models/stock/productModel');

const { IMAGE_UPLOAD_URL } = require('../../constants');

const makeCabinet = async ( req, res ) => {
    let planogram = await PlanogramModel.findOne({ 'machineId': req.body.machineId });
    const vendMachine = await vendMachineModel.findById( req.body.machineId );

    if (planogram === null) {
        planogram = new PlanogramModel();
    }

    let rows = [];
    const maxRow = vendMachine.maxRow === undefined ? 6 : vendMachine.maxRow;
    const maxAisle = vendMachine.maxAisle === undefined ? 10 : vendMachine.maxAisle;

    for ( let i = 1; i <= maxRow; i++ ) {
      let row = {};
      row.rowCode = i;
      row.aisles = [];
      for ( let j = 1; j <= maxAisle; j++ ) {
        let aisle = {
          aisleNum: j + ( i - 1 ) * 10,
          maxQty: 10,
        };
        row.aisles.push(aisle);
      }
      rows.push( row );
    }
    planogram.rows = rows;
    planogram.machineId = req.body.machineId;
    planogram.machineUID = vendMachine.machineUID;

    planogram.save()
    .then( result => {
        res.json({ 'status': 'success' });
    }) 
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    })
}

const getPlanogram = async ( req, res ) => {
    PlanogramModel.findOne({ 'machineId': req.body.machineId })
    .then( result => {
        res.json({ 'status': 'success', data: result });
    })  
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    })
}

const addAisle = async ( rowId, values ) => {
    const planogram = await PlanogramModel.findOne({ 'rows._id': rowId });
    
    let rowIndex = -1;
    await planogram.rows.map( ( row, index ) => {
      if ( row._id == rowId ) {
        rowIndex = index;
      }
    });
    
    if ( vendMachine.maxAisle <= planogram.rows[rowIndex].aisles.length ) {
      return { 'status': 'fail', 'message': "You can't add new aisle.\r This Row is full!" };
    }

    let sameAisleNum = false;
    await planogram.rows[rowIndex].aisles.map ( (aisle, index) => {
        if ( aisle.aisleNum * 1 === values.aisleNum * 1 ) {
            sameAisleNum = true;
        }
    });
    if ( sameAisleNum ) {
        return { 'status': 'fail', 'message': 'Same Asile Number exist!' };
    }
    
    planogram.rows[rowIndex].aisles.push({ ...values });
    planogram.save()
    .then( async result => {
        console.log("ok")
      return { 'status': 'success' };
    })
    .catch( err => {
        console.log("bad")
      return { 'status': 'fail', 'message': 'Server Error!' };
    })
}

// get aisle info
const getAisle = async ( req, res ) => {
    PlanogramModel.aggregate([
        { '$unwind': "$rows" },
        { '$unwind': "$rows.aisles" },
        {
            $match : {
                'rows.aisles._id': ObjectID(req.body.selectedAisle.aisleId)
            } 
        },
    ])
    .then( result => {
        let imageUrl = null;
        if ( result[0].rows.aisles.imageUrl != undefined ) {
            const file = appRoot + IMAGE_UPLOAD_URL + result[0].rows.aisles.imageUrl;
            if ( fs.existsSync(file) ) {
                const bitmap = fs.readFileSync(file);
                imageUrl = bitmap.toString('base64');
            }
        }
        result[0].rows.aisles.imageUrl = imageUrl;
        res.json({ 'status': 'success', 'data': result[0].rows.aisles });
    })
    .catch (err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    });
}

// set aisle info
const setAisle = async ( req, res ) => {
    let aisleNum = "";
    let setQuery = {
        "rows.$[i].aisles.$[j].products": req.body.values.products,
    };
    if ( req.body.values.imageUrl ) {
        setQuery['rows.$[i].aisles.$[j].imageUrl'] = req.body.values.imageUrl;
    }
    if ( req.body.values.products )  {
        setQuery['rows.$[i].aisles.$[j].products'] = req.body.values.products;
    }
    await PlanogramModel.updateOne(
        { },
        {
            $set: setQuery
        },
        {arrayFilters: [{"i._id": req.body.selectedAisle.rowId}, {"j._id": req.body.selectedAisle.aisleId}]}
    )
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    });

    if ( req.body.values.products != undefined && req.body.values.products.length > 0 ) {
        req.body.values.products.map( async ( product, index ) => {
            if (index == 0) {
                let productIndex = -1;
                const planogram = await PlanogramModel.findOne({ "machineId": req.body.selectedAisle.machineId });
                if ( planogram.saleSequence.length > 0 ) {
                    await planogram.saleSequence.map( ( item, index ) => {
                        if (item.productId == product.productId) {
                            productIndex = index;
                        }
                    });
                    if ( productIndex == -1 ) {
                        planogram.saleSequence.push(
                            {
                                productId: product.productId,
                                sequence: [{ "aisleNum" : req.body.selectedAisle.aisleNum }]
                            }
                        );  
                    } else {
                        if ( planogram.saleSequence[productIndex].sequence.length > 0 ) {
                            let sequenceId = -1;
                            await planogram.saleSequence[productIndex].sequence.map( (sequence, index) => {
                                if ( sequence.aisleNum == req.body.selectedAisle.aisleNum ) {
                                    sequenceId = index;
                                } 
                            });
                            if ( sequenceId == -1 ) {
                                planogram.saleSequence[productIndex].sequence.push({ "aisleNum" : req.body.selectedAisle.aisleNum })
                            }
                        } else {
                            planogram.saleSequence[productIndex].sequence.push({ "aisleNum" : req.body.selectedAisle.aisleNum })
                        }
                    }
                } else {
                    planogram.saleSequence.push(
                        {
                            productId: product.productId,
                            sequence: [{ "aisleNum" : req.body.selectedAisle.aisleNum }]
                        }
                    );
                }
                planogram.save()
                .then( result => {
                    res.json({ 'status': 'success' });
                })
                .catch( err => {
                    res.json({ 'status': 'fail', 'message': 'Server Error!' });
                });
            }
        });
    }
    return;
}

const getSequenceData = ( req, res ) => {
    let retData = [];
    PlanogramModel.findOne({ "machineId" : ObjectID(req.body.machineId) })
    .then( async result => {
        await Promise.all(result.saleSequence.map( async item => {
            let subData = {
                _id: item._id,
                productName: '',
                sequence: [],
            };
            await ProductModel.findById(item.productId).then( product => {
                subData.productName = product.name;
                subData.productId = item.productId;
                item.sequence.map( item1 => {
                    subData.sequence.push( item1 );
                });
                retData.push( subData );
            });
        }));
        res.json({ 'status': 'success', 'data': retData });
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    });
}

const setSaleSequence = ( req, res ) => {
    // console.log(req.body.data[0])
    PlanogramModel.updateOne({ machineId: req.body.machineId }, { saleSequence: req.body.data })
    .then( result => {
        console.log(result)
        res.json({ 'status': 'success' });
    })
    .catch (err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    })
    
}

module.exports = { makeCabinet, getPlanogram, addAisle, getAisle, setAisle, getSequenceData, setSaleSequence };