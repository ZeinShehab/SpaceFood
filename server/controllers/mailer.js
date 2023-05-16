import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import {google} from 'googleapis'
import http from 'http';
// https://ethereal.email/create
// let nodeConfig = {
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: ENV.EMAIL, // generated ethereal user
//         pass: ENV.PASSWORD, // generated ethereal password
//     }
// }
const clientId = '201255915563-4tmjquusheuksbj0gf5q63nfp9utjdfc.apps.googleusercontent.com'
const clientSecret = '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'
const refreshToken = '1//04Xcm8hpXfRN0CgYIARAAGAQSNwF-L9IrsZ4edKvJT_zxRYd8QTQUQ8YB6r77Q397w5zL2Tej-om0sB8i6kZV7YxHMtYhW8teAX8'
const user = 'mail.spacefood@gmail.com'
const OAuth2 = google.auth.OAuth2
const OAuth2_client = new OAuth2(clientId,clientSecret)
OAuth2_client.setCredentials({refresh_token: refreshToken})

const accessToken = OAuth2_client.getAccessToken()



// const user = 'emilie.frami@ethereal.email'
// const password = 'vZmyC2uBM9C6wnu8ME'
const nodeConfig = {
    service: 'gmail',
    // host: 'smtp.ethereal.email',
    // port: 587,
    auth: {
        type: 'OAuth2',
        user: user,
        clientId:clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken
    }
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/
export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    // body of the email
    var email = {
        body : {
            name: username,
            intro : text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from : `smtp.ethereal.email`,
        to: userEmail,
        subject : subject || "Signup Successful",
        html : emailBody
    }

    // send mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "You should receive an email from us."})
        })
        .catch(error => res.status(500).send({ error }))

}

export const verifyChef = async (req, res) => {
  const { username, userEmail} = req.body;

  try {
    const generatedOTP = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 8080,
        path: `/api/generateOTP?username=${username}`,
        method: 'GET',
      };

      const request = http.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          const parsedData = JSON.parse(data);
          const generatedOTP = parsedData.code;
          resolve(generatedOTP);
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.end();
    });

    const verificationLink = `http://localhost:8080/api/verifyOTP?username=${username}&code=${generatedOTP}`;
    const email = {
        body: {
          name: username,
          intro: 'Please click on the button below to verify your account:',
          // action: {
          //   instructions: 'Verify Account',
          //   button: {
          //     color: '#22BC66',
          //     text: 'Verify',
          //     link: verificationLink,
          //   },
          // },
          outro: `Your code is ${generatedOTP}`,
        },
      };
    
    var emailBody = MailGenerator.generate(email);
    
    let message = {
        from : user,
        to: userEmail, // put real email
        subject : "Verification Email for SpaceFood",
        html : emailBody
    }
    
    // send mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "You should receive an email from us."})
        })
        .catch(error => {res.status(500).send({ error });console.log(error)})

    // let isVerified;

    // await new Promise((resolve, reject) => {```
    //   const options = {
    //     hostname: 'localhost',
    //     port: 8080,
    //     path: `/api/verifyOTP?username=${username}&code=${generatedOTP}`,
    //     method: 'GET',
    //   };

    //   const request = http.request(options, (response) => {
    //     let data = '';

    //     response.on('data', (chunk) => {
    //       data += chunk;
    //     });

    //     response.on('end', () => {
    //       const parsedData = JSON.parse(data);
    //       isVerified = parsedData.msg ;
    //       resolve();
    //     });
    //   });

    //   request.on('error', (error) => {
    //     reject(error);
    //   });

    //   request.end();
    // });
    // if (isVerified) {
    //   return res.status(200).send({ msg: "Verification successful" });
    // } else {
    //   return res.status(400).send({ error: "Invalid verification code" });
    // }
  } catch (error) {
    return res.status(500).send({ error: "Failed to verify OTP" });
  }
};


// export const sendEmail = async (req,res) =>{
//     const { username, userEmail} = req.body;
//     try{
//     const email = {
//             body: {
//               name: username,
//               intro: 'Please click on the button below to verify your account:',
//               action: {
//                 instructions: 'Verify Account',
//                 button: {
//                   color: '#22BC66',
//                   text: 'Verify',
//                   link: 'https:://twitch.tv',
//                 },
//               },
//               outro: 'Thank you for using our service.',
//             },
//           };
        
//         var emailBody = MailGenerator.generate(email);
        
//         let message = {
//             from : `smtp.ethereal.email`,
//             to: userEmail,
//             subject : "Verification Email for SpaceFood",
//             html : emailBody
//         }
        
//         // send mail
//         transporter.sendMail(message)
//             .then(() => {
//                 return res.status(200).send({ msg: "You should receive an email from us."})
//             })
//             .catch(error => res.status(500).send({ error }))
//         }catch(error){
//             res.status(500).send({error: "Error has occured"})
//         }
// }