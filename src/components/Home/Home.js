import React, {Component} from 'react';
import {connect} from 'react-redux';

class Home extends Component{

  render(){
    return(
      <>
      
      </>
    );
  }
}

const putReduxStateOnProps = (reduxState)=>({
  reduxState: reduxState.OBJECT
});

export default connect(putReduxStateOnProps)(Home);