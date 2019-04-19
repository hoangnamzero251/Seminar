module.exports = {

    attributes: {
        filename: {
          type: 'string',
          required: true
        },
        path: {
          type: 'string',
          required: true
        },
        filecode: {
          type: 'string'
        }
    },
    datastore: 'mongodb'
  };