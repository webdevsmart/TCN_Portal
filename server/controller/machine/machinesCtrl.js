const vendMachineModel = require('../../models/vendMachineModel');

const getMachineList = async (req, res) => {
    let query = {};
    const condition = req.body.filter;
    let mysort = {};
    if (condition.sortDir === "ascend") 
        mysort[condition.sort] = 1;
    else 
        mysort[condition.sort] = -1;

    if ( condition.keyword !== '' ) {
        query.devName = '/.*' + condition.keyword + '*./';
    }

    const totalCount = await vendMachineModel.countDocuments(query);

    vendMachineModel.find(query).limit(condition.length).skip(condition.start).sort(mysort)
    .then( result => {
        res.json({ 'status': 'success', data: {list: result, totalCount: totalCount} });  
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });  
    })
}

const getMachineById = async ( req, res ) => {
    vendMachineModel.findById( req.body._id )
    .then( result => {
        res.json({ 'status': 'success', data: result });  
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });  
    })
}

const setMachineConfig = async ( req, res ) => {
    let vendMachine = await vendMachineModel.findById( req.body._id );
    vendMachine.config = { ...req.body.data };
    vendMachine.siteId = req.body.data.siteId;
    vendMachine.status = req.body.data.status;
    vendMachine.save()
    .then( result => {
        res.json({ 'status': 'success' });  
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });  
    })
}

module.exports = { getMachineList, getMachineById, setMachineConfig };