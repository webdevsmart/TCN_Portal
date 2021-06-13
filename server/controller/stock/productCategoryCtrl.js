const formidable = require('formidable');
const csv = require('csv-parser');
const fs_ex = require('fs-extra'); 
const fs = require('fs');

const ProductCategoryModel = require('../../models/stock/categoryModel.js');
const {YES, NO} = require('../../constants.js');
const productCategory = require('../../models/stock/categoryModel.js');
const { exit } = require('process');

const getCategoryList = async (req, res) => {
    let detaList = {};
    let condition = {
        "start" : req.body.data.start,
        "length" : req.body.data.length,
        "sort" : req.body.data.sort,
        "sortDir" : req.body.data.sortDir,
        "keyword" : req.body.data.keyword,
    };

    let query = {
        isDelete: NO
    };
    if (condition.keyword !== '') {
        query['$or'] = [
            {name: { $regex: condition.keyword }},
            {code: { $regex: condition.keyword }},
        ]
    }
    
    let mysort = {};
    if (condition.sortDir === "ascend") 
        mysort[condition.sort] = 1;
    else 
        mysort[condition.sort] = -1;
    
    detaList.totalSize = await ProductCategoryModel.countDocuments(query);
    detaList.list = await ProductCategoryModel.find(query).limit(condition.length).skip(condition.start).sort(mysort);

    res.json({status : "success", data: detaList})
}

const addCategory = async (req, res) => {
    let productCategory = req.body._id === '' ? null : await ProductCategoryModel.findById( req.body._id );
    const formData = req.body.formData;
    if ( productCategory === null ) {
        productCategory = new ProductCategoryModel({
            ...formData
        });
        productCategory.save()
        .then(( category ) => {
            res.json({ category: category, status: "success" });
        })
        .catch((err) => {
            res.json({ err: err, status: "fail" });
        });
    } else {
        productCategory.update({ ...formData })
        .then(( category ) => {
            res.json({ category: category, status: "success" });
        })
        .catch((err) => {
            res.json({ err: err, status: "fail" });
        });
    }
}

const getTotalCategory = async ( req, res ) => {
    let query = {
        isDelete: NO,
    }
    let dataList = await ProductCategoryModel.find(query);
    res.json({status : "success", data: dataList});
}

const getCategoryById = async ( req, res ) => {
    ProductCategoryModel.findById( req.body._id )
    .then( result => {
        res.json({ data: result, status: "success" });
    })
    .catch( err => {
        res.json({ err: err, status: "fail" });
    })
}

const deleteCategory = async ( req, res ) => {
    ProductCategoryModel.updateOne({ _id: req.body._id }, { isDelete: YES })
    .then( result => {
        res.json({ data: result, status: "success" });
    })
    .catch( err => {
        res.json({ err: err, status: "fail" });
    })
}

const uploadSheet = async ( req, res ) => {
    // upload csv file into server.
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        const time = new Date().getTime();
        const filename = time + "_catSheet";
        fs_ex.move(files.categorySheet.path, appRoot + '/uploads/sheets/' + filename, (err) => {
            if (err) return console.log(err);
            res.json({status : 'success', filename: filename});
            fs.createReadStream(appRoot + '/uploads/sheets/' + filename)
            .pipe(csv())
            .on('data', async ( row ) => {
                const productCategory = new ProductCategoryModel({ ...row });
                try {
                    await productCategory.save();
                }
                catch {
                    console.log("catch error")
                    res.json({ message: "Server Error", status: "fail" });
                    exit();
                }
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
            });
        });
        
    });
}

module.exports = { addCategory, getCategoryList, getTotalCategory, getCategoryById, deleteCategory, uploadSheet };
