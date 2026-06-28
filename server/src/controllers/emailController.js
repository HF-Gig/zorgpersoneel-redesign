import { sendEmail } from '../utils/email.js';

export const sendContactEmail = async (req, res, next) => {
  try {
    const {
      naam_instelling,
      contactpersoon,
      email,
      telefoon,
      type_instelling,
      specialisatie,
      aantal,
      startdatum,
      tijdvak,
      urgentie,
      informatie,
      token
    } = req.body;

    // Verify Turnstile token first
    const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`
    });
    const verifyData = await verifyResponse.json();
    if (!verifyData.success) {
      return res.status(400).json({ error: 'Spam protection verification failed' });
    }

    // Validate that all fields are present
    if (
      !naam_instelling ||
      !contactpersoon ||
      !email ||
      !telefoon ||
      !type_instelling ||
      !specialisatie ||
      !aantal ||
      !startdatum ||
      !tijdvak ||
      !urgentie ||
      !informatie
    ) {
      return res.status(400).json({ error: 'All fields are compulsory' });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nieuwe Personeelsaanvraag</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #fafafa; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Container Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); border: 1px solid #f1f1f1;">
                
                <!-- Gradient Header Banner -->
                <tr>
                  <td style="background: linear-gradient(135deg, #ab5c9d 0%, #2c7ab9 100%); padding: 35px 40px; text-align: left;">
                    <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, 0.75); letter-spacing: 2px; text-transform: uppercase;">Zorginstelling Portal</span>
                    <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2;">Nieuwe Personeelsaanvraag</h1>
                  </td>
                </tr>
                
                <!-- Content Body -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4a5568;">
                      Hallo team, er is zojuist een nieuwe personeelsaanvraag ingediend via de website. Hieronder vindt u de details van de aanvraag:
                    </p>
                    
                    <!-- Info Table -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 30px;">
                      <tbody>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; width: 180px; vertical-align: top;">Naam instelling</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${naam_instelling}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Contactpersoon</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${contactpersoon}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">E-mailadres</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #2c7ab9; font-weight: 600; vertical-align: top;"><a href="mailto:${email}" style="color: #2c7ab9; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Telefoonnummer</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;"><a href="tel:${telefoon}" style="color: #1a202c; text-decoration: none;">${telefoon}</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Type instelling</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${type_instelling}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Gewenste specialisatie</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${specialisatie}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Aantal medewerkers</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${aantal}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Gewenste startdatum</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${startdatum}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Tijdvak</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${tijdvak}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Urgentieniveau</td>
                          <td style="padding: 14px 0; font-size: 14px; vertical-align: top;">
                            <span style="display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: 600; border-radius: 12px; ${
                              urgentie.toLowerCase().includes('urgent') || urgentie.toLowerCase().includes('nood')
                                ? 'background-color: #ffeeee; color: #e53e3e;'
                                : 'background-color: #edf2f7; color: #4a5568;'
                            }">${urgentie}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 0 0 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Aanvullende informatie</td>
                          <td style="padding: 14px 0 0 0; font-size: 14px; color: #1a202c; line-height: 1.5; font-weight: 500; vertical-align: top;">${informatie}</td>
                        </tr>
                      </tbody>
                    </table>
      
                    <!-- Reply Action Button -->
                    <div style="text-align: center; margin-top: 10px;">
                      <a href="mailto:${email}" style="display: inline-block; background-color: #2c7ab9; color: #ffffff; padding: 14px 30px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 30px; box-shadow: 0 4px 12px rgba(44, 122, 185, 0.25);">Beantwoord direct</a>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f7fafc; padding: 25px 40px; text-align: center; border-top: 1px solid #edf2f7;">
                    <p style="margin: 0; font-size: 12px; color: #a0aec0; line-height: 1.5;">
                      Dit is een automatisch verzonden bericht van Zorgpersoneel Redesign.<br>
                      U kunt direct antwoorden op deze e-mail om contact op te nemen met de aanvrager.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'freezygig@gmail.com';

    const result = await sendEmail({
      senderEmail,
      senderName: `${contactpersoon} (${email})`,
      receiverEmail: 'freezygig@gmail.com',
      receiverName: 'FreezyGig',
      replyTo: {
        email,
        name: contactpersoon
      },
      subject: `Nieuwe Personeelsaanvraag van ${naam_instelling}`,
      message: htmlContent
    });

    res.status(200).json({ message: 'Email sent successfully', data: result });
  } catch (error) {
    next(error);
  }
};

export const sendZorgverlenerEmail = async (req, res, next) => {
  try {
    const {
      voornaam,
      achternaam,
      email,
      telefoon,
      woonplaats,
      regio,
      beroep,
      ervaring,
      over_uzelf,
      cv,
      token
    } = req.body;

    // Verify Turnstile token first
    const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`
    });
    const verifyData = await verifyResponse.json();
    if (!verifyData.success) {
      return res.status(400).json({ error: 'Spam protection verification failed' });
    }

    // Validate fields
    if (
      !voornaam ||
      !achternaam ||
      !email ||
      !telefoon ||
      !woonplaats ||
      !regio ||
      !beroep ||
      !ervaring ||
      !over_uzelf ||
      !cv ||
      !cv.content ||
      !cv.name
    ) {
      return res.status(400).json({ error: 'All fields, including CV, are compulsory' });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nieuwe Zorgverlener Aanmelding</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #fafafa; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Container Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); border: 1px solid #f1f1f1;">
                
                <!-- Gradient Header Banner -->
                <tr>
                  <td style="background: linear-gradient(135deg, #ab5c9d 0%, #2c7ab9 100%); padding: 35px 40px; text-align: left;">
                    <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, 0.75); letter-spacing: 2px; text-transform: uppercase;">Zorgverlener Portal</span>
                    <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2;">Nieuwe Aanmelding</h1>
                  </td>
                </tr>
                
                <!-- Content Body -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4a5568;">
                      Hallo team, er is een nieuwe aanmelding ontvangen van een zorgverlener. Hieronder vindt u de details:
                    </p>
                    
                    <!-- Info Table -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 30px;">
                      <tbody>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; width: 180px; vertical-align: top;">Naam</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${voornaam} ${achternaam}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">E-mailadres</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #2c7ab9; font-weight: 600; vertical-align: top;"><a href="mailto:${email}" style="color: #2c7ab9; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Telefoonnummer</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;"><a href="tel:${telefoon}" style="color: #1a202c; text-decoration: none;">${telefoon}</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Woonplaats</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${woonplaats} (${regio})</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Beroep / Specialisatie</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${beroep}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Jaren ervaring</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${ervaring} jaar</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #edf2f7;">
                          <td style="padding: 14px 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">CV bestand</td>
                          <td style="padding: 14px 0; font-size: 14px; color: #1a202c; font-weight: 500; vertical-align: top;">${cv.name} (bijgevoegd)</td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 0 0 0; font-size: 14px; font-weight: 600; color: #718096; vertical-align: top;">Over zichzelf</td>
                          <td style="padding: 14px 0 0 0; font-size: 14px; color: #1a202c; line-height: 1.5; font-weight: 500; vertical-align: top;">${over_uzelf}</td>
                        </tr>
                      </tbody>
                    </table>
      
                    <!-- Reply Action Button -->
                    <div style="text-align: center; margin-top: 10px;">
                      <a href="mailto:${email}" style="display: inline-block; background-color: #2c7ab9; color: #ffffff; padding: 14px 30px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 30px; box-shadow: 0 4px 12px rgba(44, 122, 185, 0.25);">Beantwoord direct</a>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f7fafc; padding: 25px 40px; text-align: center; border-top: 1px solid #edf2f7;">
                    <p style="margin: 0; font-size: 12px; color: #a0aec0; line-height: 1.5;">
                      Dit is een automatisch verzonden bericht van Zorgpersoneel Redesign.<br>
                      U kunt direct antwoorden op deze e-mail om contact op te nemen met de aanvrager.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'freezygig@gmail.com';

    const result = await sendEmail({
      senderEmail,
      senderName: `${voornaam} ${achternaam} (${email})`,
      receiverEmail: 'freezygig@gmail.com',
      receiverName: 'FreezyGig',
      replyTo: {
        email,
        name: `${voornaam} ${achternaam}`
      },
      subject: `Nieuwe Zorgverlener Aanmelding van ${voornaam} ${achternaam}`,
      message: htmlContent,
      attachments: [
        {
          content: cv.content,
          name: cv.name
        }
      ]
    });

    res.status(200).json({ message: 'Email sent successfully', data: result });
  } catch (error) {
    next(error);
  }
};

