const config = require('../config/config');

class APIClient {
  constructor() {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.defaultHeaders = config.headers;
  }

  _buildURL(endpoint, params = {}) {
    const url = new URL(endpoint, this.baseURL);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  }

  _getHeaders(additionalHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...additionalHeaders };
    
    if (process.env.API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.API_KEY}`;
    }
    
    return headers;
  }

  async _request(endpoint, options = {}) {
    const url = options.params 
      ? this._buildURL(endpoint, options.params)
      : `${this.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: this._getHeaders(options.headers),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        console.error(`API Error: ${response.status} - ${response.statusText}`);
        const error = new Error(`HTTP Error ${response.status}`);
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: data
        };
        throw error;
      }

      return {
        status: response.status,
        statusText: response.statusText,
        data: data,
        ok: response.ok,
        url: response.url
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        const timeoutError = new Error(`Request timeout after ${this.timeout}ms`);
        timeoutError.response = { status: 408, statusText: 'Request Timeout' };
        throw timeoutError;
      }
      
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    return await this._request(endpoint, {
      method: 'GET',
      params
    });
  }

  async post(endpoint, data = {}) {
    return await this._request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}) {
    return await this._request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint, data = {}) {
    return await this._request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return await this._request(endpoint, {
      method: 'DELETE'
    });
  }
}

module.exports = new APIClient();