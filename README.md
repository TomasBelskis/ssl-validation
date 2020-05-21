# SSL Validation Reporting App
Simple application that checks ssl validity of set list of hosts.

### Modules used
- https://www.npmjs.com/package/get-ssl-certificate

### Usage
Update the `hosts = []` array with the websites that you want to validate the ssl certs for.

### Sample output
 ~/Dev/P/ssl-validation master !1 ▓▒░ node ssl-validation.js                             ░▒▓ ✔  51s  09:13:53 

 ------------------------------------------------------
The certificate for letsencrypt.org is valid!
Cert expires in 85 days.
Valid until Aug 14 17:00:20 2020 GMT.

 ------------------------------------------------------
The certificate for google.com is valid!
Cert expires in 61 days.
Valid until Jul 21 07:43:41 2020 GMT.

 ------------------------------------------------------
The certificate for apple.com is valid!
Cert expires in 60 days.
Valid until Jul 20 12:00:00 2020 GMT.

 ------------------------------------------------------
The certificate for theverge.com is valid!
Cert expires in 274 days.
Valid until Feb 18 21:35:35 2021 GMT.

 ------------------------------------------------------
The certificate for expired.badssl.com has expired!
Days since expiry -1865.
Expired in Apr 12 23:59:59 2015 GMT.