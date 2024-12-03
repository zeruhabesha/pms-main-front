import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; 2024 reserved by Beta Tech Hub</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://betatechhub.com" target="_blank" rel="Beta Tech Hub">
          Beta-Tech-Hub 
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
