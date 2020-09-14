import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List'
import CircularProgress from '@material-ui/core/CircularProgress';

import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import RadioCard from './radioCard'
import fetchDataRadioCamara from './fetchRadioCamara'



export default class RadioCamaraContent extends React.Component {
    
  constructor(props){
    super(props);
    this.state = { 
        radioNews: "",
        radioNewsFiltered:"",
        dataLoaded: false,
        searchField: ''
    };
  }

  topBarRadioCamaraBar(props){
    return(
      <React.Fragment>
        <Grid item xs={8}>
          <Typography variant="h6" style={{ color: "#007E5A" }}>Mais recentes </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton color="primary" aria-label="folder picture" component="span" style={{padding:0}}>
            <CreateNewFolderIcon />
          </IconButton>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="input-search-radio"
            size="small"
            onChange={this.radioFilterOnChange}
            InputProps={{
              endAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
            }}
          />
        </Grid>
      </React.Fragment>
    );
  }

  fetchRadioNewsList = async term => {
      const data = await fetchDataRadioCamara();
      this.setState({radioNews:data.hits.hits})
      this.setState({radioNewsFiltered:data.hits.hits})
      this.setState({dataLoaded:true});
  };

  componentDidMount(){
      this._isMounted = true;

      if(this._isMounted){
          this.fetchRadioNewsList();
      }
  }

  radioFilterOnChange = (event) => {
    //console.log(event.target.value)
    this.setState({
      searchField: event.target.value
    })
    this.setState({
      radioNewsFiltered: this.state.radioNews.filter(news => news._source.titulo.toLowerCase().includes(this.state.searchField.toLowerCase()))
    })
  }

  render(){
    //console.log(this.state.news)
    if(!this.state.dataLoaded){
      return (<Box display="flex" justifyContent="center" alignItems="center">
                  <CircularProgress></CircularProgress>
              </Box>)
    }

    return (
      <div>
        <Grid container>
          {this.topBarRadioCamaraBar()}
          <Grid item xs={12}>
            <Box paddingTop={3}>
              <List style={{maxHeight: '200px', overflow: 'auto'}}>            
                {this.state.radioNewsFiltered.map((news) => (
                    <li key={`section-${news._id}`}>
                        <Box my={0.5}><RadioCard info={news._source} sessionId={this.props.sessionId} ></RadioCard></Box>
                    </li>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </div>
    )
  }
}