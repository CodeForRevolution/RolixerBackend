Roxiler Assesment For Backend

IMP NOTE => please wait for 5 to 10 min for response as it is deployed on free instance 

1. Get All Transactions
URL: /getAll
Method: GET
Description: Retrieve all transactions with optional pagination and search filters.
Query Parameters:
  page: Page number for pagination (default: 1) it can change by passing query.page=value
  pageSize: Number of transactions per page (default: 10)  
  search: Search query to filter transactions appled on price description and title
  sortBy: Field to sort transactions by (default: "title") it can be change by passing query.sorby
  sortDirection: Sorting direction (1 for ascending, -1 for descending) it can be change by passing sorDirection

2. Get Sales Data by price Range
URL=https://roxiler-utj7.onrender.com/api/v1/transaction/price
Method: GET
Description: Retrieve sales data for the specified month. and send the no of sales from the particular price range
Query Parameters:
month: Month for which to retrieve sales data (month value will be the range from 1 to 12 considering 1 for january 12 December)


3. Get Sales Data by Category 
URL=https://roxiler-utj7.onrender.com/api/v1/transaction/category
Method: GET
Description: Retrieve sales data for the specified month. and send the no of product sold from the particular category
Query Parameters:
month: Month for which to retrieve sales data by categoyr

4. Get Sales Data by product Count 
URL=https://roxiler-utj7.onrender.com/api/v1/transaction/statics
Method: GET
Description: Retrieve sales data for the specified month. and send the no of product sold  ,totalSaleAmount  and totalunSoldItem from the particular month
Query Parameters:
month: Month for which to retrieve sales data by product Count (month value will be the range from 1 to 12 considering 1 for january 12 December)



4. Get the Graphs Data 
URL=https://roxiler-utj7.onrender.com/api/v1/transaction/graphData?month=6
Method: GET
Description: Retrieve all above three request data and send it in one
Query Parameters:
month: Month for which to retrieve sales data by product Count (month value will be the range from 1 to 12 considering 1 for january 12 December)

