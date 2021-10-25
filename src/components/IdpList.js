import { useQuery } from 'react-query';
import ky from 'ky';
import { useStripes } from '@folio/stripes/core';
import {
  Button,
  Loading,
} from '@folio/stripes/components';

const withoutToken = () => {
  const { locale = 'en', tenant, url } = useStripes().okapi;
  return ky.create({
    prefixUrl: url,
    hooks: {
      beforeRequest: [
        request => {
          request.headers.set('Accept-Language', locale);
          request.headers.set('X-Okapi-Tenant', tenant);
        }
      ]
    },
    retry: 0
  });
};


const IdpEntry = ({id, name, description}) => 
  <div key={ id } > 
    <h3>{name}</h3>
    <p>{description}</p>
    <Button>Use this IDP</Button>
  </div>
;

const IdpList = () => {
  const theKy = withoutToken();
  const {data: idpData, isFetching} =  useQuery('configured-idps',
    () => theKy("saml/metadata/idps-allowed").json());
  
 return <div>
  { isFetching === true ? <Loading size="xlarge" /> : idpData?.idps?.map( ( {displayName, ...idpProps} ) => <IdpEntry name={displayName} { ...idpProps } />) }
 </div>
}

export default IdpList;