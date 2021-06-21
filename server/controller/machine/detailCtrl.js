const fs = require('fs');
const VendMachineModel = require('../../models/vendMachineModel');
const PlanogramModel = require('../../models/planogramModel');

const { IMAGE_UPLOAD_URL } = require('../../constants');

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
            if ( fs.existsSync(file) ) {
                const bitmap = fs.readFileSync(file);
                imageUrl = bitmap.toString('base64');
            }
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
        rowLabel: "",
        aisleLabel: "",
        maxAisleNum: 0,
        maxRowHeight: 0,
    };
    VendMachineModel.findById( req.body.machineId )
    .then( result => {
        retData = {
            height: result.height,
            width: result.width,
            rowNum: result.rowNum,
            rowLabel: result.rowLabel,
            aisleLabel: result.aisleLabel,
            maxAisleNum: result.maxAisleNum,
            maxRowHeight: result.maxRowHeight,
        };
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

const makeCabinet = async ( req, res ) => {
    let planogram = await PlanogramModel.findOne({ 'machineId': req.body.machineId });
    const vendMachine = await VendMachineModel.findById( req.body.machineId );

    if (planogram === null) {
        planogram = new PlanogramModel();
    }

    let rows = [];
    const rowNum = vendMachine.rowNum === undefined ? 6 : vendMachine.rowNum;
    const maxAisleNum = vendMachine.maxAisleNum === undefined ? 10 : vendMachine.maxAisleNum;

    for ( let i = 1; i <= rowNum; i++ ) {
      let row = {};
      if ( vendMachine.rowLabel == 'A-Z' ) {
        row.rowLabel = String.fromCharCode(i + 64);
      }
      row.aisles = [];
      for ( let j = 1; j <= maxAisleNum; j++ ) {
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

const getAisle = async ( req, res ) => {
    const planogram = await PlanogramModel.findOne({ 'rows.aisles._id': req.body.selectedAisle.aisleId });
    let rowIndex = -1;
    let aisleIndex = -1;
    let sameRowAisles = [];
    let rowList = [];
    if (planogram !== null) {
        await planogram.rows.map( ( row, index ) => {
            rowList.push( { value: index, label: row.rowLabel } );
            if ( row._id == req.body.selectedAisle.rowId ) {
                rowIndex = index;
            }
        });
        planogram.rows[rowIndex].aisles.map ( (aisle, index) => {
            if ( aisle._id == req.body.selectedAisle.aisleId ) {
                aisleIndex = index;
            } else {
                sameRowAisles.push( { value: index, label: planogram.rows[rowIndex].rowLabel + '-' + aisle.aisleNum } );
            }
        });
        res.json({ 'status': 'success', 'data': planogram.rows[rowIndex].aisles[aisleIndex], sameRowAisles, rowList });
    } else {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    }
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

const setAisle = async ( req, res ) => {
    let isAdd = false;
    let planogram = await PlanogramModel.findOne({ 'rows.aisles._id': req.body.selectedAisle.aisleId });
    if ( planogram === null ) {
        planogram = await PlanogramModel.findOne({ 'rows._id': req.body.selectedAisle.rowId });
        isAdd = true;
    }
    const vendMachine = await VendMachineModel.findById( planogram.machineId );
    let rowIndex = -1;
    let aisleIndex = -1;

    if (planogram !== null) {
        await planogram.rows.map( ( row, index ) => {
            if ( row._id == req.body.selectedAisle.rowId ) {
                rowIndex = index;
            }
        });
        let sameAisleNum = false;

        // check same aisle number exist
        await planogram.rows[rowIndex].aisles.map ( ( aisle, index ) => {
            if ( aisle._id == req.body.selectedAisle.aisleId ) {
                aisleIndex = index;
            } else if ( aisle.aisleNum == req.body.values.aisleNum ) {
                sameAisleNum = true;
            } else if ( req.body.values.aisleNum > ( (rowIndex + 1) * vendMachine.maxAisleNum ) || req.body.values.aisleNum < ( rowIndex * vendMachine.maxAisleNum ) ) {
                return res.json({ 'status': 'fail', 'message': 'Asile Number is not valid!' });    
            }
        });
        if ( sameAisleNum ) {
            return res.json({ 'status': 'fail', 'message': 'Same Asile Number exist!' });
        }
        if ( isAdd ) {
            if ( vendMachine.maxAisleNum <= planogram.rows[rowIndex].aisles.length ) {
                return res.json({ 'status': 'fail', 'message': "You can't add new aisle.\r This Row is full!" });
            }
            planogram.rows[rowIndex].aisles.push({ ...req.body.values });
        } else {
            planogram.rows[rowIndex].aisles[aisleIndex] = { ...req.body.values };
            delete req.body.values.aisleNum;
            let aisleNum = '';
            // save extra 
            // selected aisles with same configuration
            if ( req.body.values.selectedSameAisles.length > 0 ) {
                req.body.values.selectedSameAisles.map( item => {
                    aisleNum = planogram.rows[rowIndex].aisles[item].aisleNum;
                    planogram.rows[rowIndex].aisles[item] = { ...req.body.values };
                    planogram.rows[rowIndex].aisles[item].aisleNum = aisleNum;
                });
            }
            // same all aisles in a row
            if ( req.body.values.selectSameAllRow ) {
                await planogram.rows[rowIndex].aisles.map ( ( aisle, index ) => {
                    aisleNum = planogram.rows[rowIndex].aisles[index].aisleNum;
                    planogram.rows[rowIndex].aisles[index] = { ...req.body.values };
                    planogram.rows[rowIndex].aisles[index].aisleNum = aisleNum;
                })
            }
            // selected Row with same configuration
            if ( req.body.values.selectedSameRows.length > 0 ) {
                req.body.values.selectedSameRows.map( item => {
                    planogram.rows[item].aisles.map( ( aisle, index ) => {
                        aisleNum = planogram.rows[item].aisles[index].aisleNum;
                        planogram.rows[item].aisles[index] = { ...req.body.values };
                        planogram.rows[item].aisles[index].aisleNum = aisleNum;
                    })
                })
            }
            // same all Rows
            if ( req.body.values.selectSameAllRows ) {
                planogram.rows.map( ( item, index1 ) => {
                    planogram.rows[index1].aisles.map( ( aisle, index ) => {
                        aisleNum = planogram.rows[index1].aisles[index].aisleNum;
                        planogram.rows[index1].aisles[index] = { ...req.body.values };
                        planogram.rows[index1].aisles[index].aisleNum = aisleNum;
                    })
                })
            }
            // console.log(planogram.rows);return;

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

const getRowConfig = async ( req, res ) => {
    let retData = {}
    let rowIndex = -1;
    const planogram = await PlanogramModel.findOne({ 'rows._id': req.body.selectedRow.rowId });
    if (planogram !== null) {
        await planogram.rows.map( ( row, index ) => {
            if ( row._id == req.body.selectedRow.rowId ) {
                rowIndex = index;
            }
        });
        console.log(planogram.rows[rowIndex])
        retData = {
            maxHeight: planogram.rows[rowIndex].maxHeight,
            aisleNumber: planogram.rows[rowIndex].aisleNumber,
        }
        res.json({ 'status': 'success', data: retData });
    } else {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    }
}

const setRowConfig = async ( req, res ) => {
    let rowIndex = -1;
    const planogram = await PlanogramModel.findOne({ 'rows._id': req.body.selectedRow.rowId });
    if (planogram !== null) {
        await planogram.rows.map( ( row, index ) => {
            if ( row._id == req.body.selectedRow.rowId ) {
                rowIndex = index;
            }
        });
        planogram.rows[rowIndex].maxHeight = req.body.data.maxHeight;
        planogram.rows[rowIndex].aisleNumber = req.body.data.aisleNumber;
        // console.log(planogram.rows[rowIndex].aisleNumber);return;
        planogram.save()
        .then( result => {
            res.json({ 'status': 'success' });
        })
        .catch( err => {
            res.json({ 'status': 'fail', 'message': 'Server Error!' });
        })
    } else {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });
    }
}

module.exports = { getBasicData, saveBasicData, getConfigData, saveConfigData, getCabinetLayoutData, setCabinetLayout, makeCabinet, getAisle, deleteAisle, setAisle, getRowConfig, setRowConfig };