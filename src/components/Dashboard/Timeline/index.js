import React, {useState} from 'react';
import {Paper,Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
	      DialogTitle, Grid, Typography, Box,  List, ListItem} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {TwitterTweetEmbed} from 'react-twitter-embed';
import SummaryBox from './SummaryBox';
import Header from './Header';
import StatusSelection from './StatusSelection';
import NewUpdate from './NewUpdate';
import TwitterDialog from './Dialogs/Twitter';
import ImageUploadDialog from './Dialogs/ImageUpload';
import PreviewDialog from './Dialogs/Preview';
import Feed from './Feed';
import axiosInstance from '../../../auth/axiosApi.js';

const useStyles = theme => ({
	body: {
		padding: '0 1rem 0 1rem',
		height: '100vh',
	}
})

const errorMessages = {
	lacks_payload_content: 'Voce deve submeter pelo menos uma atualizacao, ou imagem ou tweet para prosseguir'
}

class Timeline extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				updates: [],
				updateTitle: '',
				updateTextArea: '',
				tweetURL: '',
				tweetID: '',
				twitterDialogOpen: false,
				previewModalOpen: false,
				imageUploadModalOpen: false,
				picture: false,
				time: '19:00',
				sessionID: props.sessionID,
			}
		}

		dispatchPayload = () => {
			let { updates, picture, updateTitle, updateTextArea, sessionID, tweetID } = this.state;
		  if (this.validatePayload()) {
		    const formData = new FormData()
		    if(picture) {
		      formData.append('image', picture, picture.name)
		    }
		    formData.append('title', updateTitle)
		    formData.append('content', updateTextArea)
		    formData.append('session', sessionID)
		    formData.append('tweet_id', tweetID)
		    axiosInstance.post('/publications/', formData, {
		      headers: { 'Content-Type': 'multipart/form-data'},
		    }).then(result => {
		      if(result.status===201) {
		          let data = result.data
		          console.log(data)
		          let newUpdate = {
		            id: data.id,
		            content: data.content,
		            time: this.parseHourMinute(new Date(data.created))
		          }
		          if(data.tweet_id.length > 0) {
		            newUpdate['tweet_id'] = data.tweet_id
		          }
		          if(data.image){
		            newUpdate['image'] = data.image
		          }
		          if(data.title) {
		            newUpdate['title'] = data.title
		          }
							this.setState({updates: [...updates, newUpdate]})
		          return newUpdate
		      }
		    }).catch(err => {
		      console.log(err)
		    })
		  } else {
		    alert(errorMessages.lacks_payload_content)
		  }
		}

		validatePayload = () => {
			let contentExists = this.state.updateTextArea.length > 0
			let tweetExists = this.state.tweetID.length > 0
			return this.state.picture || contentExists || tweetExists;
		}
		parseHourMinute(date) {
			return date.getHours() + ':' + ('0'+ date.getMinutes()).slice(-2)
		}
		handleClick = () => {
			this.dispatchPayload()
		}
		handleTwitterDialogOpen = () => {
			this.setState({twitterDialogOpen: true})
		}
		handleTwitterDialogClose = () => {
			this.setState({twitterDialogOpen: false})
			let parseURL = this.state.tweetURL.split('/')
			let path = parseURL[parseURL.length-1]
			let id = path.split('?')[0]
			this.setState({tweetID: id})
			this.setState({previewModalOpen: true})
		}
		garbageCollection = () => {
			this.setState({tweetID: ''})
			this.setState({picture: false})
			this.setState({updateTitle: ''})
			this.setState({updateTextArea: ''})
		}
		handleImageUploadDialogOpen = (e) => {
			e.preventDefault()
			this.setState({imageUploadModalOpen: true})
		}
		handleImageUploadDialogClose = () => {
			this.setState({imageUploadModalOpen: false})
			this.dispatchPayload()
		}
		handlePreviewModalClose = () => {
			this.dispatchPayload()
			this.setState({previewModalOpen: false})
		}
		handleChange = (e) => {
			this.setState({updateTextArea: e.target.value})
		}
		onImageDrop = (picture) => {
			picture.length > 0 ?  this.setState({picture: picture[0]}) : this.setState({picture: false})
		}
		startUpdateWithTitleFlow = (e,title) => {
			title.length > 0 ? this.setState({updateTitle: title}) : this.setState({updateTitle: ''})
			this.handleImageUploadDialogOpen(e)
		}
		render() {
			const { classes } = this.props;

			return (
				<div className={classes.body} testid="timeline">
					<Header></Header>
					<SummaryBox sessionID={this.state.sessionID}></SummaryBox>
					<StatusSelection startUpdateWithTitleFlow={this.startUpdateWithTitleFlow}></StatusSelection>
					<NewUpdate handleClick={this.handleClick}
										 handleTwitterDialogOpen={this.handleTwitterDialogOpen}
										 handleImageUploadDialogOpen={this.handleImageUploadDialogOpen}
										 updateTextArea={this.updateTextArea}
										 handleChange={this.handleChange}></NewUpdate>
									 <TwitterDialog handleTwitterDialogClose={this.handleTwitterDialogClose}
												 twitterDialogOpen={this.state.twitterDialogOpen}
												 setTweetURL={this.setTweetURL}></TwitterDialog>
											 <ImageUploadDialog imageUploadModalOpen={this.state.imageUploadModalOpen}
														 handleImageUploadDialogClose={this.handleImageUploadDialogClose}
														 setImageUploadModalOpen={this.setImageUploadModalOpen}
														 updateTitle={this.updateTitle}
														 setUpdateTitle={this.setUpdateTitle}
														 handleChange={this.handleChange}
														 onImageDrop={this.onImageDrop}
														 time={this.state.time}></ImageUploadDialog>
													 <PreviewDialog previewModalOpen={this.state.previewModalOpen}
												 handlePreviewModalClose={this.handlePreviewModalClose}
												 setPreviewModalOpen={this.setPreviewModalOpen}
												 handleChange={this.handleChange}
												 tweetID={this.state.tweetID}
												 time={this.state.time}></PreviewDialog>
								<Feed updates={this.state.updates}></Feed>
				</div>
			)
		}
	}
export default withStyles(useStyles)(Timeline);
