import IdpSelection from './IdpSelection';

import {
  Route,
  Switch
} from 'react-router-dom';

export const paths = {
  SELECT_IDP: "/select-idp"
};

export const PublicRoutes = ({stripes}) => {
  
  return <Switch><Route path={paths.SELECT_IDP} component={IdpSelection} /></Switch>
};

export default PublicRoutes;