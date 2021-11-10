import { useState } from 'react';
import {
  Button,
  Loading,
  SearchField,
  Highlighter,
} from '@folio/stripes/components';

import classes from '../styles/sso-idp-list.css';

const IdpEntry = ({id, displayName, description, highlight, onSelect}) =>
  <div key={ id } > 
    <h3><Highlighter searchWords={[highlight]} text={displayName} /></h3>
    <p><Highlighter searchWords={[highlight]} text={description} /></p>
    <Button onClick={ () => { onSelect(id); } } >Use this IDP</Button>
  </div>
;

const FiltererableList = ({ term, results, onSelect}) => (
  <div className={classes['idp-list-wrapper']  } >
    { results?.map( ( idpProps ) => <IdpEntry key={idpProps.id} highlight={term} { ...idpProps } onSelect={onSelect} />) }
  </div>
)

const IdpList = ({ data, onFilterChange, onClear, onSelect, loading = false }) => {
  
  const [filterValue, setFilterValue ] = useState( '' );
  
  return <>
    <SearchField
      onChange={ e => {
        const val = e?.target?.value ?? '';
        setFilterValue(val);
        onFilterChange(val); 
      }}
      onClear={ (...opts) => {
        const val = '';
        setFilterValue(val);
        onClear(opts); 
    }}
      placeholder="Filter the list of IDPS"
    />
    {
      loading === true ? <Loading size="xlarge" /> :
      <FiltererableList
        term={ filterValue }
        onSelect={ onSelect }
        results={ data } />
    }</>
}

export default IdpList;
