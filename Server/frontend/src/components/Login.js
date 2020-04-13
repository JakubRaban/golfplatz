import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

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
      return <Redirect to="/courses" />;
    }
    const { email, password } = this.state;
    return (
      <div>
        <div>
          <h2>Login</h2>
          <form onSubmit={this.onSubmit}>
            <div>
              <label>Adres e-mail:</label>
              <input
                type="text"
                name="email"
                onChange={this.onChange}
                value={email}
              />
            </div>

            <div>
              <label>Hasło:</label>
              <input
                type="password"
                name="password"
                onChange={this.onChange}
                value={password}
              />
            </div>

            <div>
              <button type="submit">
                Login
              </button>
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