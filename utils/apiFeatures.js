export default class APIFeatures {
  //query: MongoQuery , queryStr: express req query
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    let filters = { ...this.queryStr };
    const excludes = ["sort", "limit", "page", "fields"];
    excludes.forEach((el) => delete filters[el]);

    if (filters) {
      //advanced filtering { difficulty: 'easy', price: { $gte: '500' } }
      //http://localhost:3000/api/v1/tours?difficulty=easy&price[gte]=500 => { difficulty: 'easy', price: { gte: '500' } }

      let filterStr = JSON.stringify(filters);
      filterStr = filterStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      filters = JSON.parse(filterStr);
      this.query = this.query.find(filters);
    }

    return this;
  }

  sort() {
    console.log(this.queryStr.sort);
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); //newest first
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select(["-__v"]); //remove unnessasry __v
    }

    return this;
  }

  paginate() {
    //limit = 10 page 1 : [1 - 10], page 2 : [11 - 20], page 3 : [21 - 30]
    const limit = +this.queryStr.limit || 10;
    const page = +this.queryStr.page || 1;
    this.query = this.query.skip((page - 1) * limit).limit(limit);

    return this;
  }
}
