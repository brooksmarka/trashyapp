import React from 'react';
import { Dimensions, Alert, StyleSheet, ActivityIndicator} from 'react-native';
import { RNCamera } from 'react-native-camera';
import CaptureButton from './CaptureButton';


const clarifaiApiKey= process.env.CLARIFAI_API_KEY;

export default class Camera extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            identifiedAs: '',
            loading: false
        }
    }

    takePicture = async function(){

        if(this.camera){

            //Pause the camera preview
            this.camera.pausePreview();

            //Update the state to indicate loading
            this.setState((previousState, props) => ({
                loading: true
            }));

            //Set the options for the camera
            const options = {
                base64: true
            };

            //Get the base64 version of the image
            const data = await this.camera.takePictureAsync(options)

            this.identifyImage(data.base64)
        }
        
    }

    identifyImage(imageData){
        //Initialize the Clarifai api
        const Clarifai = require('clarifai');

        const app = new Clarifai.App({
            apiKey: clarifaiApiKey
        });

        //Identify the image
        app.models.predict(Clarifai,GENERAL_MODEL, {base64: imageData})
            .then((response) => this.displayAnswer(response.output[0].data.concepts[0].name)
            .catch((err) => alert(err))
            );
    }

    render(){
        return(
            <RNCamera ref={ref => {this.camera = ref;}} style={styles.preview}>
                <ActivityIndicator size="large" style={styles.loadingIndicator} color="#fff" animating={this.state.loading}/>
                <CaptureButton buttonDisabled={this.state.loading} onClick={this.takePicture.bind(this)}/>
            </RNCamera>
        )
    }
}

const styles = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    loadingIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});