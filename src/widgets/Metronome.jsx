/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import Knob from '../components/Knob'
import MasterKnob from '../components/MasterKnob'

import Sound1 from '../assets/sounds/click1.mp3'
import Sound2 from '../assets/sounds/click2.mp3'
import Timer from '../utils/Timer'
import MetronomeObj from '../utils/metronome'
import ButtonSwitch from '../components/ButtonSwitch'



const Metronome = () => {
    const [bpm, setBpm] = useState(120)
    const [started, setStarted] = useState(false)
    const [count, setCount] = useState(0)
    const audio1 = useRef(new Audio(Sound1))
    // const [metronome, setMetronome] = useState(new Timer(playTick, 60000 / bpm, { immediate: true }))
    const metronome = useRef(new MetronomeObj())
    
    function playTick () {
        audio1.current.play()
    }
    
    
    
    // useEffect(() => {
    //     if (started) {
    //         metronome.current.start()
    //     } else {
    //         metronome.current.stop()
    //     }
          
    // }, [started, bpm.current])
        

  return (
    <div className="_metronome">
        <Knob label={'INPUT'}>
            <div className="led"></div>
            <p>SYNC</p>
        </Knob>
        <MasterKnob getValue={(value) => { 
            // setBpm(value)
            // metronome.timeInterval = 60000 / value;
            metronome.current.tempo = value;
            setCount(count + 1)
            console.log(value)
        }} />
        <Knob label={'OUTPUT'}>
            <div className="bars">
                <div className="bar active"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            <p>1/4 STEP</p>
        </Knob>

        <ButtonSwitch
         onChange={() => {
            metronome.current.startStop()
            }} />
    </div>
  )
}

export default Metronome