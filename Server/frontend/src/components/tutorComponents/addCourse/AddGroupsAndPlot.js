import '../../../styles/course-forms.css';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import { Form, NestedForm, Text } from 'react-form';
import { connect } from 'react-redux';


const PlotPart = ({ i }) =>
  <NestedForm field={['plotParts', i]} key={`nested-plot-part-${i}`}>
    <Form>
      {(formApi) =>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            {i + 1} część fabuły.
          </Typography>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-plot-part-first-${i}`}>Nazwa:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="name" id={`nested-plot-part-first-${i}`} />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-plot-part-last-${i}`}>Krótki opis:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="introduction" id={`nested-plot-part-last-${i}`} />
            </div>
          </div>
        </div>
      }
    </Form>
  </NestedForm>;
const CourseGroup = ({ i }) =>
  <NestedForm field={['courseGroups', i]} key={`nested-course-group-${i}`}>
    <Form>
      {(formApi) =>
        <div className="row">
          <div className="col-25">
            <label className="label-class" htmlFor={`nested-course-group-first-${i}`}>Dzień i godzina zajęć: </label>
          </div>
          <div className="col-75">
            <Text className="input-class" field="groupName" id={`nested-course-group-first-${i}`} />
          </div>
        </div>
      }
    </Form>
  </NestedForm>;


export class AddGroupsAndPlot extends Component {
  state = {
    firstGroupName: '',
  }
// do wyrzucenia

  submit = () => {
    const firstCourseGroup = { groupName: this.state.firstGroupName };
    this.props.values.courseGroups.unshift(firstCourseGroup);
    this.props.handleChange('courseGroups', this.props.values.courseGroups);
    this.props.handleChange('plotParts', this.props.values.plotParts);
  };

  mapAllGroups(groupsValues) {
    this.props.values.courseGroups = groupsValues;
  }

  mapAllParts(plotPartValues) {
    this.props.values.plotParts = plotPartValues;
  }
// dotąd, przynajmniej dotąd 

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <div style={{ margin: '10px' }}>

          <Form onSubmit={this.onSubmit}>
            {(formApi) =>
              <div>
                <form onSubmit={formApi.submitForm} id="course-group-form">
                  <Typography variant="h6" gutterBottom>
                Napisz kiedy odbywają się zajęcia
                  </Typography>
                  <div key={0}>
                    <div className="row">
                      <div className="col-25">
                        <label className="label-class">Dzień i godzina zajęć: </label>
                      </div>
                      <div className="col-75">
                        <input className="input-class" field="groupName"
                          value={this.state.firstGroupName}
                          onChange={(e) => this.setState({ firstGroupName: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  {formApi.values.courseGroups &&
                formApi.values.courseGroups.map((f, i) =>
                  <div key={i}>
                    <CourseGroup i={i} />
                  </div>
                , this.mapAllGroups(formApi.values.courseGroups))}
                  <Button
                    color="secondary"
                    variant='outlined'
                    onClick={() =>
                      formApi.addValue('courseGroups', {
                        groupName: '',
                      })}
                  >Dodaj kolejny termin zajęć</Button>
                </form>
                <form onSubmit={formApi.submitForm} id="plot-form">
                  <Typography variant="h6" gutterBottom>
                Dodaj części fabuły do kursu
                  </Typography>
                  {formApi.values.plotParts &&
                  formApi.values.plotParts.map((f, i) =>
                    <div key={i}>
                      <PlotPart i={i} />
                    </div>
                  , this.mapAllParts(formApi.values.plotParts))}
                  <Button
                    color="secondary"
                    variant='outlined'
                    onClick={() =>
                      formApi.addValue('plotParts', {
                        name: '',
                        introduction: '',
                      })}
                  >Dodaj część fabuły</Button>
                </form>
              </div>
            }
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null)(AddGroupsAndPlot);
