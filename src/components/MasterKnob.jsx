/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react'
import '../styles/master-knob.css'
import { detectMobile, getMouseDown, getMouseMove, getMouseUp } from '../utils/knob-utils'

const MasterKnob = ({ label, getValue }) => {
    const knobPositionX = useRef()
    const knobPositionY = useRef()
    const mouseX = useRef()
    const mouseY = useRef()
    const knobCenterX = useRef()
    const knobCenterY = useRef()
    const adjacentSide = useRef()
    const oppositeSide = useRef()
    const currentRadiansAngle = useRef()
    const getRadiansInDegrees = useRef()
    const finalAngleInDegrees = useRef()
    const volumeSetting = useRef(20)
    const tickHighlightPosition = useRef()

    const startingTickAngle = useRef(20)
    const knobRef = useRef()
    const innerDialRef = useRef()
    const figureRef = useRef()
    const valRef = useRef()
    const boundingRectangle = useRef({})

    function createTicks(numTicks, highlightNumTicks, tickContainerRef, startingAngle) {
        //reset first by deleting all existing ticks
        // while(tickContainerRef.current.firstChild) {
        //     tickContainerRef.current.removeChild(tickContainerRef.current.firstChild);
        // }

        //create ticks
        for(let i = 0; i < numTicks; i++) {
            const tick = document.createElement("div");

            //highlight only the appropriate ticks using dynamic CSS
            if (i < highlightNumTicks) {
                tick.className = "tick activetick";
            } else {
                tick.className = "tick";
            }

            tickContainerRef?.current?.appendChild(tick);
            tick.style.transform = `rotate(${startingTickAngle.current}deg)`;
            // setStartingTickAngle(startingTickAngle + 10);
            startingTickAngle.current += startingAngle ?? 10;
        }

        // setStartingTickAngle(-135) //reset
        startingTickAngle.current = -135;
    }

    function start() {
        boundingRectangle.current = knobRef.current.getBoundingClientRect()
        knobRef.current.addEventListener(getMouseDown(), onMouseDown); //listen for mouse button click
        document.addEventListener(getMouseUp(), onMouseUp); //listen for mouse button release
    }

    //on mouse button down
    function onMouseDown() {
        document.addEventListener(getMouseMove(), onMouseMove); //start drag
    }

    //on mouse button release
    function onMouseUp() {
        document.removeEventListener(getMouseMove(), onMouseMove); //stop drag
    }

    function onMouseMove(event) {
        knobPositionX.current = (boundingRectangle.current.left) //get knob's global x position
        knobPositionY.current = (boundingRectangle.current.top) //get knob's global y position

        if(detectMobile() === "desktop") {
            mouseX.current = (event.pageX) //get mouse's x global position
            mouseY.current = (event.pageY) //get mouse's y global position
        } else {
            mouseX.current = (event.touches[0].pageX) //get finger's x global position
            mouseY.current = (event.touches[0].pageY) //get finger's y global position
        }

        knobCenterX.current = (boundingRectangle.current.width / 2 + knobPositionX.current) //get global horizontal center position of knob relative to mouse position
        knobCenterY.current = (boundingRectangle.current.height / 2 + knobPositionY.current) //get global vertical center position of knob relative to mouse position

        adjacentSide.current = (knobCenterX.current - mouseX.current) //compute adjacent value of imaginary right angle triangle
        oppositeSide.current = (knobCenterY.current - mouseY.current) //compute opposite value of imaginary right angle triangle

        //arc-tangent function returns circular angle in radians
        //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
        currentRadiansAngle.current = (Math.atan2(adjacentSide.current, oppositeSide.current))

        getRadiansInDegrees.current = (currentRadiansAngle.current * 180 / Math.PI) //convert radians into degrees

        finalAngleInDegrees.current = -(getRadiansInDegrees.current - 135) //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

        //only allow rotate if greater than zero degrees or lesser than 270 degrees
        if(finalAngleInDegrees.current >= 0 && finalAngleInDegrees.current <= 270) {
            knobRef.current.style.transform = `rotate(${finalAngleInDegrees.current}deg)` //use dynamic CSS transform to rotate volume knob
            innerDialRef.current.style.transform = `translate(-50%, -50%) rotate(${finalAngleInDegrees.current}deg)` //use dynamic CSS transform to rotate volume knob
            figureRef.current.style.transform = `translate(-50%, -50%) rotate(-${finalAngleInDegrees.current}deg)` //use dynamic CSS transform to rotate volume knob

            //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
            volumeSetting.current = (Math.floor(finalAngleInDegrees.current / (250 / 232.1)))
            getValue(volumeSetting.current)

            tickHighlightPosition.current = (Math.round((volumeSetting.current * 2.8) / 10)) //interpolate how many ticks need to be highlighted

            // createTicks(28, tickHighlightPosition.current, tickContainerRef); //highlight ticks

            valRef.current.innerHTML = volumeSetting.current
            // document.getElementById("volumeValue").innerHTML = volumeSetting + "%"; //update volume text
        }
    }

    useEffect(() => {
        if (knobRef.current  && innerDialRef.current) {
            start()
            // createTicks(28, 0, tickContainerRef);
            createTicks(180, 0, innerDialRef, 2);
        }
    }, [])

  return (
    <div className="master_knob-container">
        <div className="master_knob-surround">

        <div id="knob" ref={knobRef} className="knob"></div>

        <div className="master_knob-inner" ref={innerDialRef}>
            <div className="caret-down"></div>
            <figure ref={figureRef}>
                <p>METRONOME</p>
                <div className="display">
                    <h1 ref={valRef}>{volumeSetting.current}</h1>
                </div>
                <p>BPM</p>
            </figure>
        </div>


        {/* <div id="tickContainer" ref={tickContainerRef} className="ticks"></div> */}

        </div>
    </div>
  )
}

export default MasterKnob
