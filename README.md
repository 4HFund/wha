# Luau Manor Resident Hub

## FormSubmit testing and troubleshooting

Use these steps to verify deliverability and capture diagnostics for IT:

1. Visit `/debug/formsubmit.html` (add `?debug=true` if you also want fetch interception on other pages).
2. Fill the test form and click **Send test via fetch** to log HTTP status and response in the page. If the response is not OK or the network fails, a mail draft to `sidney@wheelingwv-pha.org` will open with the form details.
3. After a successful response, confirm messages arrive at **sidney@wheelingwv-pha.org** and CC **sidney.mozingo@gmail.com**.
4. Screenshot for IT: include the timestamp, the sending domain (`wheelingwv-pha.org`), the subject `Luau Manor - FormSubmit Debug Test`, the HTTP status/response text, and the inbox headers showing which address received it.

For live pages, append `?debug=true` to the URL to turn on fetch-based logging without disrupting the normal POST flow. If FormSubmit returns a non-OK status or the network fails, the site will prompt to open an email draft fallback to `sidney@wheelingwv-pha.org` with the entered form details.
