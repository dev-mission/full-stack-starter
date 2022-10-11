const _ = require('lodash');
const querystring = require('querystring');

module.exports.setPaginationHeaders = function setPaginationHeaders(req, res, page, pages, total) {
  const baseURL = `${process.env.BASE_URL}${req.baseUrl}${req.path}?`;
  const query = _.clone(req.query);
  let link = '';
  const pageNum = parseInt(page, 10);
  if (pageNum < pages - 1) {
    query.page = pageNum + 1;
    link += `<${baseURL}${querystring.stringify(query)}>; rel="next"`;
  }
  if (pageNum < pages - 2) {
    if (link.length > 0) {
      link += ',';
    }
    query.page = pages;
    link += `<${baseURL}${querystring.stringify(query)}>; rel="last"`;
  }
  if (pageNum > 2) {
    if (link.length > 0) {
      link += ',';
    }
    query.page = 1;
    link += `<${baseURL}${querystring.stringify(query)}>; rel="first"`;
  }
  if (pageNum > 1) {
    if (link.length > 0) {
      link += ',';
    }
    query.page = pageNum - 1;
    link += `<${baseURL}${querystring.stringify(query)}>; rel="prev"`;
  }
  const headers = {
    'X-Total-Count': total,
    Link: link,
  };
  res.set(headers);
};
