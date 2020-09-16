import '../../styles/course-forms.css';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import { createMuiTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
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
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#42a5f5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f44336',
    },
  },
});


export class AddGroupsAndPlot extends Component {
  state = {
    firstGroupName: '',
  }

  continue = (e) => {
    e.preventDefault();

    const firstCourseGroup = { groupName: this.state.firstGroupName };
    this.props.values.courseGroups.unshift(firstCourseGroup);
    this.props.handleChange('courseGroups', this.props.values.courseGroups);
    this.props.handleChange('plotParts', this.props.values.plotParts);
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  mapAllGroups(groupsValues) {
    this.props.values.courseGroups = groupsValues;
  }

  mapAllParts(plotPartValues) {
    this.props.values.plotParts = plotPartValues;
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <React.Fragment>
          <CssBaseline />
          <Dialog
            open="true"
            fullWidth="true"
            maxWidth='sm'
          >
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
                      <div style={{ float: 'right' }}>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={this.continue}
                        >Dalej</Button>
                      </div>
                    </form>
                  </div>
                }
              </Form>
            </div>
          </Dialog>

        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default connect(null)(AddGroupsAndPlot);
