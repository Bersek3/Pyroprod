# Trabajar en la web localmente

Desde PowerShell en esta carpeta:

```powershell
npm.cmd run dev
```

Abre http://127.0.0.1:3000. La página se recarga al guardar cambios en `index.html`, `css/styles.css` o `js/main.js`. Detén el servidor con `Ctrl+C`.

No hace falta instalar dependencias: el servidor utiliza Node.js y escucha solo en este equipo. Este comando no publica, no hace commits ni sube cambios a GitHub.

Los servicios conservan las tarjetas anteriores y sus detalles desplegables. Puedes reemplazar los iconos por fotografías usando la clase `offering-photo`; hay un ejemplo comentado en cada servicio del HTML.

## Secuencia de im?genes

Abre http://127.0.0.1:3000/#en-accion y despl?zate entre Servicios y Proyectos. En escritorio, las tres fotos se mezclan seg?n avanzas o retrocedes con el scroll. En m?vil y con movimiento reducido se muestran escenas est?ticas. Las im?genes son referenciales.

Las escenas est?n en `index.html`, los estilos en `css/styles.css` y el comportamiento en `js/motion.js`. Para reemplazar una foto, actualiza su imagen `data-scene-photo` y el fondo `--scene-image` del mismo n?mero de escena.
