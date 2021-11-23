import { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import ky from 'ky';
import { useStripes } from '@folio/stripes/core';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
  Row,
  Col,
  Headline,
  Label,
} from '@folio/stripes/components';
import { Field, Form } from 'react-final-form';
import {
  OrganizationLogo,
} from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import classes from '../../styles/sso-login.css';
import { SvgSSO, IdpList } from '../../components';
import debounce from 'lodash/debounce';

const getOkapiKy = (conf = {}) => {
  const okapiToHeaderMap = {
    locale: 'Accept-Language',
    tenant: 'X-Okapi-Tenant',
    token: 'X-Okapi-Token'
  };
  
  const okapiProps = useStripes().okapi;
  return ky.create(Object.assign ({
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
  }, conf));
};

const SelfSubmittingForm = (props) => {
  
  // Grab the form ref
  const formRef = useRef(null);
  const {action, method, children} = props;
  
  // Once rendered the form will submit if the necessary info is present.
  useEffect(() => {
    
    if (formRef?.current && action && method) {
      
      const form = formRef.current;
      if (typeof form.submit === 'function') {
        form.submit();
      } else {
        form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: false}));
      }
    }
  }, [formRef?.current, action, method, children]);
  return <form ref={formRef} {...props} />;
};

const IdpSelection = () => {
  
  // Ky Instance
  const theKy = getOkapiKy();
  const { tenant } = useStripes().okapi;
  
  const [ssoPostSelection, setSsoPostSelection] = useState();
  const [filterValue, setFilterValue] = useState('');
  
  const {data, isFetching} = useQuery(['sso-idps', 'coonfigured-idps'],
    async () => {
      try {
        const results = await theKy("saml/metadata/idps-allowed").json();
        return results?.idps?.sort((a, b) => {
          // Case insensitive, and treat null and empty string as equal.
          const nameA = a?.displayName?.toUpperCase() ?? '';
          const nameB = b?.displayName?.toUpperCase() ?? '';
          
          return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0)
        });
        
      } catch (error) {
        if (error.name !== 'HTTPError') {
          // Rethrow...
          throw error;
        }
        return [];
      }
    }
  );
  
  // Make sure any hooks have all been declared before any return statements.
  // We want to short circuite as early as possible but we have to render hooks first.
  if (typeof ssoPostSelection !== 'undefined') {
    
    const {location, bindingMethod, relayState, samlRequest} = ssoPostSelection; 
    
    // Self submitting form.
    return (<SelfSubmittingForm action={location} method={bindingMethod} >
      <input type='hidden' name='RelayState' value={relayState} />
      <input type='hidden' name='SAMLRequest' value={samlRequest} />
    </SelfSubmittingForm>);
  }
      
  const onIdpSelection = async ( entityId ) => {  
    const stripesUrl = (window.location.origin || `${window.location.protocol}//${window.location.host}`) + window.location.pathname;
    // the /_/invoke/... URL is used for systems that make call-backs
    // to okapi and don't handle setting of the tenant in the HTTP header.
    // i.e. ordinarily, we'd just call ${okapiUrl}/saml/login.
    // https://s3.amazonaws.com/foliodocs/api/okapi/p/okapi.html#invoke_tenant__id_
    
    // Important that this is used as OKAPI adds a * cors header for none invoke based endpoints.
    // Not ideal but the only place apps are given control over their headers is when using this endpoint.
    const config = await theKy.post(`_/invoke/tenant/${tenant}/saml/login?entityID=${entityId}`, {json: { stripesUrl }}).json();
    if (config.bindingMethod !== 'POST') {
      // Assume Get and navigate the browser.
      window.open(config.location, '_self');
      return
    }
    
    // Else update the state.
    setSsoPostSelection(config);
  };
  
  let idpData = data;
  if (filterValue.length) {
    const regex = new RegExp(filterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    idpData = idpData?.filter(o => {
      return ['displayName', 'description'].some((val) => o?.[val] && regex.test(o[val]));
    });
  }
  
  const debouncedUpdate = debounce(( val ) => {
    setFilterValue( (val && typeof val === 'string' && val.length) ? val : '' );
  }, 800)
  
  const updateKeyValue = ( val ) => {
    debouncedUpdate( (val && typeof val === 'string' && val.length) ? val : '' );
  };
  
  return (<div className={classes.wrapper} >
      <Form
        onSubmit={() => {}}
        subscription={{ values: true }}
        render={({ form, submitting, handleSubmit, submitSucceeded, values }) => {
          const { username } = values;
          const submissionStatus = submitting || submitSucceeded;
          const buttonDisabled = submissionStatus || !(username);
          const buttonLabel = submissionStatus ? 'loggingIn' : 'login';
          
          return <div className={classes.container} >
            <Row center="xs" className={ classes['sso-form-main-row'] } >
              <Col xs={12} md={10} lg={6} className={ classes['form-column'] } >
                <div>
                  <OrganizationLogo />
                  <form
                    className={classes.form}
                    onSubmit={data => handleSubmit(data).then(() => form.change('password', undefined))}
                  >
                    <div data-test-new-username-field>
                      <Row center="xs">
                        <Col xs={6}>
                          <Row
                            between="xs"
                            bottom="xs"
                          >
                            <Col xs={3}>
                              <Label htmlFor="input-username">
                                <FormattedMessage id="stripes-core.username" />
                              </Label>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row center="xs">
                        <Col xs={6}>
                          <Field
                            id="input-username"
                            name="username"
                            type="text"
                            component={TextField}
                            inputClass={classes.input}
                            autoComplete="username"
                            autoCapitalize="none"
                            validationEnabled={false}
                            hasClearIcon={false}
                            marginBottom0
                            fullWidth
                            autoFocus
                          />
                        </Col>
                      </Row>
                    </div>
                    <div data-test-new-username-field>
                      <Row center="xs">
                        <Col xs={6}>
                          <Row
                            between="xs"
                            bottom="xs"
                          >
                            <Col xs={3}>
                              <Label htmlFor="input-password">
                                <FormattedMessage id="stripes-core.password" />
                              </Label>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row center="xs">
                        <Col xs={6}>
                          <Field
                            id="input-password"
                            component={TextField}
                            name="password"
                            type="password"
                            value=""
                            marginBottom0
                            fullWidth
                            validationEnabled={false}
                            hasClearIcon={false}
                            autoComplete="current-password"
                            inputClass={classes.input}
                          />
                        </Col>
                      </Row>
                    </div>
                    <Row center="xs">
                      <Col xs={6} >
                        <div className={classes.formGroup} >
                          <Button
                            buttonStyle="primary"
                            id="clickable-login"
                            type="submit"
                            buttonClass={classes.submitButton}
                            fullWidth
                            marginBottom0
                            disabled={buttonDisabled}
                          >
                            <FormattedMessage id={`stripes-core.${buttonLabel}`} />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    <Row
                      className={classes.linksWrapper}
                      center="xs"
                    >
                      <Col xs={6}>
                        <Row between="xs">
                          <Col
                            xs={12}
                            sm={6}
                            md={12}
                            lg={5}
                            data-test-new-forgot-password-link
                          >
                            <Button
                              to="/forgot-password"
                              type="button"
                              buttonStyle="link"
                              buttonClass={classes.link}
                            >
                              <FormattedMessage id="stripes-core.button.forgotPassword" />
                            </Button>
                          </Col>
                          <Col
                            xs={12}
                            sm={5}
                            md={12}
                            lg={5}
                            data-test-new-forgot-username-link
                          >
                            <Button
                              to="/forgot-username"
                              type="button"
                              buttonStyle="link"
                              buttonClass={classes.link}
                            >
                              <FormattedMessage id="stripes-core.button.forgotUsername" />
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Col>
              
              <Col xs={12} md={10} lg={6} className={ classNames(classes['form-column'], classes['form-column-sso']) } >
                <Row center="xs">
                  <Col xs={6} >
                    <SvgSSO width="200px" colorStart="#e98d27" colorEnd="#ba3710" />
                    <Headline
                      size="xx-large"
                      tag="h2"
                      data-test-h2
                    >
                      <FormattedMessage id="stripes-core.loginViaSSO" />
                    </Headline>
                 </Col>
               </Row>
               <Row center="xs">
                  <Col xs={10} >
                    <IdpList data={idpData} onFilterChange={ updateKeyValue } onClear={ setFilterValue } loading={ isFetching } onSelect={onIdpSelection} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        }}
      />
    </div>
  );
}
export default IdpSelection;
