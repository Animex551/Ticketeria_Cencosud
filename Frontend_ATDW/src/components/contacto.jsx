function Contactos(){

      return (
        <main className="contacto-page" role="main">
          <div className="container">
           

            <form className="contact-form" >
              <div className="form-group">
                <h1>Contacto</h1>
                <label htmlFor="nombre">Nombre completo:</label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="asunto">Asunto:</label>
                <input
                  id="asunto"
                  type="text"
                  name="asunto"
                  placeholder="Asunto de tu mensaje"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Mensaje:</label>
                <textarea
                  id="mensaje"
                  name="mensaje"

                  placeholder="Tu mensaje"
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primario">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </main>
      );
};


export default Contactos;
