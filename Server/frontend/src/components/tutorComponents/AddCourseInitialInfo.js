import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import "../../styles/course-forms.css";


const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: green,
  },
});

export class AddCourseInitialInfo extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, handleChange } = this.props;

    return(
      <MuiThemeProvider theme={theme}>
        <CssBaseline/>
        <React.Fragment>
        <Dialog 
            open="true"
            fullWidth="true"
            maxWidth='sm'
          >
          <div style={{margin: "10px"}}>
            <Typography variant="h6" gutterBottom>
              Wprowadź podstawowe informacje o kursie:      
            </Typography>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Podaj nazwę kursu:</label>
              </div>
              <div className="col-75">
                <input className="input-class" value={values.name} type="text"
                  name="name" onChange={handleChange('name')}/>
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Krótko opisz kurs:</label>
              </div>
              <div className="col-75">
                <textarea className="input-class" value={values.description} type="text"
                  name="description" onChange={handleChange('description')}/>
              </div>
            </div>
            <div style={{float: 'right'}}>
              <Button
                color="primary"
                variant="contained"
                onClick={this.continue}
              >Dalej</Button>
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    </MuiThemeProvider>
    )
  }
}

export default connect(null)(AddCourseInitialInfo);