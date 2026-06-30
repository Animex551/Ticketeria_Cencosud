export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title_N">Sobre Nosotros</h3>
          </div>


          <div className="footer__section">
            <h3 className="footer__title">Contacto</h3>
            <p className="footer__text">
              Email: soporte@cencosud.com<br />
              Teléfono: +56 2 XXXX XXXX
            </p>
          </div>
        </div>

        <div className="footer__divider"></div>

        <div className="footer__bottom">
          <p className="footer__text">&copy; {currentYear} CENCOSUD. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
