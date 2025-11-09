const fs = require('fs');
const path = require('path');

/**
 * Load a single schema JSON file
 * @param {string} filePath - Path to the schema JSON file
 * @returns {object} - Parsed schema object
 */
function loadSchema(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const schema = JSON.parse(fileContent);
    return schema;
  } catch (error) {
    console.error(`Error loading schema from ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Load all schema files from a directory
 * @param {string} dirPath - Path to directory containing schema files
 * @returns {object} - Object with schema name as key and schema as value
 */
function loadAllSchemas(dirPath = './schemas') {
  try {
    const absolutePath = path.resolve(dirPath);
    const files = fs.readdirSync(absolutePath);
    const schemas = {};

    files.forEach(file => {
      if (path.extname(file) === '.json') {
        const schemaName = path.basename(file, '.json');
        const filePath = path.join(absolutePath, file);
        schemas[schemaName] = loadSchema(filePath);
      }
    });

    return schemas;
  } catch (error) {
    console.error(`Error loading schemas from directory ${dirPath}:`, error.message);
    throw error;
  }
}

/**
 * Load schema synchronously (for use in test setup)
 * @param {string} filePath - Path to the schema JSON file
 * @returns {object} - Parsed schema object
 */
function loadSchemaSync(filePath) {
  return loadSchema(filePath);
}

/**
 * Load schema asynchronously
 * @param {string} filePath - Path to the schema JSON file
 * @returns {Promise<object>} - Promise that resolves to parsed schema
 */
async function loadSchemaAsync(filePath) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(filePath);
    
    fs.readFile(absolutePath, 'utf8', (error, data) => {
      if (error) {
        console.error(`Error loading schema from ${filePath}:`, error.message);
        reject(error);
      } else {
        try {
          const schema = JSON.parse(data);
          resolve(schema);
        } catch (parseError) {
          console.error(`Error parsing JSON from ${filePath}:`, parseError.message);
          reject(parseError);
        }
      }
    });
  });
}

/**
 * Get schema by path notation (e.g., "user.address")
 * @param {object} schemas - Schema object
 * @param {string} schemaPath - Dot notation path to schema
 * @returns {object} - Schema at the specified path
 */
function getSchemaByPath(schemas, schemaPath) {
  const keys = schemaPath.split('.');
  let schema = schemas;
  
  for (const key of keys) {
    if (schema && typeof schema === 'object' && key in schema) {
      schema = schema[key];
    } else {
      throw new Error(`Schema path '${schemaPath}' not found`);
    }
  }
  
  return schema;
}

/**
 * Validate that schema file exists
 * @param {string} filePath - Path to check
 * @returns {boolean} - True if file exists
 */
function schemaExists(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    return fs.existsSync(absolutePath);
  } catch (error) {
    return false;
  }
}

module.exports = {
  loadSchema,
  loadSchemaSync,
  loadSchemaAsync,
  loadAllSchemas,
  getSchemaByPath,
  schemaExists
};