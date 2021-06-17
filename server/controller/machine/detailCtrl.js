const imageToBase64 = require('image-to-base64');
const fs = require('fs');
const VendMachineModel = require('../../models/vendMachineModel');

const { YES, NO, IMAGE_UPLOAD_URL } = require('../../constants');

const getBasicData = async ( req, res ) => {
    let retData = {
        machineName: "",
        siteID: "",
        imageUrl: "",
        description: "",
        status: "",
        // location: ""
    };
    VendMachineModel.findById( req.body.machineId )
    .then( result => {
        let imageUrl = "";
        
        if ( result.imageUrl != undefined ) {
            const file = appRoot + IMAGE_UPLOAD_URL + result.imageUrl;
            const bitmap = fs.readFileSync(file);
            imageUrl = bitmap.toString('base64');
        } 
        retData = {
            machineName: result.machineName,
            siteID: result.siteID,
            imageUrl: result.imageUrl,
            description: result.description,
            status: result.status,
            imageUrl: imageUrl,
            // location: result.location
        };
        res.json({ status: "success", data: retData });
    })
    .catch( err => {
        res.json({ status: "fail", message: "Server Error" });
    })
}

const saveBasicData = ( req, res ) => {
    VendMachineModel.updateOne({ _id: req.body.machineId }, { ...req.body })
    .then( result => {
        res.json({ status: "success" });
    })
    .catch ( err => {
        res.json({ status: "fail", message: "Server Error" });
    })
}

const getConfigData = ( req, res ) => {
    VendMachineModel.findById( req.body.machineId )
    .then( result => {
        res.json({ 'status': 'success', data: result });  
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });  
    });
} 

const saveConfigData = ( req, res ) => {
    VendMachineModel.updateOne( { _id: req.body.machineId }, {config: { ...req.body.data}} )
    .then( result => {
        res.json({ 'status': 'success' });
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });  
    });
}

const getCabinetLayoutData = ( req, res ) => {
    let retData = {
        height: 0,
        width: 0,
        rowNum: 0,
        rowLable: "",
        aisleLable: "",
        maxAisleNum: 0,
        maxRowHeight: 0,
    };
    VendMachineModel.findById( req.body.machineId )
    .then( result => {
        retData = {
            height: result.height,
            width: result.width,
            rowNum: result.rowNum,
            rowLable: result.rowLabel,
            aisleLable: result.aisleLabel,
            maxAisleNum: result.maxAisleNum,
            maxRowHeight: result.maxRowHeight,
        };
        console.log(retData)
        res.json({ 'status': 'success', data: retData });  
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });  
    });
}

const setCabinetLayout = ( req, res ) => {
    VendMachineModel.updateOne( { _id: req.body.machineId }, { ...req.body.data } )
    .then( result => {
        res.json({ 'status': 'success' });
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });  
    });
}

module.exports = { getBasicData, saveBasicData, getConfigData, saveConfigData, getCabinetLayoutData, setCabinetLayout };