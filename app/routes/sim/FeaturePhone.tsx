import React, { useEffect, useState } from "react";
import './FeaturePhone.css';
import { Container, Link, Typography } from "@mui/material";
import {
  createCookie,
  DISPLAY_STATE_INITIAL,
  DISPLAY_STATE_NETWORK, DISPLAY_STATE_USER_INPUT,
  getCookie,
  makeRequest, toSentenceCase,
} from "../../util/Utils.js";
import {Call, CallEnd, EditRoad, EditNote, Edit, AbcSharp, Abc} from "@mui/icons-material";

export function Component(): JSX.Element {
  const [inputState, setInputState] = useState({
    msg: '',
    msgType: 1,
    completed: true,
    userData: ''
  })
  const [loading, setLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [displayState, setDisplayState] = useState(DISPLAY_STATE_INITIAL)
  const [assignedNumber, setAssignedNumber] = useState('')
  const [display, setDisplay] = useState<string>('');
  const [tempDisplay, setTempDisplay] = useState<string>('');
  const [lastKeyPressTime, setLastKeyPressTime] = useState<number>(0);
  const [lastKey, setLastKey] = useState<string>('');
  const [phoneOptions, setPhoneOptions] = useState(['', '_'])

  const keyMap: { [key: string]: string } = {
    '1': '1',
    '2': '2ABC',
    '3': '3DEF',
    '4': '4GHI',
    '5': '5JKL',
    '6': '6MNO',
    '7': '7PQRS',
    '8': '8TUV',
    '9': '9WXYZ',
    '0': '0+ ',
    '#': '#',
    '*': '*',
  };

  const handleButtonClick = (value: string): void => {
    const now = Date.now();
    const timeDiff = now - lastKeyPressTime;
    let oldValue = display;

    if (display.includes('...') || display.includes('1: Next') || display.includes('3: Back')){
      return;
    }

    if (displayState === DISPLAY_STATE_INITIAL){
      setDisplay(oldValue+keyMap[value][0]);
      return
    }

    if (value === lastKey && timeDiff <= 1500) {
      if (oldValue !== ''){
        oldValue = oldValue.substring(0, oldValue.length-1);
      }
      // If the same key is pressed within 2 seconds, show the next character
      const keyCharacters = keyMap[value];
      const currentIndex = keyCharacters.indexOf(tempDisplay);
      const nextCharacter = keyCharacters[(currentIndex + 1) % keyCharacters.length];
      setTempDisplay(nextCharacter);
      setDisplay(toSentenceCase(oldValue+nextCharacter));
    } else {
      // If a different key is pressed or the time difference is greater than 2 seconds, update display
      setTempDisplay(keyMap[value][0]);
      setDisplay(toSentenceCase(oldValue+keyMap[value][0]));
    }

    // Update last key and last key press time
    setLastKey(value);
    setLastKeyPressTime(now);
  };

  const handleReset = (): void => {
    setDisplay('');
    setPhoneOptions(['', '_'])
    setDisplayState(DISPLAY_STATE_INITIAL)
  };

  useEffect(()=>{
    if (loading){
      setDisplayState(DISPLAY_STATE_NETWORK)
      setDisplay('Dialing...')
    } else {
      if (displayState == DISPLAY_STATE_NETWORK){
        setDisplayState(DISPLAY_STATE_USER_INPUT)
        setDisplay(inputState.msg)
        if (inputState.completed) {
          setPhoneOptions(['Cancel', 'OK'])
        } else {
          setPhoneOptions(['', 'End'])
        }
      }
    }
  }, [loading])

  useEffect(()=>{
    if (showEdit){
      setPhoneOptions(['Cancel', 'Send'])
    }
  }, [showEdit])

  useEffect(()=>{
    setInputState({
      ...inputState,
      userData: display
    })
    if (displayState == DISPLAY_STATE_INITIAL){
      if (display != ''){
        setPhoneOptions(['Cancel', 'Send'])
      } else {
        setPhoneOptions(['', '_'])
      }
    }
  }, [display])

  const handleDial = (): void => {
    setShowEdit(false)
    if (loading) return

    if (display === '*920*223#' || (display != '' && showEdit)){
      makeRequest(inputState, setInputState, assignedNumber, setLoading)
    } else if (phoneOptions[1] == 'OK'){
      //show edit icon abc
      setShowEdit(true)
      //clear screen
      setDisplay('')
    } else if (phoneOptions[1] == 'End'){
      handleReset()
    }
    //console.log('Dialing...', display);
  };

  const handleHangUp = (): void => {
    // Implement hanging up functionality here (e.g., ending a call)
    // console.log('Hanging up...');
    // setDisplay('');
    if (displayState != DISPLAY_STATE_NETWORK && !(display.includes('...') || display.includes('1: Next') || display.includes('3: Back'))){
      if (display != '' && phoneOptions[0] != '') {
        setDisplay(display.substring(0, display.length - 1))
      } else {
        //handleReset()
      }
    } else if (display.includes('...') || display.includes('1: Next') || display.includes('3: Back')){
      handleReset()
    }
  };

  useEffect(()=> {
    const generateRandomNumber = () => {
      let fakeNumber = getCookie('assigned_number');
      if (fakeNumber !== '') {
        setAssignedNumber(fakeNumber);
        return fakeNumber;
      }
      const prefixes = [
        '23324', '23325', '23355', '2332233', '23323',
        '2335233', '23354', '23326', '23327', '23328',
        '2333233', '23359', '23356', '23357', '23353'
      ];
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randomSuffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
      fakeNumber = randomPrefix + randomSuffix;
      createCookie('assigned_number', fakeNumber);
      setAssignedNumber(fakeNumber);
      return fakeNumber;
    }
    generateRandomNumber()
  },[])

  return (
    <Container
      maxWidth="sm">
    <div className="feature-phone-container">
      <div className="assigned-number-area">
        <Typography align="center">
          Your assigned number is {assignedNumber}
        </Typography>
      </div>
      <div className="display-screen">
        <Typography align="center">
          {display.replace('<br>1: Next', '').replace('<br>3: Back', '').trim()}
          {
            display.includes('<br>1: Next') &&
            <>
              <br/>
              1: Next
            </>
          }

          {
            display.includes('<br>3: Back') &&
            <>
              <br/>
              3: Back
              </>
          }
        </Typography>
      </div>
      {showEdit &&
        <div className="edit-icons-container">
          <Edit sx={{height:16, width: 16}} color={'info'} />
          <Abc color={'info'} />
        </div>
      }
      <div className="phone-options-container">
        <Typography >{phoneOptions[0]}</Typography>
        <Typography >{phoneOptions[1]}</Typography>
      </div>
      <div className="call-buttons-container">
        <button className="hang-up-button" onClick={handleHangUp}>
          <CallEnd color={'error'} />
        </button>
        <button className="call-button" onClick={handleDial}>
          <Call color={'success'} />
        </button>
      </div>
      <div className="button-container">
        <button onClick={() => handleButtonClick('1')}>
          <Typography align="center">
          1
          </Typography>
        </button>
        <button onClick={() => handleButtonClick('2')}>
          <Typography align="center">
            2<br />ABC
          </Typography>
        </button>
        <button onClick={() => handleButtonClick('3')}>
          <Typography align="center">
            3<br />DEF
          </Typography>
        </button>
        <button onClick={() => handleButtonClick('4')}>
          <Typography align="center">
            4<br />GHI
          </Typography>
        </button>
        <button onClick={() => handleButtonClick('5')}>
          <Typography align="center">
            5<br />JKL
          </Typography>
        </button>
        <button onClick={() => handleButtonClick('6')}>
          <Typography align="center">
            6<br />MNO
          </Typography>
        </button>
        <button onClick={() => handleButtonClick('7')}>
          <Typography align="center">
            7<br />PQRS
          </Typography>
        </button>
        <button onClick={() => handleButtonClick('8')}>
          <Typography align="center">
            8<br />TUV
          </Typography>
        </button>
        <button onClick={() => handleButtonClick('9')}>
          <Typography align="center">
            9<br />WXYZ
          </Typography>
        </button>
        <button onClick={() => handleButtonClick('*')}>
          <Typography align="center">
            *
          </Typography>
        </button>
        <button onClick={() => handleButtonClick('0')}>
          <Typography align="center">
            0<br />+&#9251;
          </Typography>
        </button>
        <button onClick={() => handleButtonClick('#')}>
          <Typography align="center">
            #
          </Typography>
        </button>
        <button>

        </button>
        <button onClick={handleReset}>
          <Typography align="center">
            Reset
          </Typography>
        </button>
        <button>

        </button>
      </div>

    </div>
    </Container>
  );
};

Component.displayName = "FeaturePhone";
