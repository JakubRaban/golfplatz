import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Text, NestedForm } from "react-form";
import Popup from "reactjs-popup";


const Chapters = ({ i }) => (
  <NestedForm field={["chapters", i]} key={`nested-chapters-${i}`}>
    <Form>
      {formApi => (
        <div>
          <h3>Rozdział</h3>
          <label htmlFor={`nested-chapters-first-${i}`}>Nazwa</label>
          <Text field="name" id={`nested-chapters-first-${i}`} />
          <label htmlFor={`nested-chapters-last-${i}`}>Krótki opis</label>
          <Text field="description" id={`nested-chapters-last-${i}`} />
        </div>
      )}
    </Form>
  </NestedForm>
);

const PlotPart = ({ i }) => (
  <NestedForm field={["plotParts", i]} key={`nested-plot-part-${i}`}>
    <Form>
      {formApi => (
        <div>
          <h3>Część fabuły</h3>
          <label htmlFor={`nested-plot-part-first-${i}`}>Nazwa</label>
          <Text field="name" id={`nested-plot-part-first-${i}`} />
          <label htmlFor={`nested-plot-part-last-${i}`}>Krótki opis</label>
          <Text field="introduction" id={`nested-plot-part-last-${i}`} />
        </div>
      )}
    </Form>
  </NestedForm>
);

const CourseGroup = ({ i }) => (
  <NestedForm field={["courseGroups", i]} key={`nested-course-group-${i}`}>
    <Form>
      {formApi => (
        <div>
          <label htmlFor={`nested-course-group-first-${i}`}>Dzień i godzina zajęć</label>
          <Text field="groupName" id={`nested-course-group-first-${i}`} />
        </div>
      )}
    </Form>
  </NestedForm>
);

export class AddGroupsAndPlot extends Component {
  static propTypes = {
    user: PropTypes.any,
    isAuthenticated: PropTypes.bool,
  };

  continue = e => {
    e.preventDefault();

    this.props.values.courseGroups.pop();
    this.props.values.courseGroups.unshift(this.firstCourseGroup);
    this.props.handleChange('courseGroups', this.props.values.courseGroups);
    this.props.handleChange('plotParts', this.props.values.plotParts);
    this.props.handleChange('chapters', this.props.values.chapters);
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  firstCourseGroup = {};
  firstChapter = {};
  otherChapters = [];

  mapAllGroups(groupsValues) {
    if (groupsValues.length === 1) {
      this.firstCourseGroup = groupsValues[0];
    } else {
      this.props.values.courseGroups = groupsValues;
    }
  }

  mapAllParts(plotPartValues) {
    this.props.values.plotParts = plotPartValues;
  }

  mapAllChapters(chapterValues) {
    if (chapterValues.length === 1) {
      this.firstChapter = chapterValues[0];
    } else {
      this.otherChapters = chapterValues;
    }
  }

  updateChapter(id) {
    this.otherChapters.pop();
    this.otherChapters.unshift(this.firstChapter);
    
    this.props.values.chapters[id] = this.otherChapters;

    this.firstChapter = {};
    this.otherChapters = [];
  }

  render() {
    return(
      <div>
        <Form onSubmit={this.onSubmit}>
        {formApi => (
          <div>
            <form onSubmit={formApi.submitForm} id="course-group-form">
              <div key={0}>
                <CourseGroup i={0} />
              </div>
              {formApi.values.courseGroups &&
                formApi.values.courseGroups.slice(1).map((f, i) => (
                  <div key={i}>
                    <CourseGroup i={i} />
                  </div>
                ), this.mapAllGroups(formApi.values.courseGroups))}
              <button
                onClick={() =>
                  formApi.addValue("courseGroups", {
                    groupName: "",
                  })}
                type="button">Dodaj kolejny termin zajęć</button>
            </form>
            <form onSubmit={formApi.submitForm} id="plot-form">
                {formApi.values.plotParts &&
                  formApi.values.plotParts.map((f, i) => (
                    <div key={i}>
                      <PlotPart i={i} />
                      <Popup trigger={<button> Dodaj rozdział </button>} position="right center">
                        {close => (  
                        <Form onSubmit={this.onSubmit}>
                          {formApi => (
                          <form onSubmit={formApi.submitForm} id="chapters">
                            <div key={0}>
                              <Chapters i={0} />
                            </div>
                            {formApi.values.chapters &&
                              formApi.values.chapters.slice(1).map((f, j) => (
                                <div key={j}>
                                  <Chapters i={j} />
                                </div>
                              ), this.mapAllChapters(formApi.values.chapters))}
                            <button
                              onClick={() =>
                                formApi.addValue("chapters", {
                                  name: "",
                                  description: "",
                                })}
                              type="button">Dodaj kolejny rozdział</button>
                            <button type="button" onClick={() => {
                              this.updateChapter(i);
                              close();
                            }}>Dalej
                            </button>
                          </form>
                          )}
                        </Form>
                        )}
                      </Popup>
                    </div>
                    
                  ), this.mapAllParts(formApi.values.plotParts))}
                <button
                  onClick={() =>
                    formApi.addValue("plotParts", {
                      name: "",
                      introduction: ""
                    })}
                  type="button">Dodaj część fabuły</button>        

              <button onClick={this.continue}>
                Dalej
              </button>
            </form>        
          </div>
        )}
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(AddGroupsAndPlot);