import React, { Component } from 'react';


export class Dashboard extends Component {

	static propTypes = {
    isAuthenticated: PropTypes.bool,
    logout: PropTypes.func.isRequired,
  };

	render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
		return (
      <div>
        <h3>Panel prowadzącego</h3>
        <Link to="/add-courses">Dodaj nowy kurs</Link> 
        <Link to="/courses">Zobacz swoje kursy</Link> 
        <Link to="/marks">Podgląd ocen</Link> 
        <button onClick={this.props.logout.bind(this)}>Wyloguj się</button>

      </div>
		);
	}
}
  
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {logout})(Dashboard);