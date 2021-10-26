import { useState } from 'react';
import { useQuery } from 'react-query';
import ky from 'ky';
import { useStripes } from '@folio/stripes/core';
import {
  Button,
  Loading,
  SearchField,
  Highlighter,
} from '@folio/stripes/components';

import { debounce } from 'lodash';

import classes from '../styles/sso-idp-list.css';

const getOkapiKy = () => {
  const okapiToHeaderMap = {
    locale: 'Accept-Language',
    tenant: 'X-Okapi-Tenant',
    token: 'X-Okapi-Token'
  };
  
  const okapiProps = useStripes().okapi;
  return ky.create({
    prefixUrl: okapiProps.url,
    hooks: {
      beforeRequest: [
        request => {
          Object.keys(okapiToHeaderMap).forEach(okapiProp => {
            const headerValue = okapiProps?.[okapiProp];
            headerValue && request.headers.set(okapiToHeaderMap[okapiProp], okapiProps[okapiProp]);
          });
        }
      ]
    },
    retry: 0
  });
};

const IdpEntry = ({id, displayName, description, highlight}) =>
  <div key={ id } > 
    <h3><Highlighter searchWords={[highlight]} text={displayName} /></h3>
    <p><Highlighter searchWords={[highlight]} text={description} /></p>
    <Button>Use this IDP</Button>
  </div>
;

const FiltererableList = ({ term, results }) => (
  <div className={classes['idp-list-wrapper']  } >
    { results?.map( ( idpProps ) => <IdpEntry key={idpProps.id} highlight={term} { ...idpProps } />) }
  </div>
)

const IdpList = () => {
  
  // Do the fetch.
  const theKy = getOkapiKy();
  const [filterValue, setFilterValue] = useState('');
  
  const {data, isFetching} =  useQuery(['sso-idps', 'coonfigured-idps'],
    async () => {
      const results = await theKy("saml/metadata/idps-allowed").json();
      return results?.idps?.sort((a, b) => {
        const nameA = a?.displayName?.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.displayName?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
  );
  
  let idpData = data;
  if (filterValue.length) {
    const regex = new RegExp(filterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    idpData = idpData?.filter(o => {
      return ['displayName', 'description'].some((val) => o?.[val] && regex.test(o[val]));
    });
  }
  
  const updateKeyValue = debounce(( val ) => {
    setFilterValue( (val && typeof val === 'string' && val.length) ? val : '' );
  }, 800);
  
  return <>
    <SearchField
      onChange={ e => { updateKeyValue(e?.target?.value) } }
      onClear={ updateKeyValue }
      placeholder="Filter the list of IDPS"
    />
    {
      isFetching === true ? <Loading size="xlarge" /> :
      <FiltererableList
        term={ filterValue }
        results={idpData} />
    }</>
}

export default IdpList;
