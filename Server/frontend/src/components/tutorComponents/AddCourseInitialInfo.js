import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


export class AddCourseInitialInfo extends Component {
  static propTypes = {
    user: PropTypes.any,
    isAuthenticated: PropTypes.bool,
  };

  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, handleChange } = this.props;
    return(
      <div>
        <div>
          <label>Podaj nazwę kursu</label>
          <input
            type="text"
            name="name"
            onChange={handleChange('name')}
            value={values.name}
          />
        </div>
        <div>
          <label>Krótko opisz kurs</label>
          <textarea
            type="text"
            name="description"
            onChange={handleChange('description')}
            value={values.description}
          />
        </div>
        <button onClick={this.continue}>
          Dalej
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(AddCourseInitialInfo);