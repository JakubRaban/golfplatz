import { List, ListItem, ListItemText } from '@material-ui/core/';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import blue from '@material-ui/core/colors/blue';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import { createMuiTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React, { Component } from 'react';
import { connect } from 'react-redux';


const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

export class AddCourseConfirm extends Component {
  state = {
    open: false,
    open2: false,
  }

  continue = (e) => {
    e.preventDefault();
    this.props.submit();
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  handleClick = () => {
    const assignHelper = this.state.open;
    this.setState({
      open: !assignHelper,
    });
  };

  handleClick2 = () => {
    const assignHelper = this.state.open2;
    this.setState({
      open2: !assignHelper,
    });
  };

  render() {
    const {
      values: { name, description, courseGroups, plotParts, chapters },
    } = this.props;
    console.log(chapters);
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
              <Typography variant="h6" gutterBottom>
              Potwierdź wprowadzone informacje
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Nazwa kursu" secondary={name} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Opis" secondary={description} />
                </ListItem>
                <ListItem button onClick={this.handleClick}>
                  <ListItemText primary="Terminy zajęć" />
                  {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {courseGroups.map((group, i) => {
                      return (
                        <ListItem key={i} style={{ paddingLeft: theme.spacing(4) }}>
                          <ListItemText primary="Termin" secondary={group.groupName} />
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
                <ListItem button onClick={this.handleClick2}>
                  <ListItemText primary="Części fabuły" />
                  {this.state.open2 ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open2} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {plotParts.map((plotPart, i) => {
                      return (
                        <React.Fragment key={i}>
                          <ListItem>
                            <ListItemText primary="Nazwa" secondary={plotPart.name} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Opis" secondary={plotPart.introduction} />
                          </ListItem>
                        </React.Fragment>
                      );
                    })}
                  </List>
                </Collapse>
              </List>

              <div style={{ float: 'right' }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.continue}
                >Potwierdź i wyślij</Button>
              </div>
            </div>
          </Dialog>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default connect(null)(AddCourseConfirm);
