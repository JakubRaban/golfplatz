import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {registerStudent} from '../actions/auth';
import {createMessage} from '../actions/messages';
import { Redirect } from 'react-router-dom';


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
      return <Redirect to="/courses" />;
    }
    return (
      <div>
        <h2>Rejestracja studenta</h2>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>Imię</label>
            <input
              type="text"
              name="firstName"
              onChange={this.onChange}
              value={firstName}
            />
          </div>
          <div>
            <label>Nazwisko</label>
            <input
              type="text"
              name="lastName"
              onChange={this.onChange}
              value={lastName}
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
              name="password2"
              onChange={this.onChange}
              value={password2}
            />
          </div>
          <div>
            <label>Numer indeksu</label>
            <input
              type="text"
              name="studentNumber"
              onChange={this.onChange}
              value={studentNumber}
            />
          </div>
          <div>
            <label>Numer telefonu</label>
            <input
              type="text"
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

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {registerStudent, createMessage})(RegisterStudent);
