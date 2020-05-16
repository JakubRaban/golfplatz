import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import Dialog from '@material-ui/core/Dialog';
import TextField, { Input } from '@material/react-text-field';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';


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
          <Typography variant="h6" gutterBottom>
            Wprowadź podstawowe informacje o kursie:      
          </Typography>
          <TextField label="Podaj nazwę kursu" margin="normal">
            <Input
              type="text"
              name="name"
              onChange={handleChange('name')}
              value={values.name}
              />
          </TextField>
          <TextField label="Krótko opisz kurs" margin="normal">
            <Input
              type="text"
              name="description"
              onChange={handleChange('description')}
              value={values.description}
              />
          </TextField>
          <Button
              color="primary"
              variant="contained"
              onClick={this.continue}
            >Dalej</Button>
          </Dialog>
        </React.Fragment>
      </MuiThemeProvider>
    )
  }
}

export default connect(null)(AddCourseInitialInfo);