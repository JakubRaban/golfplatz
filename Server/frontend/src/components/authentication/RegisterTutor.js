import '@material/react-text-field/dist/text-field.css';
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

import { registerTutor } from '../../actions/auth.js';


export class RegisterTutor extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    errors: {},
  };

  static propTypes = {
    registerTutor: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  checkErrors = async () => {
    const errors = {}

    if (isEmpty(this.state.email)) errors.email = 'Podaj email';
    if (isEmpty(this.state.firstName)) errors.firstName = 'Podaj imię';
    if (isEmpty(this.state.lastName)) errors.lastName = 'Podaj nazwisko';
    if (isEmpty(this.state.password)) errors.password = 'Podaj hasło';
    if (isEmpty(this.state.password2)) errors.password2 = 'Powtórz hasło';
    if (this.state.password !== this.state.password2) errors.password2 = 'Podane hasła są różne';

    await this.setState({ errors });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    await this.checkErrors();

    if (empty(this.state.errors)) {  
      const { firstName, lastName, email, password, password2 } = this.state;
      const newTutor = {
        firstName,
        lastName,
        email,
        password,
      };
      this.props.registerTutor(newTutor);
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { firstName, lastName, email, password, password2, errors } = this.state;
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login-container">
        <div className="box-container">
          <Typography variant="h4" gutterBottom>
            Rejestracja prowadzącego
          </Typography>
          <form onSubmit={this.onSubmit}>
            <div className='firstName'>
              <TextField 
                error={errors.firstName}
                fullWidth
                helperText={errors.firstName || ''}
                label='Imię:'
                name='firstName'
                onChange={this.onChange}
                type='text'
                value={firstName}
                variant='filled'
              />
            </div>
            <div className='lastName'>
              <TextField 
                error={errors.lastName}
                fullWidth
                helperText={errors.lastName || ''}
                label='Nazwisko:'
                name='lastName'
                onChange={this.onChange}
                type='text'
                value={lastName}
                variant='filled'
              />
            </div>
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
            <div className='password'>
              <TextField
                error={errors.password2}
                fullWidth
                helperText={errors.password2 || ''}
                label='Powtórz hasło:'
                name='password2'
                onChange={this.onChange}
                type='password'
                value={password2}
                variant='filled'
              />
            </div>
            <div className="button-container">
              <Button className="login-button" type="submit">
                Zarejestruj się
              </Button>
            </div>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Typography color="textPrimary">Masz już konto? </Typography>
              <Link to="/login">Zaloguj się!</Link>
            </Breadcrumbs>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { registerTutor })(RegisterTutor);
