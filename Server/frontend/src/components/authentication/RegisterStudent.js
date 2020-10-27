import '@material/react-text-field/dist/text-field.css';
import '../../styles/login.css';
import '@material/react-button/dist/button.css';
import 'typeface-roboto';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Button from '@material/react-button';
import TextField, { Input } from '@material/react-text-field';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { registerStudent } from '../../actions/auth.js';
import { createMessage } from '../../actions/messages.js';


export class RegisterStudent extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    studentNumber: '',
    phoneNumber: '',
  };

  static propTypes = {
    registerStudent: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, password2, studentNumber, phoneNumber } = this.state;
    if (password === password2) {
      const newStudent = {
        firstName,
        lastName,
        email,
        password,
        password2,
        studentNumber,
        phoneNumber,
      };
      this.props.registerStudent(newStudent);
    } else this.props.createMessage({ passwordNotMatch: 'Podane hasła są różne' });
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { firstName, lastName, email, password, password2, studentNumber, phoneNumber } = this.state;
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login-container">
        <div className="box-container">
          <Typography variant="h4" gutterBottom>
            Rejestracja studenta
          </Typography>
          <form onSubmit={this.onSubmit}>
            <TextField className="firstName" label="Imię:">
              <Input
                type="text"
                name="firstName"
                onChange={this.onChange}
                value={firstName}
              />
            </TextField>
            <TextField className="lastName" label="Nazwisko:">
              <Input
                type="text"
                name="lastName"
                onChange={this.onChange}
                value={lastName}
              />
            </TextField>
            <TextField className="mail" label="Adres e-mail:">
              <Input
                type="text"
                name="email"
                onChange={this.onChange}
                value={email}
              />
            </TextField>
            <TextField className="password" label="Hasło:">
              <Input
                type="password"
                name="password"
                onChange={this.onChange}
                value={password}
              />
            </TextField>
            <TextField className="password" label="Powtórz hasło:">
              <Input
                type="password"
                name="password2"
                onChange={this.onChange}
                value={password2}
              />
            </TextField>
            <TextField className="studentNumber" label="Numer indeksu:">
              <Input
                type="text"
                name="studentNumber"
                onChange={this.onChange}
                value={studentNumber}
              />
            </TextField>
            <TextField className="phoneNumber" label="Numer telefonu:">
              <Input
                type="text"
                name="phoneNumber"
                onChange={this.onChange}
                value={phoneNumber}
              />
            </TextField>
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

export default connect(mapStateToProps, { registerStudent, createMessage })(RegisterStudent);
