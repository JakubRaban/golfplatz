import React from 'react';
import ReactTimer from 'react-compound-timer';

const Timer = ({ time }) => {
  return (
    <ReactTimer
      direction='backward'
      formatValue={value => `${value < 10 ? `0${value}` : value}`}
      initialTime={time * 1000}
    >
      {(libCallbacks) => (
        <>
          <div>
            <ReactTimer.Hours />:<ReactTimer.Minutes />:<ReactTimer.Seconds />
          </div>
          <div> 
            <img
              className='control-btn'
              alt='stop'
              role='button'
              onClick={() => {
                const actualTime = libCallbacks.getTime();
                console.log(actualTime)
                libCallbacks.stop();
              }}
            />
          </div>
        </>
      )}
    </ReactTimer>
  );
};

export default Timer;
