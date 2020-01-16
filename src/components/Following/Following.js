import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Following.css';
import NavBar from '../NavBar/NavBar';

class Following extends Component{

  componentDidMount(){
    this.props.dispatch({type: `GET_FOLLOWING`});
  }

  handleClick = (id) => {
    this.props.history.push(`/profile/${id}`);
  }

  render(){
    return(
      <>
      {this.props.reduxState ?
      <>
        {this.props.reduxState.map(image =>
          <div>
            <img className="avatar" onClick={()=>this.handleClick(image.id)} src={"https://scout-daily.s3.us-east-2.amazonaws.com/"+image.image_url} alt={image.username} />
            <div>{image.username}</div>
          </div>
        )}
      </>
      :
      <p>Not following anyone</p>
      }
        <NavBar />
      </>
    );
  }
}

const putReduxStateOnProps = (reduxState)=>({
  reduxState: reduxState.followingReducer
});

export default connect(putReduxStateOnProps)(Following);