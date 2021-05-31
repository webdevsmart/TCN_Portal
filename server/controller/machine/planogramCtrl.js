const PlanogramModel = require('../../models/planogramModel');

const makeCabinet = async ( req, res ) => {
    let planogram = await PlanogramModel.findOne({ 'machineId': req.body.machineId });

    if (planogram === null) {
        planogram = new PlanogramModel();
    }

    let rows = [
        { rowCode: 'A' },
        { rowCode: 'B' },
        { rowCode: 'C' },
        { rowCode: 'D' },
        { rowCode: 'E' },
        { rowCode: 'F' }
    ];
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

const addAisle = async ( req, res ) => {
    const planogram = await PlanogramModel.findOne({ 'rows._id': req.body.rowId });
    let rowIndex = -1;
    await planogram.rows.map( ( row, index ) => {
        if ( row._id == req.body.rowId ) {
            rowIndex = index;
        }
    });
    planogram.rows[rowIndex].aisles.push({
        aisleNum: 0,
        width: '0',
        height: '0',
        maxQty: 0
    });
    planogram.save()
    .then( result => {
        res.json({ 'status': 'success'});
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
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
        planogram.rows[rowIndex].aisles[aisleIndex] = { ...req.body.values};
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