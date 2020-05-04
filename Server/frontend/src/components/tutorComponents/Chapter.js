import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getChapter, addAdventures } from "../../actions/course";
import { Form, Text, NestedForm } from "react-form";


const Adventure = ({ i }) => (
  <NestedForm field={["adventures", i]} key={`nested-adventures-${i}`}>
    <Form>
      {formApi => (
        <div>
          <h3>Rozdział</h3>
          <label htmlFor={`nested-adventures-first-${i}`}>Nazwa</label>
          <Text field="name" id={`nested-adventures-first-${i}`} />
          <label htmlFor={`nested-adventures-last-${i}`}>Opis zadania:</label>
          <Text field="task_description" id={`nested-adventures-last-${i}`} />
        </div>
      )}
    </Form>
  </NestedForm>
);

export class Chapter extends Component {  
  state = {
    adventures: [],
  };

  firstAdventure = {};

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    chapter: PropTypes.any,
  };

  componentDidMount() {
    this.props.getChapter(this.props.match.params.id);
  }

  mapAllAdventures(adventureValues) {
    if (adventureValues.length === 1) {
      this.firstAdventure = adventureValues[0];
    } else {
      this.state.adventures = adventureValues;
    }
  }

  onSubmit = (e) => {
    // e.preventDefault();
    this.state.adventures.pop();
    this.state.adventures.unshift(this.firstAdventure);

    const { adventures } = this.state;
    this.props.addAdventures(adventures, this.props.chapter.id);
    this.setState({
      adventures: [],
    });  
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      )
    }
    return (
      <div>
        <h3>Oglądasz szczegóły rozdziału "{this.props.chapter.name}"</h3>
        <h4>Dodaj przygody!</h4>

        <Form onSubmit={this.onSubmit}>
          {formApi => (
            <form onSubmit={formApi.submitForm} id="adventure-form">
                <div key={0}>
                  <Adventure i={0} />
                </div>
                {formApi.values.adventures &&
                  formApi.values.adventures.slice(1).map((f, i) => (
                    <div key={i}>
                      <Adventure i={i} />
                    </div>
                  ), this.mapAllAdventures(formApi.values.adventures))}
                <button
                  onClick={() =>
                    formApi.addValue("adventures", {
                      name: "",
                      task_description: "",
                    })}
                  type="button">Dodaj kolejną przygodę
                </button>
                <button type="submit">
                  Dodaj
                </button>
              </form>
            )}
        </Form>

        <NavLink to = "/">Powrót</NavLink>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  chapter: state.course.chapterDetailed,
});

export default connect(mapStateToProps, {getChapter, addAdventures})(Chapter);
