const _ = require('lodash');
const querystring = require('querystring');

module.exports.setPaginationHeaders = function (req, res, page, pages, total) {
  const baseURL = `${process.env.BASE_URL}${req.baseUrl}${req.path}?`;
  const query = _.clone(req.query);
  let link = '';
  page = parseInt(page);
  if (page < pages - 1) {
    query.page = page + 1;
    link += `<${baseURL}${querystring.stringify(query)}>; rel="next"`;
  }
  if (page < pages - 2) {
    if (link.length > 0) {
      link += ',';
    }
    query.page = pages;
    link += `<${baseURL}${querystring.stringify(query)}>; rel="last"`;
  }
  if (page > 2) {
    if (link.length > 0) {
      link += ',';
    }
    query.page = 1;
    link += `<${baseURL}${querystring.stringify(query)}>; rel="first"`;
  }
  if (page > 1) {
    if (link.length > 0) {
      link += ',';
    }
    query.page = page - 1;
    link += `<${baseURL}${querystring.stringify(query)}>; rel="prev"`;
  }
  const headers = {
    'X-Total-Count': total,
    Link: link,
  };
  res.set(headers);
};
