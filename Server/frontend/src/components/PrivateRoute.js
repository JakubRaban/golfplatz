import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


const PrivateRoute = ({ component: Component, auth, ...rest }) => (  
  <Route
    {...rest}
    render={(props) => {
      if (auth.loading) {
        return
         <img src="https://i.pinimg.com/originals/ec/d6/bc/ecd6bc09da634e4e2efa16b571618a22.gif" alt="loading"/>;
      } else if (!auth.isAuthenticated) {
        return <Redirect to="/login" />;
      } else if (auth.user.groups[0] === 1){
        return <Redirect to='/student'/>;
      }
      else {
        return <Component {...props} />;
      }
    }}
  />
);

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
