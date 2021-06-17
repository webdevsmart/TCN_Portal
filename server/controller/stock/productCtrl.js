const formidable = require('formidable');
const fs_ex = require('fs-extra'); 
const fs = require('fs'); 
const csv = require('csv-parser');
const path = require('path');    
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const { YES, NO, IMAGE_UPLOAD_URL } = require('../../constants');
const ProductModel = require('../../models/stock/productModel');
const ProductCategory = require('../../models/stock/categoryModel');
const { exit } = require('process');

const uploadProductImage = (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        const time = new Date().getTime();
        const filename = Buffer.from(time + "_" + files.ImageFile.name, 'utf8').toString('hex');
        fs_ex.move(files.ImageFile.path, appRoot + IMAGE_UPLOAD_URL + filename, (err) => {
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
            res.json({status: "fail", message: "Server Error!"});
        });
    }

}

const getProductList = async ( req, res ) => {
    let query = {
        isDelete: NO,
    };
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
    ProductModel.find({ categoryId: req.body.categoryId, isDelete: NO })
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
    ProductModel.updateOne({ _id: req.body._id }, { isDelete: YES })
    .then( result => {
        res.json({ data: result, status: "success" });
    })
    .catch( err => {
        res.json({ err: err, status: "fail" });
    })
}


const uploadSheet = async ( req, res ) => {
    // upload csv file into server.
    let data = [];
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        const time = new Date().getTime();
        const filename = time + "_catSheet";
        fs_ex.move( files.productSheet.path, appRoot + '/uploads/sheets/' + filename, async err => {
            if ( err ) return console.log( err );
            const parser = fs.createReadStream(appRoot + '/uploads/sheets/' + filename)
            .pipe( csv() );
            for await (const row of parser) {
                // Work with each record
                let item = {};
                if (Object.keys(row)[0].trim() === 'category_code') {
                    let productCategory = await ProductCategory.findOne({ 'code' : row[Object.keys(row)[0]].trim()});
                    if ( productCategory !== null ) {
                        item.categoryId = productCategory._id;
                    }
                    item.code = row[Object.keys(row)[1]].trim();
                    item.name = row[Object.keys(row)[2]].trim();
                    item.price = row[Object.keys(row)[3]].trim();
                    item.description = row[Object.keys(row)[4]].trim();
                }
                data.push(item)
            }
            ProductModel.insertMany(data, {ordered: false, dropDups: true})
            .then( result => {
                res.json({ status: "success", file: files.productSheet.name });
            })
            .catch( err => {
                let message = "Server Error";
                if (err.code == 11000) {
                    message = err.writeErrors[0].err.errmsg;
                }
                if ( err._message === 'productCategory validation failed' ) {
                    message = 'Unavailable file style';
                } 
                res.json({ message: message, status: "fail", file: files.productSheet.name }).status(500);
            });
        });        
    });
}

const downloadSheet = ( req, res ) => {
    ProductModel.find({"isDelete" : NO}, async (err, data) => {
        if(err){res.json(err)}
        else {
            const path = 'downloads/file' + Date.now() + '.csv';
            let productData = data;
            const csvWriter = createCsvWriter({
                path: path,
                header: [
                    {id: 'category_code', title: 'Category Code'},
                    {id: 'code', title: 'Code'},
                    {id: 'name', title: 'Name'},
                    {id: 'price', title: 'Price'},
                    {id: 'description', title: 'description'},
                ]
            });
            let index = 0;
            for await (item of data) {
                let productCategory = await ProductCategory.findOne({"_id" : item['categoryId']});
                productData[index] = {
                    'category_code': '',
                    'code': item.code,
                    'name': item.name,
                    'price': item.price,
                    'description': item.description,
                }
                productData[index].category_code = productCategory.code;
                index += 1;
            }
            csvWriter
            .writeRecords(productData)
            .then(()=> {
                res.setHeader('Content-Disposition', "attachment;filename=report.csv")
                res.setHeader('Content-Type', "application/octet-stream")
                res.download(path)
            });
        }

      });
}

module.exports = { uploadProductImage, addProduct, getProductList, getProduct, getProductByCategory, getProductById, deleteProduct, uploadSheet, downloadSheet };