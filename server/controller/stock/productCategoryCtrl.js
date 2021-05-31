const productCategory = require('../../models/stock/categoryModel.js');
const productCategoryModel = require('../../models/stock/categoryModel.js');
const { uploadProductImage } = require('./productCtrl.js');

const getCategoryList = async (req, res) => {
    let detaList = {};
    let condition = {
        "start" : req.body.data.start,
        "length" : req.body.data.length,
        "sort" : req.body.data.sort,
        "sortDir" : req.body.data.sortDir,
        "filter" : req.body.data.filter,
    };

    let query = {};
    
    let mysort = {};
    if (condition.sortDir === "ascend") 
        mysort[condition.sort] = 1;
    else 
        mysort[condition.sort] = -1;
    
    detaList.totalSize = await productCategoryModel.countDocuments(query);
    detaList.list = await productCategoryModel.find(query).limit(condition.length).skip(condition.start).sort(mysort);

    res.json({status : "success", data: detaList})
}

const addCategory = async (req, res) => {
    let productCategory = req.body._id === '' ? null : await productCategoryModel.findById( req.body._id );
    const formData = req.body.formData;
    if ( productCategory === null ) {
        productCategory = new productCategoryModel({
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
    let dataList = await productCategoryModel.find();
    res.json({status : "success", data: dataList});
}

const getCategoryById = async ( req, res ) => {
    productCategoryModel.findById( req.body._id )
    .then( result => {
        res.json({ data: result, status: "success" });
    })
    .catch( err => {
        res.json({ err: err, status: "fail" });
    })
}

const deleteCategory = async ( req, res ) => {
    productCategoryModel.deleteOne({ _id: req.body._id })
    .then( result => {
        res.json({ data: result, status: "success" });
    })
    .catch( err => {
        res.json({ err: err, status: "fail" });
    })
}

module.exports = { addCategory, getCategoryList, getTotalCategory, getCategoryById, deleteCategory };
