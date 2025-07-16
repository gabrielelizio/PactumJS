// helpers/retryHelper.js

/**
 * Executa uma função assíncrona com retry.
 * @param {Function} fn - Função assíncrona que retorna um resultado ou lança erro.
 * @param {Object} options - { retries, delay, shouldRetry }
 * @returns {Promise<any>}
 */
async function retryAsync(fn, { retries = 5, delay = 2000, shouldRetry = () => true } = {}) {
  let lastResult;
  while (retries > 0) {
    lastResult = await fn();
    if (!shouldRetry(lastResult)) {
      return lastResult;
    }
    await new Promise(res => setTimeout(res, delay));
    retries--;
  }
  return lastResult;
}

module.exports = { retryAsync }; 