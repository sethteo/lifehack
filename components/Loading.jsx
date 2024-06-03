import React from 'react'

const Loading = () => {
  return (
    <div className='loading-overlay'>
        <div className='loader'></div>
        <p>Processing your transaction...</p>
        <p>This may take a moment as we await blockchain confirmation.</p>
    </div>
  )
}

export default Loading