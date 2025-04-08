const RegisterPage = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Crear Cuenta</h1>
        <form>
          <input type="text" placeholder="Nombre" className="block mb-2 p-2 border" />
          <input type="email" placeholder="Correo" className="block mb-2 p-2 border" />
          <input type="password" placeholder="Contraseña" className="block mb-4 p-2 border" />
          <button className="bg-green-500 text-white px-4 py-2 rounded">Registrarse</button>
        </form>
      </div>
    );
  };
  
  export default RegisterPage;
  