// Auto-generated file created by next-modal-pages-loader
// Do not edit.
//
import dynamic from 'next/dynamic';

const PageRoutes = new Map();

// Detail/Type/Id
const DetailTypeId = dynamic(() =>
  import('../modalPages/pages/activity/detail/[type]/[id]')
);
PageRoutes.set(
  /(\/\/activity\/detail\/)([a-zA-Z0-9]+\/)([a-zA-Z0-9]+\/?)$/,
  <DetailTypeId />
);

// Activity
const Activity = dynamic(() => import('../modalPages/pages/activity/index'));
PageRoutes.set(/(\/\/activity\/?$)/, <Activity />);

// Home
const Home = dynamic(() => import('../modalPages/pages/home/index'));
PageRoutes.set(/(\/\/home\/?$)/, <Home />);

// Pages/Product/Type
const PagesProductType = dynamic(() =>
  import('../modalPages/pages/home/pages/[product]/[type]')
);
PageRoutes.set(
  /(\/\/home\/pages\/)([a-zA-Z0-9]+\/)([a-zA-Z0-9]+\/?)$/,
  <PagesProductType />
);

export default PageRoutes;
