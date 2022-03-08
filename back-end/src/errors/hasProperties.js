/**
 * Express API "Bad Request" handler.
 */

function hasProperties(...properties) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    try {
      properties.forEach((prop) => {
    //console.log(data[prop])
        
        if (!data[prop]) {
          const error = new Error(`Oops! ${prop} is missing!`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasProperties;
