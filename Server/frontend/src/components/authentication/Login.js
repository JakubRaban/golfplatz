import '@material/react-text-field/dist/text-field.css';
import '../../../style/login.css';
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

import { login } from '../../actions/auth.js';


export class Login extends Component {
  state = {
    email: '',
    password: '',
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password);
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    const { email, password } = this.state;
    return (
      <div className="login-container">
        <div className="box-container">
          <Typography variant="h4" gutterBottom>
            Logowanie
          </Typography>
          <form onSubmit={this.onSubmit}>
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

            <div className="button-container">
              <Button className="login-button" type="submit">
                Zaloguj się
              </Button>
            </div>
            <Typography> Nie masz konta? </Typography>

            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Typography color="textPrimary">Rejestracja studenta: </Typography>
              <Link to="/register-student">Zarejestruj się!</Link>
            </Breadcrumbs>

            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Typography color="textPrimary">Rejestracja prowadzącego:</Typography>
              <Link to="/register-tutor">Zarejestruj się!</Link>
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

export default connect(mapStateToProps, { login })(Login);
