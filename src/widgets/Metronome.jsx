/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState } from 'react'
import Knob from '../components/Knob'
import MasterKnob from '../components/MasterKnob'

import MetronomeObj from '../utils/metronome'
import ButtonSwitch from '../components/ButtonSwitch'



const Metronome = () => {
    const [bpm, setBpm] = useState(120)
    const [count, setCount] = useState(0)
    const metronome = useRef(new MetronomeObj())
    
    // function playTick () {
    //     audio1.current.play()
    // }

  return (
    <div className="_metronome">
        <Knob label={'INPUT'}>
            <div className="led"></div>
            <p>SYNC</p>
        </Knob>
        <MasterKnob getValue={(value) => { 
            setBpm(value)
            // metronome.timeInterval = 60000 / value;
            metronome.current.tempo = value;
            setCount(count + 1)
            console.log(value)
        }} />
        <Knob label={'OUTPUT'}>
            <div className="bars">
                {
                    [...Array(4)].map((value, i) => {
                        return <div key={i} className={`bar ${metronome.current.currentBeatInBar === i ? 'active' : ''}`}></div>
                    })
                }
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