import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Layout from '../../components/Layout';

//se crea la función de apoderados con los métodos para poder insertar datos
function Apoderado() {
  const [apoderados, setApoderados] = useState([]); // para almecanr una lista []
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [documentoIdentidad, setDocumentoIdentidad] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [parentescos, setParentescos] = useState([]);// para almecanr una lista []
  const [bandera, setBandera] = useState(false);

  //se hace llamado a la api de apoderado guardandolo en una variable constante
  const apiAurl = 'http://127.0.0.1:8000/apoderado/';

  //obtiene los datos de apoderado
  useEffect(() => {
    axios.get(apiAurl)
      .then(res => {
        console.log(res.data);
        setApoderados(res.data);
        setBandera(false);
      })
  }, [bandera]);

  //obtiene los datos de parentesco
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/parentesco/')
      .then(res => {
        console.log(res.data);
        setParentescos(res.data);
      })
  }, []);

  //se crea la función mostrar
  function mostrar(cod) {
    console.log("mostrando codigo " + cod);
    axios.get(apiAurl + cod)
      .then(res => {
        const apoderado = res.data;
        setId(apoderado.apoderado_id);
        setNombre(apoderado.apoderado_nombre);
        setApellido(apoderado.apoderado_apellido);
        setTelefono(apoderado.apoderado_telefono);
        setDocumentoIdentidad(apoderado.apoderado_documento_identidad);
        setParentesco(apoderado.parentesco);
      });
  }
  //se crea la función para guardar los datos ingresados
  function guardar(e) {
    e.preventDefault();
    const datos = {
      apoderado_nombre: nombre,
      apoderado_apellido: apellido,
      apoderado_telefono: telefono,
      apoderado_documento_identidad: documentoIdentidad,
      parentesco: parentesco
    };
    
    if (id) {
      axios.put(apiAurl + id + '/', datos)
        .then(res => {
          console.log(res.data);
          limpiarFormulario();
          setBandera(true);
        })
        .catch(error => {
          console.log(error.toString());
        });
    } else {
      axios.post(apiAurl, datos)
        .then(res => {
          console.log(res.data);
          limpiarFormulario();
          setBandera(true);
        })
        .catch(error => {
          console.log(error.toString());
        });
    }
  }
  //se crea la función para eliminar datos 
  function eliminar(cod) {
    const rpta = window.confirm("¿Desea eliminar?");
    if (rpta) {
      axios.delete(apiAurl + cod + '/')
        .then(res => {
          console.log(res.data);
          setBandera(true);
        });
    }
  }
  //limpia el formulario una vez guardados los datos
  function limpiarFormulario() {
    setId(null);
    setNombre('');
    setApellido('');
    setTelefono('');
    setDocumentoIdentidad('');
    setParentesco(null);
  }
  //vista que se imprime en la pantalla
  return (
    <Layout>
      <>
        
        <h1>Apoderados</h1>
        <div className="mb-3">
          {/* Formulario */}
          <form onSubmit={guardar}>
            <label className="form-label">Nuevo Apoderado</label>
            <input type="hidden" value={id} />
            <input
              type="text"
              className="form-control"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              required
            />
            <br />
            <input
              type="text"
              className="form-control"
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="Apellido"
              required
            />
            <br />
            <input
              type="text"
              className="form-control"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Teléfono"
              required
            />
            <br />
            <input
              type="text"
              className="form-control"
              id="documentoIdentidad"
              value={documentoIdentidad}
              onChange={(e) => setDocumentoIdentidad(e.target.value)}
              placeholder="Documento de Identidad"
            />
            <br />
            <select
              className="form-select"
              value={parentesco}
              onChange={(e) => setParentesco(e.target.value)}
              required
            >
              <option value="">Seleccione Parentesco</option>
              {parentescos.map((par) => (
                <option key={par.parentesco_id} value={par.parentesco_id}>
                  {par.parentesco_nombre}
                </option>
              ))}
            </select>
            <br />
            <button type="submit" className="btn btn-success">
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={limpiarFormulario}
            >
              Limpiar
            </button>
          </form>
        </div>

       {/* Tabla */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Nombre</th>
              <th scope="col">Apellido</th>
              <th scope="col">Teléfono</th>
              <th scope="col">DNI</th>
              <th scope="col">Parentesco</th>
              <th scope="col"></th>
            </tr>
          </thead>         
          <tbody>
            {apoderados.map((apo) => (
              <tr key={apo.apoderado_id}>
                <td>{apo.apoderado_id}</td>
                <td>{apo.apoderado_nombre}</td>
                <td>{apo.apoderado_apellido}</td>
                <td>{apo.apoderado_telefono}</td>
                <td>{apo.apoderado_documento_identidad}</td>
                <td>{apo.parentesco_nombre}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => mostrar(apo.apoderado_id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => eliminar(apo.apoderado_id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    </Layout>
  );
}

export default Apoderado;
