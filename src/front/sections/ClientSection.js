import { CCol, CContainer, CImage, CRow } from '@coreui/react'
import React from 'react'

import Image1 from '../../assets/images/clients/client-1.png'
import Image2 from '../../assets/images/clients/client-2.png'
import Image3 from '../../assets/images/clients/client-3.png'
import Image4 from '../../assets/images/clients/client-4.png'
import Image5 from '../../assets/images/clients/client-5.png'
import Image6 from '../../assets/images/clients/client-6.png'

const ClientSection = () => {
  const clients = [
    { id: 1, src: Image1, alt: 'Client 1' },
    { id: 2, src: Image2, alt: 'Client 2' },
    { id: 3, src: Image3, alt: 'Client 3' },
    { id: 4, src: Image4, alt: 'Client 4' },
    { id: 5, src: Image5, alt: 'Client 5' },
    { id: 6, src: Image6, alt: 'Client 6' },
  ]

  return (
    <section
      id="clients"
      style={{
        backgroundColor: '#f6fafd',
        padding: '3rem 0',
        textAlign: 'center',
      }}
    >
      <CContainer>
        <h2
          style={{
            marginBottom: '2rem',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          Our Clients
        </h2>
        <CRow
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4rem',
          }}
        >
          {clients.map((client) => (
            <CCol
              key={client.id}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '150px',
                flex: '0 0 calc(16.666% - 1rem)', // Ensures responsiveness
              }}
            >
              <CImage
                src={client.src}
                alt={client.alt}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </CCol>
          ))}
        </CRow>
      </CContainer>
    </section>
  )
}

export default ClientSection
