const fs = require('fs');
const path = require('path');

const {
  ensureFileDirectoryExists,
  getPageData,
  getRelativePath,
} = require('../utils/pathHelper');
const { encoding } = require('../constants');

function getPageStructure(fromDir, files) {
  return files
    .map(file => ({
      ...getPageData(file, fromDir),
    }))
    .concat()
    .sort();
}

const formatter = (files, frms, separator) => {
  const formatted = files.map(file => frms(file));

  return formatted.join(separator);
};

const template = (files, loaderDir) =>
  `// Auto-generated file created by next-modal-pages-loader
// Do not edit.
//
import dynamic from 'next/dynamic';
${loaderDir && `import Loader from '${loaderDir}';`}

const PageRoutes = new Map();
${formatter(
  files,
  ({ url, relativePath, componentName, isDynamic }) =>
    `
// ${componentName
      .split(/([A-Z][^A-Z]+)/)
      .filter(Boolean)
      .slice(-3)
      .join(`/`)}

PageRoutes.set(function(url) {
  ${isDynamic ? `return ${url}.exec(url)` : `return url === ${url}`}
}, dynamic(() => import('${relativePath}')${
      loaderDir ? `, { loading: () => <Loader /> }` : ''
    }));`,
  '\n'
)}


/**
 * Evaluates a given path with the RegEx to find a component
 *
 * @param {String} path - Url to be evaluated
 */

function getPageComponent(path) {
  let component = null;
  for (const [re, val] of PageRoutes.entries()) {
    if(re(path)) {
      component = val
      break;
    }
  }
  return component;
}

export default PageRoutes;
export { getPageComponent };
`;

const writeFile = (files, outputFile, loaderDir) => {
  const pages = getPageStructure(path.dirname(outputFile), files).map(file => ({
    ...file,
    relativePath: file.relativePath.substring(
      0,
      file.relativePath.lastIndexOf('.')
    ),
  })); // strip file extensions

  const loaderFile = loaderDir
    ? getRelativePath(loaderDir, path.dirname(outputFile))
    : '';

  const output = template(
    pages,
    loaderFile.substring(0, loaderFile.lastIndexOf('.'))
  );

  ensureFileDirectoryExists(outputFile);

  fs.writeFileSync(outputFile, output, { encoding });
};

module.exports = {
  writeFile,
};
