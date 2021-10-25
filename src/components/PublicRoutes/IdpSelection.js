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
import classes from '../../styles/sso-login.css';
import classNames from 'classnames';
import { SvgSSO, IdpList } from '../../components';

const IdpSelection = (props) =>
<div className={classes.wrapper} >
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
                      />
                    </Col>
                  </Row>
                </div>
                <Row center="xs">
                  <Col xs={6}>
                    <div >
                      <Button
                        buttonStyle="primary"
                        id="clickable-login"
                        type="submit"
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
                  center="xs"
                >
                  <Col xs={6}>
                    <Row between="xs">
                      <Col
                        xs={5}
                        data-test-new-forgot-password-link
                      >
                        <Button
                          to="/forgot-password"
                          type="button"
                          buttonStyle="link"
                        >
                          <FormattedMessage id="stripes-core.button.forgotPassword" />
                        </Button>
                      </Col>
                      <Col
                        xs={5}
                        data-test-new-forgot-username-link
                      >
                        <Button
                          to="/forgot-username"
                          type="button"
                          buttonStyle="link"
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
                <SvgSSO width="200px" color="#FF0000" />
                <Headline
                  size="xx-large"
                  tag="h1"
                  data-test-h1
                >
                  <FormattedMessage id="stripes-core.loginViaSSO" />
                </Headline>
             </Col>
           </Row>
           <Row center="xs">
              <Col xs={10} >
                <IdpList />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    }}
  />
</div>

export default IdpSelection;