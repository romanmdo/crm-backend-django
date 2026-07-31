import { useState, useEffect } from 'react'

function App() {
  const [clientes, setClientes] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    // Aquí hacemos la petición a tu API de Django
    fetch('http://127.0.0.1:8000/api/clientes/', {
      method: 'GET',
      headers: {
        // Tu llave maestra inyectada directamente
        'Authorization': 'Token e505dc3c0a4fd9dd7583e2ae53a5611d4eff5156',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Error al conectar con la API')
        return response.json()
      })
      .then(data => setClientes(data))
      .catch(err => setError(err.message))
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Panel de Clientes CRM</h1>
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f3f4f6' }}>
          <tr>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Nombre</th>
            <th style={{ padding: '10px' }}>Email</th>
            <th style={{ padding: '10px' }}>Facturas Asociadas</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td style={{ padding: '10px' }}>{cliente.id}</td>
              <td style={{ padding: '10px' }}>{cliente.nombre}</td>
              <td style={{ padding: '10px' }}>{cliente.email}</td>
              <td style={{ padding: '10px' }}>
                {cliente.facturas.length > 0 ? (
                  <ul>
                    {cliente.facturas.map(factura => (
                      <li key={factura.id}>
                        {factura.descripcion} - ${factura.monto}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <i>Sin facturas</i>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App