import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { Form, Text, NestedForm } from "react-form";
import Popup from "reactjs-popup";
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import "./styles/course-and-plots.css";


const Chapters = ({ i }) => (
  <NestedForm field={["chapters", i]} key={`nested-chapters-${i}`}>
    <Form>
      {formApi => (
        <div>
          <h3>Rozdział</h3>
          <label htmlFor={`nested-chapters-first-${i}`}>Nazwa:</label>
          <Text field="name" id={`nested-chapters-first-${i}`} />
          <label htmlFor={`nested-chapters-last-${i}`}>Krótki opis:</label>
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
          <Typography variant="subtitle2" gutterBottom>
            {i+1} część fabuły. 
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
      )}
    </Form>
  </NestedForm>
);

const CourseGroup = ({ i }) => (
  <NestedForm field={["courseGroups", i]} key={`nested-course-group-${i}`}>
    <Form>
      {formApi => (
        <div className="row">
          <div className="col-25">
            <label className="label-class" htmlFor={`nested-course-group-first-${i}`}>Dzień i godzina zajęć: </label>
          </div>
          <div className="col-75">
            <Text className="input-class" field="groupName" id={`nested-course-group-first-${i}`} />
          </div>
        </div>
      )}
    </Form>
  </NestedForm>
);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#42a5f5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f44336',
    }
  },
});


export class AddGroupsAndPlot extends Component {
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
      <MuiThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <Dialog 
            open="true"
            fullWidth="true"
            maxWidth='sm'
          >
          <div style={{margin: "10px"}}>

            <Form onSubmit={this.onSubmit}>
            {formApi => (
              <div>
                <form onSubmit={formApi.submitForm} id="course-group-form">
                  <Typography variant="h6" gutterBottom>
                    Napisz kiedy odbywają się zajęcia
                  </Typography>
                  <div key={0}>
                    <CourseGroup i={0} />
                  </div>
                  {formApi.values.courseGroups &&
                    formApi.values.courseGroups.slice(1).map((f, i) => (
                      <div key={i}>
                        <CourseGroup i={i} />
                      </div>
                    ), this.mapAllGroups(formApi.values.courseGroups))}
                  <Button
                      color="secondary"
                      variant='outlined'
                      onClick={() =>
                        formApi.addValue("courseGroups", {
                          groupName: "",
                        })}
                    >Dodaj kolejny termin zajęć</Button> 
                </form>
                <form onSubmit={formApi.submitForm} id="plot-form">
                  <Typography variant="h6" gutterBottom>
                    Dodaj części fabuły do kursu
                  </Typography>  
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
                    <Button
                      color="secondary"
                      variant='outlined'
                      onClick={() =>
                        formApi.addValue("plotParts", {
                          name: "",
                          introduction: ""
                        })}
                    >Dodaj część fabuły</Button>        
                  <div style={{float: 'right'}}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={this.continue}
                    >Dalej</Button>
                  </div>
                </form>        
              </div>
            )}
            </Form>
          </div>
        </Dialog>

      </React.Fragment> 
      </MuiThemeProvider>
    )
  }
}

export default connect(null)(AddGroupsAndPlot);