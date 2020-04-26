const sslCertificate = require('get-ssl-certificate')

// Information required
// Hostname
// Valid from
// Valid until
// Days until expiry
// Cert Issuer
// SAN
// Location

sslCertificate.get('google.com').then(function (certificate) {
  var host_ssl_info = {};
  var hostname = 'google.com';
  var valid_from = certificate.valid_from;
  var valid_to = certificate.valid_to;
  var days_until_expiry = 0;
  var string = JSON.stringify(certificate.issuer);
  var objectValue = JSON.parse(string);
  var cert_issuer = objectValue['O'];
  var location = objectValue['L'];
  //console.log(certificate)
  // certificate is a JavaScript object
  
	
console.log(cert_issuer)
console.log('### SSL Certificate Information ###')
console.log('Hostname: ' + hostname )
console.log('\t Valid from: ' + valid_from)
console.log('\t Valid to: ' + valid_to)
console.log('\t Days till expiry: ' + days_until_expiry)
console.log('\t Certificate issues: ' + cert_issuer)
console.log('\t Location: ' + location)
console.log('\t Site Alternative Names:\n\t ' + certificate.subjectaltname + '\n')
 
// console.log(certificate.subjectaltname)
  // { C: 'GB',
  //   ST: 'Greater Manchester',
  //   L: 'Salford',
  //   O: 'COMODO CA Limited',
  //   CN: 'COMODO RSA Domain Validation Secure Server CA' }

  //console.log(certificate.valid_from)
  // 'Aug  14 00:00:00 2017 GMT'

  // console.log(certificate.valid_to)
  // 'Nov 20 23:59:59 2019 GMT'

  // If there was a certificate.raw attribute, then you can access certificate.pemEncoded
  //console.log(certificate.pemEncoded)
  // -----BEGIN CERTIFICATE-----
  // ...
  // -----END CERTIFICATE-----
});
