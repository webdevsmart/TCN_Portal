const PlanogramModel = require('../../models/planogramModel');
const vendMachineModel = require('../../models/vendMachineModel');

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
  
  const deleteAisle = async ( req, res ) => {
    const planogram = await PlanogramModel.findOne({ 'rows.aisles._id': req.body.aisleId });
    let rowIndex = -1;
    let aisleIndex = -1;
    if (planogram !== null) {
      await planogram.rows.map( ( row, index ) => {
        if ( row._id == req.body.rowId ) {
          rowIndex = index;
            }
        });
        planogram.rows[rowIndex].aisles.map ( (aisle, index) => {
            if ( aisle._id == req.body.aisleId ) {
                aisleIndex = index;
            }
        });
        planogram.rows[rowIndex].aisles.splice(aisleIndex, 1);
        planogram.save()
        .then( result => {
            res.json({ 'status': 'success'});
        })
        .catch( err => {
            res.json({ 'status': 'fail', 'message': 'Server Error!' });
        })
    } else {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    }
}

const getAisle = async ( req, res ) => {
    const planogram = await PlanogramModel.findOne({ 'rows.aisles._id': req.body.selectedAisle.aisleId });
    let rowIndex = -1;
    let aisleIndex = -1;
    if (planogram !== null) {
        await planogram.rows.map( ( row, index ) => {
            if ( row._id == req.body.selectedAisle.rowId ) {
                rowIndex = index;
            }
        });
        planogram.rows[rowIndex].aisles.map ( (aisle, index) => {
            if ( aisle._id == req.body.selectedAisle.aisleId ) {
                aisleIndex = index;
            }
        });
        res.json({ 'status': 'success', 'data': planogram.rows[rowIndex].aisles[aisleIndex] });
    } else {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    }
}

const setAisle = async ( req, res ) => {
    let isAdd = false;
    let planogram = await PlanogramModel.findOne({ 'rows.aisles._id': req.body.selectedAisle.aisleId });
    if ( planogram === null ) {
        planogram = await PlanogramModel.findOne({ 'rows._id': req.body.selectedAisle.rowId });
        isAdd = true;
    }
    const vendMachine = await vendMachineModel.findById( planogram.machineId );
    let rowIndex = -1;
    let aisleIndex = -1;

    if (planogram !== null) {
        await planogram.rows.map( ( row, index ) => {
            if ( row._id == req.body.selectedAisle.rowId ) {
                rowIndex = index;
            }
        });
        let sameAisleNum = false;
        await planogram.rows[rowIndex].aisles.map ( ( aisle, index ) => {
            if ( aisle._id == req.body.selectedAisle.aisleId ) {
                aisleIndex = index;
            } else if ( aisle.aisleNum == req.body.values.aisleNum ) {
                sameAisleNum = true;
            }
        });
        if ( sameAisleNum ) {
            return res.json({ 'status': 'fail', 'message': 'Same Asile Number exist!' });
        }
        if ( isAdd ) {
            planogram.rows[rowIndex].aisles.push({ ...req.body.values });
        } else {
            planogram.rows[rowIndex].aisles[aisleIndex] = { ...req.body.values };
        }
        planogram.save()
        .then( result => {
            res.json({ 'status': 'success'});
        })
        .catch( err => {
            console.log(err)
            res.json({ 'status': 'fail', 'message': 'Server Error!' });
        })
    } else {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    }
}

module.exports = { makeCabinet, getPlanogram, addAisle, deleteAisle, getAisle, setAisle };