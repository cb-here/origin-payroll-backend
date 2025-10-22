export const passwordResetTemplate = (resetUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - Origin Payroll System</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">

              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                     Origin Payroll System
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                    Streamline Your Documentation
                  </p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                    Password Reset Request
                  </h2>

                  <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                    ${userName ? `Hi ${userName},` : "Hello,"}
                  </p>

                  <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                    We received a request to reset your password for your  Origin Payroll System account. If you didn't make this request, you can safely ignore this email.
                  </p>

                  <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                    To reset your password, click the button below:
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 0 0 30px 0;">
                        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 16px 20px; margin: 0 0 30px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #2d3748; font-size: 14px; line-height: 1.6;">
                      <strong>Note:</strong> This link will expire in <strong>1 hour</strong> for security reasons.
                    </p>
                  </div>

                  <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px; line-height: 1.6;">
                    If the button doesn't work, copy and paste this link into your browser:
                  </p>

                  <p style="margin: 0 0 30px 0; padding: 12px; background-color: #f7fafc; border-radius: 4px; word-break: break-all; font-family: 'Courier New', monospace; font-size: 13px; color: #667eea;">
                    ${resetUrl}
                  </p>

                  <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
                    <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.6;">
                      If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                    © ${new Date().getFullYear()}  Origin Payroll System. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                    This is an automated email. Please do not reply.
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
};

export const passwordResetTextTemplate = (resetUrl, userName) => {
  return `
Password Reset Request -  Origin Payroll System

${userName ? `Hi ${userName},` : "Hello,"}

We received a request to reset your password for your  Origin Payroll System account.

To reset your password, please visit the following link:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email.

---
© ${new Date().getFullYear()}  Origin Payroll System. All rights reserved.
This is an automated email. Please do not reply.
  `.trim();
};

export const paymentNotificationTemplate = ({
  providerName,
  periodStart,
  periodEnd,
  visits,
  totalAmount,
  visitRateTotal,
  surchargeTotal,
}) => {
  const visitRows = visits
    .map(
      (visit) => `
    <tr>
  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #000;">
    ${visit.visitDate}
  </td>
  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #000;">
    ${visit.patientName}
  </td>
  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #000;">
    ${visit.task}
  </td>
  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #000;">
    $${visit.visitRate.toFixed(2)}
  </td>
  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #000;">
    $${visit.surcharge.toFixed(2)}
  </td>
  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #000;">
    $${visit.total.toFixed(2)}
  </td>
</tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Summary</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 800px; margin: 0 auto; padding: 24px;">
    <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">

      <!-- Main Content -->
      <div style="margin-bottom: 24px;">
        <h2 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 16px 0;">Payment Summary</h2>
        <p style="color: #6b7280; font-size: 16px; margin: 0 0 12px 0;">
          Dear ${providerName},
        </p>
        <p style="color: #6b7280; font-size: 16px; margin: 0;">
          Your payment summary for the period <strong style="color: #111827;">${periodStart} - ${periodEnd}</strong>:
        </p>
      </div>

      <!-- Visit Details Section -->
      <div style="margin-bottom: 24px;">
        <h3 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">Visit Details:</h3>
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600; font-size: 14px;">Date</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600; font-size: 14px;">Patient Name</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600; font-size: 14px;">Task</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600; font-size: 14px;">Visit Rate</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600; font-size: 14px;">Surcharge</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600; font-size: 14px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${visitRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Summary Box -->
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
  <h3 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">Summary:</h3>

  <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
    <p style="color: #6b7280; margin: 0;">Total Visits:</p>
    <p style="color: #111827; font-weight: 500; margin: 0; text-align: right; flex: 1;">${
      visits.length
    }</p>
  </div>

  <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
    <p style="color: #6b7280; margin: 0;">Visit Rate Total:</p>
    <p style="color: #111827; font-weight: 500; margin: 0; text-align: right; flex: 1;">$${visitRateTotal.toFixed(
      2
    )}</p>
  </div>

  <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
    <p style="color: #6b7280; margin: 0;">Surcharge Total:</p>
    <p style="color: #111827; font-weight: 500; margin: 0; text-align: right; flex: 1;">$${surchargeTotal.toFixed(
      2
    )}</p>
  </div>

  <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
    <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0;">Total Payment:</p>
    <p style="color: #3b82f6; font-size: 18px; font-weight: 700; margin: 0; text-align: right; flex: 1;">$${totalAmount.toFixed(
      2
    )}</p>
  </div>
</div>


      <!-- Footer -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 14px; color: #6b7280;">
        <p style="margin: 0 0 8px 0;">This payment will be processed within 2-3 business days.</p>
        <p style="margin: 0 0 16px 0;">Thank you for your service.</p>
        <p style="margin: 0; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          Healthcare Payment Processing System
        </p>
      </div>

    </div>
  </div>
</body>
</html>
  `;
};

export const paymentNotificationTextTemplate = ({
  providerName,
  periodStart,
  periodEnd,
  visits,
  totalAmount,
  visitRateTotal,
  surchargeTotal,
}) => {
  const visitLines = visits
    .map(
      (visit, index) =>
        `${index + 1}. ${visit.visitDate} - ${visit.patientName} - ${
          visit.task
        } - Visit Rate: $${visit.visitRate.toFixed(
          2
        )} - Surcharge: $${visit.surcharge.toFixed(
          2
        )} - Total: $${visit.total.toFixed(2)}`
    )
    .join("\n");

  return `
Payment Notification

Dear ${providerName},

This is a notification regarding your payment for the period ${periodStart} to ${periodEnd}.

PAYMENT SUMMARY
---------------
Total Visits: ${visits.length}
Visit Rate Total: $${visitRateTotal.toFixed(2)}
Surcharge Total: $${surchargeTotal.toFixed(2)}
Total Amount: $${totalAmount.toFixed(2)}

VISIT DETAILS
-------------
${visitLines}

Total: $${totalAmount.toFixed(2)}

If you have any questions regarding this payment notification, please contact us.

© ${new Date().getFullYear()} Healthcare Payment Processing System. All rights reserved.
  `;
};
