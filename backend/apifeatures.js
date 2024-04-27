class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // search() {
  //     if (this.queryStr.keyword) {
  //       this.query.push(`WHERE ProductName ILIKE '%${this.queryStr.keyword}%'`);
  //     }
  //     return this;
  // }
  search() {
    if (this.queryStr.keyword) {
      if (this.query.some((element) => element.includes('WHERE'))) {
        // If there's already a WHERE clause, append AND condition
        this.query.push(`AND ProductName ILIKE '%${this.queryStr.keyword}%'`);
      } else {
        // If there's no WHERE clause, add a new WHERE condition
        this.query.push(`WHERE ProductName ILIKE '%${this.queryStr.keyword}%'`);
      }
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    if (this.query.some((element) => element.includes('WHERE'))) {
      this.query.push(`AND StockQuantity > 0`);
    } else {
      this.query.push(`WHERE StockQuantity > 0`);
    }

    const filters = Object.entries(queryCopy)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(' AND ');

    if (filters) {
      if (this.query.some((element) => element.includes('WHERE'))) {
        this.query.push(`AND ${filters}`);
      } else {
        this.query.push(`WHERE ${filters}`);
      }
    }

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const offset = resultPerPage * (currentPage - 1);

    this.query.push(`LIMIT ${resultPerPage} OFFSET ${offset}`);

    return this;
  }
}

module.exports = ApiFeatures;
