const formidable = require('formidable');
const fs = require('fs-extra'); 
const path = require('path');    
const product = require('../../models/stock/productModel');

const ProductModel = require('../../models/stock/productModel');

const uploadProductImage = (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        const time = new Date().getTime();
        const filename = Buffer.from(time + "_" + files.ImageFile.name, 'utf8').toString('hex');
        fs.move(files.ImageFile.path, appRoot + '/uploads/products/' + filename, (err) => {
            if (err) return console.log(err);
            res.json({status : 'success', filename: filename});
        });
    });
}

const addProduct = async (req, res) => {
    let formdata = req.body.data;
    let product = await ProductModel.findById(formdata._id);
    if (product === null) {
        product = new ProductModel({
            ...formdata
        });
        product.save()
        .then(product => {
            res.json({status: "success"});
        })
        .catch(err => {
            res.json({status: "fail", message: err});
        });
    } else {
        if (formdata['imageFile'] === '') {
            delete formdata['imageFile'];
        }
        product.update({ ...formdata })
        .then(product => {
            res.json({status: "success"});
        })
        .catch(err => {
            res.json({status: "fail", message: err});
        });
    }

}

const getProductList = async ( req, res ) => {
    let query = {};
    const condition = req.body.filter;
    let mysort = {};
    if (condition.sortDir === "ascend") 
        mysort[condition.sort] = 1;
    else 
        mysort[condition.sort] = -1;

    if ( condition.keyword !== '' ) {
        query.name = '/.*' + condition.keyword + '*./';
    }
    
    const totalCount = await ProductModel.countDocuments(query);
    ProductModel.find(query).limit(condition.length).skip(condition.start).sort(mysort)
    .then(result => {
        res.json({ 'status': 'success', data: {list: result, totalCount: totalCount} });  
    })
    .catch(err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });  
    });

}

const getProduct = async (req, res) => {
    ProductModel.findById(req.body._id)
    .then( product => {
        res.json({ 'status': 'success', data: product });  
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });  
    })
}

const getProductByCategory = async ( req, res ) => {
    ProductModel.find({ categoryId: req.body.categoryId })
    .then( product => {
        res.json({ 'status': 'success', data: product });  
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });  
    })
}

const getProductById = async ( req, res ) => {
    ProductModel.findById( req.body._id )
    .then( product => {
        res.json({ 'status': 'success', data: product });  
    })
    .catch( err => {
        res.json({ 'status': 'fail', 'message': 'Server Error!' });  
    })
}

const deleteProduct = async ( req, res ) => {
    ProductModel.deleteOne({ _id: req.body._id })
    .then( result => {
        res.json({ data: result, status: "success" });
    })
    .catch( err => {
        res.json({ err: err, status: "fail" });
    })
}

module.exports = { uploadProductImage, addProduct, getProductList, getProduct, getProductByCategory, getProductById, deleteProduct };