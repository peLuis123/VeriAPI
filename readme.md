# API de Verificación

La API de Verificación es una aplicación que permite enviar y verificar códigos de verificación por SMS y correo electrónico. Esta API utiliza servicios de Twilio para enviar mensajes de texto y nodemailer para enviar correos electrónicos.

## Requisitos

Antes de ejecutar la API, asegúrate de tener instalados los siguientes programas y servicios:

- Node.js (versión 12 o superior)
- npm (Node Package Manager)
- Firebase Admin SDK
- Twilio Account y sus credenciales (ACCOUNT_SID y AUTH_TOKEN)
- Cuenta de correo electrónico y las credenciales de acceso (user_email y password)

## Instalación

1. Clona este repositorio en tu máquina local:


git clone https://github.com/tu-usuario/api-verificacion.git
cd api-verificacion


2. Instala las dependencias usando npm:


npm install


3. Configuración de variables de entorno:

Crea un archivo .env en la raíz del proyecto y define las siguientes variables de entorno:



- ACCOUNT_SID=tu_account_sid
- AUTH_TOKEN=tu_auth_token
- NUMBER_1=tu_numero_twilio
- user_email=tu_correo_electronico
- password=tu_contraseña_correo

4. Inicia el servidor:


npm start


La API se ejecutará en http://localhost:4000.

## Endpoints

### Enviar código de verificación por SMS


POST /sms


Envía un código de verificación a un número de teléfono especificado.

Parámetros:

json
{
  "phoneNumber": "tu_numero_telefono"
}


### Verificar código de verificación por SMS


POST /confirm_sms


Verifica si el código de verificación proporcionado es válido.

Parámetros:
json
{
  "verificationCode": "tu_codigo_verificacion"
}


### Enviar código de verificación por correo electrónico

POST /email


Envía un código de verificación a una dirección de correo electrónico especificada.

Parámetros:

json
{
  "email": "tu_correo_electronico"
}

## Documentación de la API

Puedes acceder a la documentación de la API generada con Swagger/OpenAPI en la siguiente URL:


http://localhost:4000/api-docs


## Contribuir

Si encuentras algún problema o tienes alguna mejora para la API, no dudes en abrir un issue o enviar un pull request.
