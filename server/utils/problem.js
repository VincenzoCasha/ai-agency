'use strict';

/**
 * Creates an RFC 7807 problem detail object.
 * https://datatracker.ietf.org/doc/html/rfc7807
 */
function createProblem({ status, title, detail, instance, extra = {} }) {
  return {
    type: `https://crudo.es/errors/${status}`,
    title,
    status,
    detail,
    ...(instance ? { instance } : {}),
    ...extra,
  };
}

module.exports = { createProblem };
