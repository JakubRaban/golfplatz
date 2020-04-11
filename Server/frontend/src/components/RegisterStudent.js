import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerStudent } from '../actions/auth';
import { createMessage } from '../actions/messages';


export class RegisterStudent extends Component {
  state = {
    name: '',
    surname: '',
    email: '',
    password: '',
    password2: '',
    indexNumber: '',
    phoneNumber: '',
  };

  static propTypes = {
    registerStudent: PropTypes.func.isRequired,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { name, surname, email, password, password2, indexNumber, phoneNumber } = this.state;
    if (password !== password2) {
      this.props.createMessage({ passwordNotMatch: 'Podane hasła są różne' });
    } else {
      const newStudent = {
        name,
        surname,
        email,
        password,
        indexNumber,
        phoneNumber,
      };
      this.props.registerStudent(newStudent);
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { name, surname, email, password, password2, indexNumber, phoneNumber } = this.state;
    return (
      <div>
        <h2>Rejestracja studenta</h2>
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
            <label>Numer indeksu</label>
            <input
              type="indexNumber"
              name="indexNumber"
              onChange={this.onChange}
              value={indexNumber}
            />
          </div>
          <div>
            <label>Numer telefonu</label>
            <input
              type="phoneNumber"
              name="phoneNumber"
              onChange={this.onChange}
              value={phoneNumber}
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

export default connect(null, { registerStudent, createMessage })(RegisterStudent);
