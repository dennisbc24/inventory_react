// Fecha actual en zona horaria de Perú (America/Lima, UTC-5)
// Intl con timeZone evita el desfase de toISOString() (UTC) que
// después de las 7pm hora peruana ya devuelve el día siguiente.
export const todayPeru = () => {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return fmt.format(new Date());
};
