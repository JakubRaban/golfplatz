import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {registerStudent} from '../../actions/auth';
import {createMessage} from '../../actions/messages';
import { Link, Redirect } from 'react-router-dom';
import TextField, { Input } from '@material/react-text-field';
import '@material/react-text-field/dist/text-field.css';
import '../../../style/login.css'
import '@material/react-button/dist/button.css';
import Button from '@material/react-button';
import 'typeface-roboto';
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';


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
    const {firstName, lastName, email, password, password2, studentNumber, phoneNumber} = this.state;
    if (password !== password2) {
      this.props.createMessage({passwordNotMatch: 'Podane hasła są różne'});
    } else {
      const newStudent = {
        firstName,
        lastName,
        email,
        password,
        password2,
        studentNumber,
        phoneNumber
      };
      this.props.registerStudent(newStudent);
    }
  };

  onChange = (e) => this.setState({[e.target.name]: e.target.value});

  render() {
    const {firstName, lastName, email, password, password2, studentNumber, phoneNumber} = this.state;
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

export default connect(mapStateToProps, {registerStudent, createMessage})(RegisterStudent);
