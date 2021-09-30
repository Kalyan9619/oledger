import React, { useReducer, useEffect } from 'react';
import { validate } from '../../util/validator';
import './Input.css';

const inputReducer = (state, action) => {
    switch(action.type){
        case 'CHANGED':
            return {
               
                ...state,
               
                value: action.inputVal,
                isValid: validate(action.inputVal, action.validators)
            }
        case 'TOUCHED':
                return {
                    ...state,
                    isTouch: true
                }
        default: 
            return state;
    }
}

const Input = props => {

    const [inputState, dispatch] = useReducer(inputReducer, {
       
        value: props.value || '',
        isValid: props.valid || false,
        isTouch: false
    });

    
    const { id, onInput } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
       
        onInput(id, value, isValid);
       
    }, [id, value, isValid, onInput]);

    const onChangeHandler = (event) => {
        
        dispatch({
            type: 'CHANGED',
            inputVal: event.target.value,
            validators: props.validator
        });

        if(event.target.value.length > 0){
            document.getElementById(event.target.id).nextElementSibling.classList.add('input-field-label-active');
        }
    }

    const onTouchHandler = () => {
      
        dispatch({
            type: 'TOUCHED'
        });
    }

    return(
        <React.Fragment>
            <div  className={[props.inputContainerStyle].join(' ')}>
                <input 
                    className={[props.inputStyle].join(' ')}
                    id={props.id}
                    element={props.element}
                    type={props.type}
                    placeholder={props.placeholder}
                    onChange={onChangeHandler}
                    onBlur={onTouchHandler}
                    value={props.value}/>

                    <label  
                        htmlFor={props.id}
                        className={[props.labelStyle].join(' ')}>{props.label}
                    </label>
                    
                    <span className={`${inputState.isTouch && !inputState.isValid && props.errorStyle}`}></span>
                
            </div>
            {inputState.isTouch && !inputState.isValid && <p className="error-text">{props.errorText}</p>}
        </React.Fragment>
    );
}

export default Input;