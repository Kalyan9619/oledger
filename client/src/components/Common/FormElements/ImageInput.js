import React, { useState, useEffect } from 'react';
import './Input.css';

const ImageInput = (props) => {
  
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

 
    useEffect(() => {
        
        if(!file){
            return;
        }

       
        const fileReader = new FileReader();
       
        fileReader.onload = () => {
           
            setPreviewUrl(fileReader.result);
        };
      
        fileReader.readAsDataURL(file);
    }, [file]);

    const imgUploadHandler = (event) => {
        event.preventDefault();
        
        let selectedFile;
        let validFile = isValid;

        if( event.target.files.length === 0){
            setIsValid(false);
            validFile = false;
            document.getElementById("error-span").classList.add(props.errorStyle);

            document.getElementById("error-paragraph").classList.remove("no-error-text");
            document.getElementById("error-paragraph").classList.add(props.errorTextStyle);
            document.getElementById("img-label-id").classList.remove(props.opacity);
        }else{
            document.getElementById("error-paragraph").classList.add("no-error-text");
            document.getElementById("error-paragraph").classList.remove(props.errorTextStyle);
            document.getElementById("error-span").classList.remove(props.errorStyle);
            document.getElementById("img-label-id").classList.add(props.opacity);
            
        }

      
        if(event.target.files && event.target.files.length === 1){
           
            selectedFile = event.target.files[0];

          
            setFile(selectedFile);
            setIsValid(true);
            validFile = true;
        }else{
            setIsValid(false);
            validFile = false;
        }
      
        props.onInput(props.id, selectedFile, validFile);
    }

    return(
        <React.Fragment>
            <div className={[props.inputContainerStyle].join(' ')}>
                <input 
                    className={[props.inputStyle].join(' ')}
                    id={props.id}
                    type="file"
                    accept=".jpg, .png, .jpeg"
                    value={props.value}
                    label={props.label} 
                    onChange={imgUploadHandler}
                    />

                    <label  
                        htmlFor={props.id}
                        id="img-label-id"
                        className={[props.labelStyle].join(' ')}>{props.label}
                    </label>

                    <div>
                        {
                        isValid && previewUrl && <img className={[props.imgStyle].join(' ')} src={previewUrl}/>}
                        
                    </div>
                    
                    <span id="error-span"></span>
                   
            </div>
            {<p id="error-paragraph" className="no-error-text"> {props.errorText}</p>}
    </React.Fragment>
    );
    
}

export default ImageInput;