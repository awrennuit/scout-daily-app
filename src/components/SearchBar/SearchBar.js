import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TextField from '@material-ui/core/TextField';

function SearchBar(){

  let dispatch = useDispatch();
  let searchFor = useSelector((state)=>state.searchFor);

  handleChange = (e) => {
    dispatch({type: 'SEARCH_GET', payload: e.target.value});
  }

  // Set state to input value
  // handleChange = (event) => {
  //   this.setState({
  //     search: event.target.value
  //   });
  // }

  // Dispatch state to saga for GET
  // handleClick = (search) => {
  //   this.props.dispatch({type: `SEARCH_FILM`, payload: this.state.search});
  //   this.props.history.push('/search='+search);
  // }

  return(
    <>
      <TextField 
        id="outlined-basic" 
        label="search users" 
        variant="outlined"
        style={{marginRight:"20px"}}
        onChange={()=>this.handleChange()}
        value={searchFor}
      />
    </>
  )
}

export default SearchBar;