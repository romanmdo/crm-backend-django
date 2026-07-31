import { useState, useEffect } from 'react'

function App() {
  const [clientes, setClientes] = useState([])
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(true)
  
  // Estado para el nuevo cliente
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    email: '',
    telefono: ''
  })

  // Estado para la nueva factura
  const [nuevaFactura, setNuevaFactura] = useState({
    descripcion: '',
    monto: '',
    cliente: '' // Aquí guardaremos el ID del cliente
  })

  const token = 'Token e505dc3c0a4fd9dd7583e2ae53a5611d4eff5156'
  const urlClientes = 'http://127.0.0.1:8000/api/clientes/'
  const urlFacturas = 'http://127.0.0.1:8000/api/facturas/' // Asumiendo que esta es tu ruta en Django

  const cargarClientes = () => {
    setCargando(true)
    fetch(urlClientes, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Error al conectar con la API')
        return response.json()
      })
      .then(data => {
        setClientes(data)
        setCargando(false)
      })
      .catch(err => {
        setError(err.message)
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarClientes()
  }, [])

  // Guardar Cliente
  const manejarSubmitCliente = (e) => {
    e.preventDefault()
    fetch(urlClientes, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoCliente)
    })
    .then(response => {
      if (response.ok) {
        setNuevoCliente({ nombre: '', email: '', telefono: '' })
        cargarClientes()
      } else {
        alert("La API rechazó al cliente. Revisa el email.")
      }
    })
    .catch(err => console.error("Error al crear cliente:", err))
  }

  // Guardar Factura
  const manejarSubmitFactura = (e) => {
    e.preventDefault()
    fetch(urlFacturas, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaFactura)
    })
    .then(response => {
      if (response.ok) {
        setNuevaFactura({ descripcion: '', monto: '', cliente: '' })
        cargarClientes() // Recarga la tabla para mostrar la nueva factura
      } else {
        alert("La API rechazó la factura. ¿Tienes habilitada la ruta /api/facturas/ en tu router de Django?")
      }
    })
    .catch(err => console.error("Error al crear factura:", err))
  }

  // Variables de diseño global
  const theme = {
    bg: '#f8fafc',
    card: '#ffffff',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    success: '#10b981',
    textMain: '#0f172a',
    textSub: '#64748b',
    border: '#e2e8f0'
  }

  const inputStyle = {
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: '6px', 
    border: `1px solid ${theme.border}`, 
    fontSize: '14px', 
    outline: 'none', 
    boxSizing: 'border-box'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, fontFamily: '"Inter", system-ui, sans-serif', color: theme.textMain }}>
      
      {/* Navbar Superior */}
      <nav style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: theme.primary, color: 'white', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
            C
          </div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>CRM Enterprise</h1>
        </div>
        <div style={{ fontSize: '14px', color: theme.textSub, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: theme.success, borderRadius: '50%' }}></span>
          API Conectada
        </div>
      </nav>

      {/* Contenedor Principal */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        
        {/* Tarjetas de Estadísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: theme.card, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: theme.textSub, fontWeight: '500' }}>Total de Clientes</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: theme.textMain }}>{clientes.length}</p>
          </div>
          <div style={{ backgroundColor: theme.card, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: theme.textSub, fontWeight: '500' }}>Facturas Emitidas</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: theme.textMain }}>
              {clientes.reduce((acc, cliente) => acc + (cliente.facturas ? cliente.facturas.length : 0), 0)}
            </p>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            ⚠️ Error de conexión: {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          
          {/* Columna Izquierda: Formularios */}
          <div style={{ width: '350px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Formulario de Cliente */}
            <div style={{ backgroundColor: theme.card, borderRadius: '12px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${theme.border}` }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Añadir Cliente</h2>
              </div>
              <form onSubmit={manejarSubmitCliente} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMain, marginBottom: '8px' }}>Nombre Completo</label>
                  <input type="text" required placeholder="Ej. Jane Doe" style={inputStyle}
                    value={nuevoCliente.nombre} onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMain, marginBottom: '8px' }}>Correo Electrónico</label>
                  <input type="email" required placeholder="jane@ejemplo.com" style={inputStyle}
                    value={nuevoCliente.email} onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMain, marginBottom: '8px' }}>Teléfono</label>
                  <input type="text" placeholder="+1 234 567 890" style={inputStyle}
                    value={nuevoCliente.telefono} onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                  />
                </div>
                <button type="submit" style={{ width: '100%', backgroundColor: theme.primary, color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>
                  Guardar Cliente
                </button>
              </form>
            </div>

            {/* Formulario de Factura */}
            <div style={{ backgroundColor: theme.card, borderRadius: '12px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${theme.border}` }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Emitir Factura</h2>
              </div>
              <form onSubmit={manejarSubmitFactura} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMain, marginBottom: '8px' }}>Seleccionar Cliente</label>
                  <select required style={inputStyle} value={nuevaFactura.cliente} onChange={(e) => setNuevaFactura({...nuevaFactura, cliente: e.target.value})}>
                    <option value="" disabled>Elige un cliente...</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} (ID: {c.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMain, marginBottom: '8px' }}>Descripción</label>
                  <input type="text" required placeholder="Ej. Servicio de consultoría" style={inputStyle}
                    value={nuevaFactura.descripcion} onChange={(e) => setNuevaFactura({...nuevaFactura, descripcion: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMain, marginBottom: '8px' }}>Monto ($)</label>
                  <input type="number" step="0.01" required placeholder="0.00" style={inputStyle}
                    value={nuevaFactura.monto} onChange={(e) => setNuevaFactura({...nuevaFactura, monto: e.target.value})}
                  />
                </div>
                <button type="submit" style={{ width: '100%', backgroundColor: theme.success, color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>
                  Crear Factura
                </button>
              </form>
            </div>

          </div>

          {/* Panel Principal: Tabla */}
          <div style={{ flexGrow: 1, backgroundColor: theme.card, borderRadius: '12px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${theme.border}` }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Directorio Activo</h2>
            </div>
            
            {cargando ? (
              <div style={{ padding: '40px', textAlign: 'center', color: theme.textSub }}>Cargando datos...</div>
            ) : (
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: theme.textSub, textTransform: 'uppercase' }}>Cliente</th>
                    <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: theme.textSub, textTransform: 'uppercase' }}>Contacto</th>
                    <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: theme.textSub, textTransform: 'uppercase' }}>Estado / Facturas</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: theme.textSub, fontSize: '14px' }}>
                        No hay registros en la base de datos.
                      </td>
                    </tr>
                  ) : (
                    clientes.map(cliente => (
                      <tr key={cliente.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '12px' }}>
                              {cliente.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500', color: theme.textMain, fontSize: '14px' }}>{cliente.nombre}</div>
                              <div style={{ color: theme.textSub, fontSize: '12px' }}>ID: #{cliente.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontSize: '14px', color: theme.textMain }}>{cliente.email}</div>
                          <div style={{ fontSize: '13px', color: theme.textSub }}>{cliente.telefono || '---'}</div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          {cliente.facturas && cliente.facturas.length > 0 ? (
                            <div>
                              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                                {cliente.facturas.length} Factura(s)
                              </span>
                              <div style={{ fontSize: '13px', color: theme.textSub }}>
                                {cliente.facturas.map(f => (
                                  <div key={f.id} style={{ marginBottom: '4px' }}>• {f.descripcion} <strong>(${f.monto})</strong></div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '12px', fontWeight: '500' }}>
                              Sin movimientos
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

export default App