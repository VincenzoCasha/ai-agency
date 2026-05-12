'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const { withAdminErrors } = require('../utils/admin-errors');
const controller = require('../controllers/admin-products.controller');
const validators = require('../validators/admin-products.validator');
const storage = require('../services/storage.service');
const { createProblem } = require('../utils/problem');

const router = express.Router();

const upload = storage.buildProductImageUploader();

function multerSafe(req, res, next) {
  upload(req, res, (err) => {
    if (!err) return next();
    let status = 400;
    let code = err.code || 'UPLOAD_ERROR';
    let detail = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') { status = 413; code = 'FILE_TOO_LARGE'; }
    else if (err.code === 'INVALID_MIME' || err.code === 'INVALID_EXT') { status = 422; }
    const problem = createProblem({
      status,
      title: status === 413 ? 'Payload Too Large' : status === 422 ? 'Unprocessable Entity' : 'Bad Request',
      detail,
      instance: req.path,
      extra: { code },
    });
    res.status(status).type('application/problem+json').json(problem);
  });
}

router.get('/',
  validateRequest(validators.list),
  withAdminErrors(asyncHandler(controller.list)),
);

router.post('/',
  validateRequest(validators.create),
  withAdminErrors(asyncHandler(controller.create)),
);

router.get('/:id',
  validateRequest(validators.idParam),
  withAdminErrors(asyncHandler(controller.get)),
);

router.put('/:id',
  validateRequest(validators.update),
  withAdminErrors(asyncHandler(controller.update)),
);

router.patch('/:id/stock',
  validateRequest(validators.stockUpdate),
  withAdminErrors(asyncHandler(controller.patchStock)),
);

router.delete('/:id',
  validateRequest(validators.idParam),
  withAdminErrors(asyncHandler(controller.softDelete)),
);

router.post('/:id/images',
  validateRequest(validators.idParam),
  multerSafe,
  withAdminErrors(asyncHandler(controller.uploadImage)),
);

router.delete('/:id/images/:image_id',
  validateRequest({
    params: {
      id: { type: 'integer', required: true, min: 1 },
      image_id: { type: 'integer', required: true, min: 1 },
    },
  }),
  withAdminErrors(asyncHandler(controller.deleteImage)),
);

module.exports = router;
