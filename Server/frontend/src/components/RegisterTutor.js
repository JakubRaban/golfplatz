import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerTutor } from '../actions/auth';
import { createMessage } from '../actions/messages';

export class RegisterTutor extends Component {
  state = {
    name: '',
    surname: '',
    email: '',
    password: '',
    password2: '',
  };

  static propTypes = {
    registerTutor: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { name, surname, email, password, password2 } = this.state;
    if (password !== password2) {
      this.props.createMessage({ passwordNotMatch: 'Podane hasła są różne' });
    } else {
      const newTutor = {
        name,
        surname,
        email,
        password,
      };
      this.props.registerTutor(newTutor);
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { name, surname, email, password, password2 } = this.state;
    if (this.props.isAuthenticated) {
      return <Redirect to="/courses" />;
    }
    return (
      <div>
        <h2>Rejestracja prowadzącego</h2>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>Imię</label>
            <input
              type="name"
              name="name"
              onChange={this.onChange}
              value={name}
            />
          </div>
          <div>
            <label>Nazwisko</label>
            <input
              type="surname"
              name="surname"
              onChange={this.onChange}
              value={surname}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={this.onChange}
              value={email}
            />
          </div>
          <div className="form-group">
            <label>Hasło</label>
            <input
              type="password"
              name="password"
              onChange={this.onChange}
              value={password}
            />
          </div>
          <div>
            <label>Powtórz hasło</label>
            <input
              type="password"
              name="password_confirm"
              onChange={this.onChange}
              value={password2}
            />
          </div>
          <div>
            <button type="submit">
              Zarejestruj się
            </button>
          </div>
          {/* <p>
            Masz już konto? <Link to="/login">Login</Link>
          </p> */}
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { registerTutor, createMessage })(RegisterTutor);
