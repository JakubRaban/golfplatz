import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, ListItemText } from '@material-ui/core/';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import blue from '@material-ui/core/colors/blue';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


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

  continue = e => {
    e.preventDefault();
    this.props.submit();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  handleClick = () => {
    let assignHelper = this.state.open;
    this.setState({
      open: !assignHelper
    });
  };

  handleClick2 = () => {
    let assignHelper = this.state.open2;
    this.setState({
      open2: !assignHelper
    });
  };

  render() {
    const {
      values: { name, description, courseGroups, plotParts, chapters }
    } = this.props;
    console.log(chapters);
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
                  {courseGroups.map(group=>{
                    return (
                      <ListItem style={{paddingLeft: theme.spacing(4)}}>
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
                  {plotParts.map(plotPart=>{
                    return (
                      <React.Fragment>
                        <ListItem>
                          <ListItemText primary="Nazwa" secondary={plotPart.name} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Opis" secondary={plotPart.introduction} />
                        </ListItem>
                      </React.Fragment>
                    )
                  })}
                </List>
              </Collapse>
            </List>

            <div style={{float: 'right'}}>
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
    )
  }
}

export default connect(null)(AddCourseConfirm);