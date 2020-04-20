import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import TextField, { Input } from '@material/react-text-field';
import '@material/react-text-field/dist/text-field.css';
import '../../../style/login.css'
import '@material/react-button/dist/button.css';
import Button from '@material/react-button';


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
        <div>
          <h2>Login</h2>
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
            <p> Nie masz konta? </p>
            <p> Rejestracja prowadzącego:    
                <Link to="/register-tutor">Register</Link>
            </p>
            <p> Rejestracja studenta:    
                <Link to="/register-student">Register</Link>
            </p>
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
