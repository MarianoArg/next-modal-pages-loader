// Auto-generated file created by next-modal-pages-loader
// Do not edit.
//
import dynamic from 'next/dynamic';

const PageRoutes = new Map();

// Test

PageRoutes.set(
  function(url) {
    return /(^\/?[a-zA-Z0-9]+\/?)$/.exec(url);
  },
  dynamic(() => import('../modalPages/pages/[test]'))
);

// Detail/Type/Id

PageRoutes.set(
  function(url) {
    return /(^\/?activity\/detail\/)([a-zA-Z0-9]+\/)([a-zA-Z0-9]+\/?)$/.exec(
      url
    );
  },
  dynamic(() => import('../modalPages/pages/activity/detail/[type]/[id]'))
);

// Activity

PageRoutes.set(
  function(url) {
    url === '/activity';
  },
  dynamic(() => import('../modalPages/pages/activity/index'))
);

// Home

PageRoutes.set(
  function(url) {
    url === '/home';
  },
  dynamic(() => import('../modalPages/pages/home/index'))
);

// Pages/Product/Type

PageRoutes.set(
  function(url) {
    return /(^\/?home\/pages\/)([a-zA-Z0-9]+\/)([a-zA-Z0-9]+\/?)$/.exec(url);
  },
  dynamic(() => import('../modalPages/pages/home/pages/[product]/[type]'))
);

/**
 * Evaluates a given path with the RegEx to find a component
 *
 * @param {String} path - Url to be evaluated
 */

async function getPageComponent(path) {
  let component = null;
  for await (const [re, val] of PageRoutes.entries()) {
    if (re(path)) {
      component = val;
      break;
    }
  }
  return component;
}

export default PageRoutes;
export { getPageComponent };
