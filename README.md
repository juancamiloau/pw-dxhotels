# Proyecto de Automatización con Playwright

Este proyecto utiliza Playwright para realizar pruebas automatizadas de dos funcionalidades clave: la reservación de hoteles y el proceso de login en la aplicación.
Se utilizó un patrón de diseño Page Object Model (POM) para organizar el código y mantenerlo escalable y fácil de mantener.

Adicional a esto se creo un SharedContext para compartir datos necesarios para las pruebas el cual se agregó en el before donde era requerido.


## Test Suites

### 1. Hotel Reservation Suite
Esta suite de pruebas se enfoca en validar el proceso de reservación de hoteles en la aplicación. Incluye los siguientes tests:

- **Reserve hotel**: Valida que un usuario pueda filtrar y seleccionar el hotel a sus necesidades, para este escenario se busca en todos los resultados el hotel con menor precio y lo selecciona validando el nombre del hotel y las fechas escogidas.

### 2. Login Suite
Esta suite de pruebas verifica el proceso de autenticación de usuarios. Los tests incluidos son:

**Nota:** Es importante aclarar que el captcha no ha sido automatizado ya que no es recomendable, se agregó una función que espera que el campo captcha tenga 5 carácteres que deberán ser escritos por el usuario al momento de ejecución. Para este tipo de pruebas es recomendable deshabilitar esta carácteristica en ambientes no productivos para automatizar un conjunto de pruebas más crítico y eficiente

- **Login successful**: Verifica que un usuario pueda iniciar sesión con credenciales válidas.
- **Login failed by Captcha**: Verifica que el captcha esta funcionando correctamente ingresando credenciales válidas pero un captcha erróneo.
- **Login failed by empty password**: Verifica que la aplicación no loguee al usuario cuando se ingresa una credencial inválida.

## Bugs Encontrados

Durante la ejecución de las pruebas, se han identificado los siguientes bugs:

1. **Bug en el filtrado de precios**: Al momento de especificar un rango de precios, la aplicación retorna resultados que no corresponden al rango de precios solicitado.


## Requisitos

Para ejecutar las pruebas, asegúrate de tener instalados los siguientes componentes:

- Node.js
- Playwright

## Instalación

1. Clona este repositorio

   ```bash
   git clone https://github.com/juancamiloau/pw-dxhotels.git
   ```

1. Navega al directorio del proyecto:

   ```bash
   cd pw-dxhotels
   ```

1. Instalar dependencias

```bash
npm install
```

## Ejecución de pruebas

La validación con la cual el bug fue encontrado fue deshabilitada bajo comentario para poder ejecutar todo el flujo, en caso tal de querer verificarla por favor descomente la linea #86 del archivo **hotel-results-page.ts**

```javascript
//expect(priceNumber).toBeGreaterThanOrEqual(minPriceShowed);
```
Para ejecutar todas las suites de prueba, utiliza el siguiente comando:

```bash
npx playwright test
```