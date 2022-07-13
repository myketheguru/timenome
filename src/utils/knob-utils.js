
export function detectMobile()
{
    var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

    if(result !== null)
    {
        return "mobile";
    } else {
        return "desktop";
    }
}

export function getMouseDown()
{
    if(detectMobile() === "desktop")
    {
        return "mousedown";
    } else {
        return "touchstart";
    }
}

export function getMouseUp()
{
    if(detectMobile() === "desktop")
    {
        return "mouseup";
    } else {
        return "touchend";
    }
}

export function getMouseMove()
{
    if(detectMobile() === "desktop")
    {
        return "mousemove";
    } else {
        return "touchmove";
    }
}