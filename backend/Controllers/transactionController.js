const Transaction = require("../model/transaction");
const Task = require("../model/taskModel");
const axios=require('axios')
const ErrorHandler = require("../utils/Errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const mongoose = require("mongoose");
const { json } = require("body-parser");

exports.getAllTransaction = catchAsyncError(async (req, res, next) => {
try {
  const {
    page = 1,
    pageSize = 10,
    search = null,
    sortBy = "title",
    sortdirection = 1,
  } = req.query;
  const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);
  const pipeline = [
    {
      $match: {
        ...(![undefined, null, ""].includes(search) && {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { price: parseInt(search) },
            { description: { $regex: search, $options: "i" } },
          ],
        }),
      },
    },
    {
      $sort: {
        [sortBy]: Number(sortdirection),
      },
    },

    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
      },
    },
  ];

  const resp = await getAndCountAll(pipeline);
  return res.status(200).json({
    messag: "you you got all",
    resp,
  });
  
} catch (error) {
  res.status(500).json({
    messag:"Internal Server Error",
    error
  })
}

});

exports.saleData = catchAsyncError(async (req, res, next) => {
try {
  const today = new Date();
const currentMonth =Number(req.query.month) || today.getMonth()+1; // Months are zero-based, so adding 1 to get the current month
  const statics=await Transaction.aggregate([  
        {
          $facet: {//using facet to do multiple aggregation on in query
            soldTransactions: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $month: { $toDate: "$dateOfSale" } }, currentMonth] }, // Convert string to date and extract month
                      { $eq: ["$sold", true] } // Check if sold is true
                    ]
                  }
                }
              }
              ,
              {
                $group: {
                  _id: null,
                  NoOfSoldItem:{
                      $sum:1
                  },
                  totalSaleAmount: {
                    $sum: "$price", // Assuming your transaction amount field is named "amount"
                  },
                },
              },
            ],
            unsoldTransactions: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $month: { $toDate: "$dateOfSale" } }, currentMonth] }, // Convert string to date and extract month
                      { $eq: ["$sold", false] } // Check if sold is false
                    ]
                  }
                }
              },
              {
                $group: {
                  _id: null,
                  NoOfUnSoldItem:{
                      $sum:1
                  },
                },
              }             
            ]
          }
        }
     

  ])

  res.status(200).json({
    totalSaleAmount : statics[0]?.soldTransactions[0]?.totalSaleAmount ?? 0,
    NoOfSoldItem : statics[0]?.soldTransactions[0]?.NoOfSoldItem ?? 0,
    NoOfUnSoldItem : statics[0]?.unsoldTransactions[0]?.NoOfUnSoldItem ?? 0

  });
  
} catch (error) {
  res.status(500).json({
    messag:"internal server Error",
    error
  })
}
});


exports.price=catchAsyncError(async(req,res,next)=>{

try {
  const today = new Date();
  const currentMonth =Number(req.query.month)|| today.getMonth() +1; // Months are zero-based, so adding 1 to get the current month
      const statics = await Transaction.aggregate([
          {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $month: { $toDate: "$dateOfSale" } }, currentMonth] }, // Convert string to date and extract month
                     { $eq: ["$sold", true] } // Check if sold is true
                  ]
                }
              }
            },
          {
            $group: {
              _id: {
                $switch: {
                  branches: [
                    { case: { $and: [{ $gte: ["$price", 0] }, { $lte: ["$price", 100] }] }, then: "0-100" },
                    { case: { $and: [{ $gt: ["$price", 100] }, { $lte: ["$price", 200] }] }, then: "101-200" },
                    { case: { $and: [{ $gt: ["$price", 200] }, { $lte: ["$price", 300] }] }, then: "201-300" },
                    { case: { $and: [{ $gt: ["$price", 300] }, { $lte: ["$price", 400] }] }, then: "301-400" },
                    { case: { $and: [{ $gt: ["$price", 400] }, { $lte: ["$price", 500] }] }, then: "401-500" },
                    { case: { $and: [{ $gt: ["$price", 500] }, { $lte: ["$price", 600] }] }, then: "501-600" },
                    { case: { $and: [{ $gt: ["$price", 600] }, { $lte: ["$price", 700] }] }, then: "601-700" },
                    { case: { $and: [{ $gt: ["$price", 700] }, { $lte: ["$price", 800] }] }, then: "701-800" },
                    { case: { $and: [{ $gt: ["$price", 800] }, { $lte: ["$price", 900] }] }, then: "801-900" },
                    { case: { $gte: ["$price", 900] }, then: "900 and above" }
                  ],
                  default: "Unknown"
                }
              },
              count: { $sum: 1 }
            }
          }
        ]);
        
        const allRanges = [
          "0-100",
          "101-200",
          "201-300",
          "301-400",
          "401-500",
          "501-600",
          "601-700",
          "701-800",
          "801-900",
          "900 and above"
      ];   
     
      // Initialize object to store counts for all ranges
      const categoryCount=allRanges.reduce((acc,range)=>{
          return acc[range]=0
      },{});
      const categoryCounts = allRanges.reduce((acc, range) => {
          acc[range] = 0;
          return acc;
      }, {})
      statics.forEach(item => {
          categoryCounts[item._id] = item.count;
      });
    
        res.status(200).json({
          price:categoryCounts
        })
  
} catch (error) {
  res.status(500).json({
    messag:"internal Server Error",
    error
  })
}

})


exports.CategoryCount=catchAsyncError(async(req,res,next)=>{
try {

  const today = new Date();
  const currentMonth =Number(req.query.month)|| today.getMonth() +1; // Months are zero-based, so adding 1 to get the current month
      const categoryCount=await Transaction.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $month: { $toDate: "$dateOfSale" } }, currentMonth] }, // Convert string to date and extract month
                 { $eq: ["$sold", true] } // Check if sold is true
              ]
            }
          }
        },
          {
              $group:{
                  _id:"$category",
                  Count:{
                      $sum:1
                  }
              }
  
          }
      ])
  res.status(200).json({
      message:"got the data",
      categoryCount
  })
  
} catch (error) {
 res.status(500).json({
  messag:"internal server Error",
  error
 }) 
}
    
})


module.exports.combine=catchAsyncError(async(req,res,next)=>{
  try {
    const priceRangeResponse = await axios.get('http://localhost:4000/api/v1/transaction/price',{ params: {
      month: req.query.month
    }});
    const catgoryRangeResponse = await axios.get('http://localhost:4000/api/v1/transaction/category',{ params: {
      month: req.query.month
    }});
    const saleRangeResponse = await axios.get('http://localhost:4000/api/v1/transaction/statics',{ params: {
      month: req.query.month
    }});
  
    const saleInPriceRange = priceRangeResponse.data.price;
    const saleInCategory = catgoryRangeResponse.data.categoryCount;
    const saleData = saleRangeResponse.data;
  
  
  
    res.status(200).json({
      saleInPriceRange,
    saleInCategory,
     saleData
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
})




async function getAndCountAll(query) {
  const res = await Transaction.aggregate(query);
  return {
    data: res[0].data,
    count: res[0].metadata
      ? res[0].metadata.length
        ? res[0].metadata[0].total
        : 0
      : 0,
  };
}
