import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import Dialog from '@material-ui/core/Dialog';
import TextField, { Input } from '@material/react-text-field';
import Button from '@material-ui/core/Button';


const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: green,
  },
});

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
      <MuiThemeProvider theme={theme}>
        <React.Fragment>
        <Dialog 
            open="true"
            fullWidth="true"
            maxWidth='sm'
          >
          <h2>Wprowadź podstawowe informacje o kursie:</h2>    
          <TextField label = "Podaj nazwę kursu" margin="normal"W>
            <Input
              type="text"
              name="name"
              onChange={handleChange('name')}
              value={values.name}
              />
          </TextField>
          <TextField label = "Krótko opisz kurs" margin="normal"W>
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

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(AddCourseInitialInfo);