import '../../styles/login.css';
import '@material/react-button/dist/button.css';
import 'typeface-roboto';

import { Breadcrumbs, TextField, Typography } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Button from '@material/react-button';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { isEmpty as empty } from 'lodash';
import isEmpty from 'validator/lib/isEmpty.js';

import { login, isFresh } from '../../actions/auth.js';
import CircularProgress from "@material-ui/core/CircularProgress";
import FormErrorMessage from "../common/FormErrorMessage";


export class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {},
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  checkErrors = async () => {
    const errors = {}

    if (isEmpty(this.state.email)) errors.email = 'Podaj email';
    if (isEmpty(this.state.password)) errors.password = 'Podaj hasło';

    await this.setState({ errors });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    await this.checkErrors();

    if (empty(this.state.errors)) {
      this.props.login(this.state.email, this.state.password);
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  componentDidMount() {
    this.props.isFresh()
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }
    if (this.props.fresh) {
      return <Redirect to='/register-tutor' />;
    }
    if (this.props.fresh === undefined) {
      return <CircularProgress />
    }
    const { email, password, errors } = this.state;

    return (
      <div className='login-container'>
        <div className='box-container'>
          <Typography variant='h4' gutterBottom>
            Logowanie
          </Typography>
          <form onSubmit={this.onSubmit}>
            <div className='mail'>
              <TextField 
                error={errors.email}
                fullWidth
                helperText={errors.email || ''}
                label='Adres e-mail:'
                name='email'
                onChange={this.onChange}
                type='text'
                value={email}
                variant='filled'
              />
            </div>
            <div className='password'>
              <TextField
                error={errors.password}
                fullWidth
                helperText={errors.password || ''}
                label='Hasło:'
                name='password'
                onChange={this.onChange}
                type='password'
                value={password}
                variant='filled'
              />
            </div>
            <div className='button-container'>
              <Button className='login-button' type='submit'>
                Zaloguj się
              </Button>
            </div>
            {!empty(this.state.errors) && <FormErrorMessage style={{textAlign: 'right'}} />}
            <Typography> Nie masz konta? </Typography>

            <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} aria-label='breadcrumb'>
              <Typography color='textPrimary'>Rejestracja studenta: </Typography>
              <Link to='/register-student'>Zarejestruj się!</Link>
            </Breadcrumbs>

            <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} aria-label='breadcrumb'>
              <Typography color='textPrimary'>Rejestracja prowadzącego:</Typography>
              <Link to='/register-tutor'>Zarejestruj się!</Link>
            </Breadcrumbs>

          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  fresh: state.auth.isFresh,
});

export default connect(mapStateToProps, { login, isFresh })(Login);
