const sslCertificate = require('get-ssl-certificate')

// Computes the validity of the cert.
function check_validity(valid_to){
	const currentDate = new Date();
	const oneDay = 24 * 60 * 60 * 1000;  
	const parsedDate = Date.parse(valid_to);
	
	return Math.round(Math.abs((parsedDate - currentDate) / oneDay));
}
// Information required
// Hostname
// Valid from
// Valid until
// Days until expiry
// Cert Issuer
// SAN
// Location
// return a Json formated result
async function getCertInfo(hosts){
	  
	var all_cert_info = [];

	await hosts.forEach(host =>{
    	// getCertInfo(host)
		 sslCertificate.get(host).then(function (certificate) {
		
		  let valid_from = certificate.valid_from;
		  let valid_to = certificate.valid_to;
		  let days_until_expiry = check_validity(valid_to);
		  let string = JSON.stringify(certificate.issuer);
		  let objectValue = JSON.parse(string);
		  let cert_issuer = objectValue['O'];
		  let location = objectValue['L'];
		  let cert_info = {};
		  		  
		  cert_info = {
			  hostname : host,
			  issuer : cert_issuer,
			  loc : location,
			  sans : certificate.subjectaltname,
			  issued : valid_from,
			  until: valid_to,
			  expiring_in : days_until_expiry
		  };
		  console.log(cert_info);
		  all_cert_info.push(cert_info);
		});
	});

	console.log(all_cert_info.length);
	return all_cert_info;

}



var hosts = ['letsencrypt.org','google.com','apple.com','theverge.com']

var cert_info = getCertInfo(hosts);
console.log(cert_info.length)
for(let i  = 0 ; i < cert_info.length ; i ++) {
	console.log(cert_info[i]);
}