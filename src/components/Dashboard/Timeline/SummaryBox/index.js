import React, {useState} from 'react';
import { Grid, Typography, Box, Button, TextField } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import axiosInstance from '../../../../auth/axiosApi.js';
import DownArrowIcon from './../../../../assets/down-arrow.svg';
import {API_SESSIONS_URL} from './../../../../api_urls'
import {submitSummaryContent} from './../timelineAPIhandler';
const useStyles = makeStyles((theme) => ({
	summaryBox: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
	},
	summaryHeader: {
  	display: 'flex',
		margin: '1rem 0 0.5rem 0',
  },
	notchedOutline: {
		border: '2px solid #F2F2F2',
		borderWidthBottom: '0px',
		color: theme.palette.secondary,
		borderRadius: '5px 5px 0 0',
	},
	textArea: {
		height: '100%',
		margin: '0rem 0 0 0',
		width: '100%',
		border: '0',
	},
	button: {
	  height: 'inherit',
	  alignSelf: 'center',
		borderRadius: '0 0 5px 5px',
		backgroundColor: theme.palette.verdeCamaraLight.main,
		color: theme.palette.white.main,
		textTransform: 'capitalize',
	},
	textField: {
		margin: '0 1rem 0 0',
		height: '100%',
		width: '100%',
		fontSize: theme.typography.body1.fontSize,
		fontStyle: theme.typography.body1.fontStyle,
	},
	box: {
		borderRadius: '0 0 0 5px',
		width: '100%',
	},
	buttonContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
		 height: 'inherit'
	},
	container: {
		height: '100%',
	},
}));

export default function SummaryBox(props) {
  const classes = useStyles();
  const sessionID = props.sessionID;
  const [textFieldValue, setTextFieldValue] = useState('');
  function handleChange(e) {
    setTextFieldValue(e.target.value)
  }

	const handleSubmit = async (e) => {
		let result = await submitSummaryContent(sessionID, textFieldValue)
		if(result) {
			alert('Resumo atualizado com sucesso!')
			return true;
		}
	}

  return (
    <React.Fragment>
    <Grid container className={classes.summaryBox}>
      <Grid container className={classes.summaryHeader}>
        <Grid item md={6} style={{display:'flex', justifyContent: 'flex-start'}}>
          <Typography variant="h5"> Resumo </Typography>
        </Grid>
        <Grid item md={6} style={{display:'flex', justifyContent: 'flex-end'}}>
        </Grid>
      </Grid>
    </Grid>
    <Grid item md={12}>
        <Grid container >
            <form className={classes.textArea} noValidate autoComplete="off">
              <TextField
                id="summary-box-textfield"
                multiline
                rows={4}
                value={textFieldValue}
                onChange={handleChange}
                variant="outlined"
								disabled={!props.broadcastingOnline}
                className={classes.textField}
                bgcolor="white"
                InputProps={{
                  classes: {
                    notchedOutline: classes.notchedOutline
                  },
                }}
              />
            </form>
          <Box className={classes.box} color="#F2F2F2" bgcolor="#F2F2F2">
						<Grid container className={classes.container}>
								<Grid item xs={8}></Grid>
								<Grid item xs={4} className={classes.buttonContainer}>
									<Button disabled={!props.broadcastingOnline}
													id="summary-box-submit-button"
													className={classes.button}
													onClick={(e) => handleSubmit(e)}
													variant="contained"
													disableElevation>
										Atualizar
									</Button>
								</Grid>
						</Grid>
          </Box>
      </Grid>
		</Grid>
    </React.Fragment>
  )
}
