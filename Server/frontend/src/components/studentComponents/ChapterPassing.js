import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { startChapter } from "../../actions/course";
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


export class ChapterPassing extends Component {
  constructor(props) {
    super(props);
    props.startChapter(props.match.params.id);
  }

  state = {
    loading: true,
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    startedChapter: PropTypes.any,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.startedChapter !== this.props.startedChapter) {
      this.setState({
        loading: false,
      })
    }
  }

  onChange(){
    console.log("XD");
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 2) {
      return (
        <Redirect to="/"/>
      )
    }//musi zwracac nr przygody w rozdziale
    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Przed Tobą walka
        </Typography>
        {this.state.loading ? <div>Ładowanie</div> : 
          <div>
            <Typography variant="h5" gutterBottom>
              {this.props.startedChapter.adventure.name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {this.props.startedChapter.adventure.taskDescription}
            </Typography>
            {this.props.startedChapter.adventure.hasTimeLimit ? <div>Wyświetl Timer</div> : <br/>}
            {this.props.startedChapter.adventure.pointSource.questions.map((question) => (
              <React.Fragment>
                <Typography variant="subtitle1" gutterBottom>
                  {question.text}
                </Typography>
                <FormControl component="fieldset">
                  <FormGroup>
                    {question.answers.map((answer) => (
                
                      <FormControlLabel
                        control={<Checkbox checked={false} onChange={this.onChange} name="answer" />}
                        label={answer.text}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </React.Fragment>
            ))}
          </div>
        }
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  startedChapter: state.course.chapterTaken,
});

export default connect(mapStateToProps, {startChapter})(ChapterPassing);

/*import React, { Component } from "react";
import { render } from "react-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { countDown: 15 };
    this.timer = setInterval(() => this.tick(), props.timeout || 1000);
  }

  tick() {
    let current = this.state.countDown;
    if (current === 0) {
      this.transition();
    } else {
      this.setState({ countDown: current - 1 });
    }
  }

  transition() {
    clearInterval(this.timer);
    // do something else here, presumably.
  }

  render() {
    return <div className="timer">{this.state.countDown}</div>;
  }
}

render(<App seconds={10} />, document.getElementById("root"));
*/