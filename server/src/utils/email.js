/**
 * Sends an email using Brevo's Transactional Email API.
 * 
 * @param {Object} options
 * @param {string} options.senderEmail - The email address of the sender.
 * @param {string} [options.senderName] - The name of the sender (optional).
 * @param {string} options.receiverEmail - The email address of the receiver.
 * @param {string} [options.receiverName] - The name of the receiver (optional).
 * @param {string} options.subject - The subject line of the email.
 * @param {string} options.message - The content of the email. Can be HTML or plain text.
 * @param {Array<Object>} [options.attachments] - Optional attachments.
 * @param {string|Buffer} options.attachments[].content - Base64 encoded file content OR a Buffer.
 * @param {string} options.attachments[].name - The filename with extension (e.g. 'invoice.pdf', 'photo.png').
 * @returns {Promise<Object>} - The response from Brevo API.
 */
export async function sendEmail({
  senderEmail,
  senderName,
  receiverEmail,
  receiverName,
  subject,
  message,
  attachments = [],
  replyTo
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not defined in the environment variables.');
  }

  // Format attachments to match Brevo's API spec
  const formattedAttachments = attachments.map(att => {
    let base64Content = '';
    if (Buffer.isBuffer(att.content)) {
      base64Content = att.content.toString('base64');
    } else if (typeof att.content === 'string') {
      // Check if it's already base64 or if it's a raw string (if raw, encode it)
      const isBase64 = /^[a-zA-Z0-9+/]*={0,2}$/.test(att.content) && att.content.length % 4 === 0;
      base64Content = isBase64 ? att.content : Buffer.from(att.content).toString('base64');
    } else {
      throw new Error(`Invalid attachment content type for file: ${att.name}. Must be a Buffer or base64 string.`);
    }

    return {
      content: base64Content,
      name: att.name
    };
  });

  // Determine HTML vs text content
  const isHtml = /<[a-z][\s\S]*>/i.test(message);
  const emailPayload = {
    sender: {
      email: senderEmail,
      ...(senderName && { name: senderName })
    },
    to: [
      {
        email: receiverEmail,
        ...(receiverName && { name: receiverName })
      }
    ],
    ...(replyTo && { replyTo }),
    subject,
    ...(isHtml ? { htmlContent: message } : { textContent: message }),
    ...(formattedAttachments.length > 0 && { attachment: formattedAttachments })
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify(emailPayload)
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Brevo API error (${response.status}): ${responseData.message || JSON.stringify(responseData)}`);
  }

  return responseData;
}
