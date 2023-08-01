const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
const nodemailer = require('nodemailer');
const account_SID = process.env.ACCOUNT_SID;
const auth_token = process.env.AUTH_TOKEN;
const client = require("twilio")(account_SID, auth_token);


const serviceAccount = require("../keys/serviceAccountkey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stripe-f-11089-default-rtdb.firebaseio.com",
});
const transporter = nodemailer.createTransport({
    host: "devitm.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.user_email,
      pass: process.env.password,
    },
  });

/**
 * @swagger
 * /sms:
 *   post:
 *     summary: Enviar código de verificación por SMS
 *     description: Envia un código de verificación por SMS al número de teléfono proporcionado.
 *     parameters:
 *       - name: phoneNumber
 *         in: body
 *         description: Número de teléfono del destinatario.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Código de verificación enviado correctamente.
 *       '500':
 *         description: Error al enviar el mensaje.
 */

/**
 * @swagger
 * /confirm_sms:
 *   post:
 *     summary: Verificar código de verificación por SMS
 *     description: Verifica si el código de verificación proporcionado es válido.
 *     parameters:
 *       - name: verificationCode
 *         in: body
 *         description: Código de verificación a verificar.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Código de verificación válido.
 *       '500':
 *         description: Error al verificar el código de verificación.
 */
/**
 * @swagger
 * /email:
 *   post:
 *     summary: Enviar código de verificación por correo electrónico
 *     description: Envia un código de verificación por correo electrónico a la dirección proporcionada.
 *     parameters:
 *       - name: email
 *         in: body
 *         description: Dirección de correo electrónico del destinatario.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Código de verificación enviado correctamente por correo electrónico.
 *       '500':
 *         description: Error al enviar el correo electrónico.
 */



const db = admin.firestore();
const generateVerificationCode = () => {
    // Generar código alfanumérico aleatorio de 6 caracteres
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
};
router.post("/sms", (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const verificationCode = generateVerificationCode();
    const uniqueId = db.collection("codigos de verificacion").doc().id;
    client.messages
        .create({
            to: phoneNumber,
            from: process.env.NUMBER_1,
            body: `Su código de verificación es: ${verificationCode}`,
        })
        .then(() => {
            const verificationCodeRef = db
                .collection("codigos de verificacion")
                .doc(uniqueId);
            verificationCodeRef;
            return verificationCodeRef.set({ codigo: verificationCode });
        })
        .then(() => {
            // Código de verificación guardado correctamente
            res.send("Código de verificación guardado");
            setTimeout(() => {
                const verificationCodeRef = db.collection("codigos de verificacion").doc(uniqueId);
                verificationCodeRef.delete().catch((error) => {
                    console.log("Error al eliminar el código de verificación:", error);
                });
            }, 30000); // 30 segundos en milisegundos
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Error al enviar el mensaje");
        });
});

router.post("/confirm_sms", (req, res) => {
    const verificationCode = req.body.verificationCode;
    const verificationCodeRef = db.collection("codigos de verificacion");

    verificationCodeRef
        .where("codigo", "==", verificationCode)
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                res.send("Código de verificación inválido");
            } else {
                snapshot.forEach((doc) => {
                    const documentId = doc.id;
                    // Eliminar el documento de código de verificación
                    verificationCodeRef.doc(documentId).delete();

                    res.send("Código de verificación válido");
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Error al verificar el código de verificación");
        });
});

router.post('/email', (req, res) => {
    const email = req.body.email;
    const verificationCode = generateVerificationCode();

    const mailOptions = {
        from: process.env.user_email,
        to: email,
        subject: 'Codigo de verificacion',
        text: `su codigo de verificacion es: ${verificationCode}`,
    };
    const verificationCodeRef = db.collection('codigos de verificacion').doc();
    verificationCodeRef.set({ codigo: verificationCode })
        .then(() => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Error al enviar el correo electrónico');
                } else {
                    console.log('Correo electrónico enviado:', info.response);
                    res.send('Correo electrónico enviado correctamente');
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error al guardar el código de verificación en la base de datos');
        });


});
module.exports = router;