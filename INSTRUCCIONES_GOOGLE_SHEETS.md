# Configuración de Google Sheets para el Formulario de Boda

## Paso 1: Crear la Hoja de Cálculo

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala "Confirmaciones Boda Eric y Lourdes"

## Paso 2: Configurar las Columnas

En la **primera fila**, escribe los siguientes encabezados:

| A1 | B1 | C1 | D1 | E1 | F1 | G1 |
|---|---|---|---|---|---|---|
| Nombre | Apellido | Tiene Acompañante | Nombre Acompañante | Apellido Acompañante | Alergias | Fecha y Hora |

## Paso 3: Crear el Google Apps Script

1. En la hoja de cálculo, ve al menú **Extensiones → Apps Script**
2. Borra todo el código que aparece por defecto
3. Pega el siguiente código:

```javascript
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // Obtener la hoja activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parsear los datos recibidos
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('No se recibieron datos');
    }

    // Crear la fila con los datos
    var row = [
      data.nombre || '',
      data.apellido || '',
      data.tieneAcompanante === 'true' || data.tieneAcompanante === true ? 'Sí' : 'No',
      data.nombreAcompanante || '',
      data.apellidoAcompanante || '',
      data.alergenos || '',
      new Date().toLocaleString('es-ES')
    ];

    // Añadir la fila a la hoja
    sheet.appendRow(row);

    // Respuesta exitosa con CORS habilitado
    var output = ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Datos guardados correctamente'
    })).setMimeType(ContentService.MimeType.JSON);

    return output;

  } catch(error) {
    // Respuesta de error
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Haz clic en el icono del **disco** (guardar) o presiona `Ctrl + S`
5. Dale un nombre al proyecto, por ejemplo: "API Confirmaciones Boda"

## Paso 4: Implementar el Script como Aplicación Web

1. Haz clic en el botón **Implementar** (arriba a la derecha) → **Nueva implementación**
2. Haz clic en el icono de **engranaje** (⚙️) junto a "Seleccionar tipo"
3. Selecciona **Aplicación web**
4. Configura lo siguiente:
   - **Descripción**: "API Boda"
   - **Ejecutar como**: **Yo** (tu email de Google)
   - **Quién tiene acceso**: **Cualquier persona**
5. Haz clic en **Implementar**
6. Si te pide autorización:
   - Haz clic en **Autorizar acceso**
   - Selecciona tu cuenta de Google
   - Haz clic en **Avanzado**
   - Haz clic en **Ir a [nombre del proyecto] (no seguro)**
   - Haz clic en **Permitir**

## Paso 5: Copiar la URL de la Aplicación Web

1. Después de implementar, verás un mensaje de éxito
2. **COPIA la URL de la aplicación web** que aparece
3. Se verá algo así:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

## Paso 6: Configurar la URL en el Proyecto Angular

1. Abre el archivo: `src/app/services/google-sheets.service.ts`
2. Busca la línea:
   ```typescript
   private readonly SCRIPT_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
   ```
3. Reemplaza `'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI'` con la URL que copiaste
4. Guarda el archivo

**Ejemplo:**
```typescript
private readonly SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

## Paso 7: Probar la Integración

1. Guarda todos los cambios
2. Ejecuta la aplicación: `npm start`
3. Abre el formulario en el navegador
4. Completa y envía el formulario
5. Verifica que los datos aparezcan en tu hoja de Google Sheets

## Solución de Problemas

### Error: "No se puede conectar al servidor"
- Verifica que la URL en `google-sheets.service.ts` sea correcta
- Asegúrate de que el script esté implementado como "Aplicación web"
- Verifica que "Quién tiene acceso" esté configurado como "Cualquier persona"

### Error: "Script no autorizado"
- Asegúrate de haber completado el proceso de autorización en el Paso 4

### Los datos no aparecen en la hoja
- Verifica que estés editando la hoja correcta (la primera pestaña)
- Revisa la consola del navegador para ver errores
- Verifica que los encabezados de la hoja estén correctos

## Actualizar la Implementación

Si haces cambios en el script de Google Apps:

1. Guarda los cambios en el editor de Apps Script
2. Ve a **Implementar → Gestionar implementaciones**
3. Haz clic en el icono de **lápiz** (editar) en la implementación actual
4. Cambia la versión a **Nueva versión**
5. Haz clic en **Implementar**

¡Listo! Tu formulario ahora guardará automáticamente las confirmaciones en Google Sheets.
