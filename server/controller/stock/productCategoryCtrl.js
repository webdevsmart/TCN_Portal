const formidable = require('formidable');
const csv = require('csv-parser');
const fs_ex = require('fs-extra'); 
const fs = require('fs');
const mime = require('mime');
const json2csv = require('json2csv').parse;
const Downloader = require('nodejs-file-downloader');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const ProductCategoryModel = require('../../models/stock/categoryModel.js');
const {YES, NO} = require('../../constants.js');
// const productCategory = require('../../models/stock/categoryModel.js');
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
    let data = [];
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        const time = new Date().getTime();
        const filename = time + "_catSheet";
        fs_ex.move(files.categorySheet.path, appRoot + '/uploads/sheets/' + filename, (err) => {
            if (err) return console.log(err);
            fs.createReadStream(appRoot + '/uploads/sheets/' + filename)
            .pipe(csv())
            .on('data', async ( row ) => {
                let item = {};
                item.code = row[Object.keys(row)[0]].trim();
                item.name = row[Object.keys(row)[1]].trim();
                data.push(item);
            })
            .on('end', () => {
                ProductCategoryModel.insertMany(data)
                .then( result => {
                    res.json({ status: "success", file: files.categorySheet.name });
                })
                .catch( err => {
                    let message = "";
                    if ( err._message === 'productCategory validation failed' ) {
                        message = 'Unavailable file style';
                    } else {
                        message = 'Server Error!';
                    }
                    res.json({ message: message, status: "fail", file: files.categorySheet.name }).status(500);
                });
            });
        });
    });
}

const downloadSheet = ( req, res ) => {
    ProductCategoryModel.find({"isDelete" : NO}, async (err, data) => {
        if(err){res.json(err)}
        else {
            const path = 'downloads/file' + Date.now() + '.csv';
            const csvWriter = createCsvWriter({
                path: path,
                header: [
                    {id: 'code', title: 'Code'},
                    {id: 'name', title: 'Name'},
                ]
              });
            csvWriter
            .writeRecords(data)
            .then(()=> {
                res.setHeader('Content-Disposition', "attachment;filename=report.csv")
                res.setHeader('Content-Type', "application/octet-stream")
                res.download(path)
            });
        }

      });
}

module.exports = { addCategory, getCategoryList, getTotalCategory, getCategoryById, deleteCategory, uploadSheet, downloadSheet };
