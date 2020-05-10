const sslCertificate = require('get-ssl-certificate')

var hosts = ['letsencrypt.org','google.com','apple.com','theverge.com', 'expired.badssl.com']

// Computes the validity of the cert.
function check_validity(valid_to){
	const currentDate = new Date(Date.now());
	const oneDay = 24 * 60 * 60 * 1000;  
	console.log(`Valid to: ${valid_to}`);
	let parsedDate = Date.parse(valid_to);
	let expiryDate = new Date(parsedDate)


	if (Date.parse(currentDate) < parsedDate)
	{
	 return Math.round(Math.abs((expiryDate - currentDate) / oneDay));
	}else if (Date.parse(currentDate) > parsedDate){
		// console.log('Current dates epoch: ' + Date.parse(currentDate))
		// console.log('ExpiryDate: ' + expiryDate);
		return Math.round((expiryDate - currentDate) / oneDay);
	}
}

function isObjEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
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
function fetchCertInfo(hostname){
		return new Promise ((res, rej) => {
			sslCertificate.get(hostname).then(function (certificate) {

				let valid_from = certificate.valid_from;
				let valid_to = certificate.valid_to;
				let days_until_expiry = check_validity(valid_to);
				let string = JSON.stringify(certificate.issuer);
				let objectValue = JSON.parse(string);
				let cert_issuer = objectValue['O'];
				let location = objectValue['L'];
				let cert_info = {};
			
				cert_info = {
					hostname : hostname,
					issuer : cert_issuer,
					loc : location,
					sans : certificate.subjectaltname,
					issued : valid_from,
					until: valid_to,
					expiring_in : days_until_expiry
				};
			 res(cert_info);
			});
		});
}

async function storeAllCertInfo(hosts){
		let all_certs = [];	 
			for (const hostname of hosts) { 
			   let certInfo = await fetchCertInfo(hostname);
			   all_certs.push(certInfo);
			   }
	return new Promise((res, rec) => {
		res(all_certs);
	});
}

async function notify_about_expiring_certs(certDataArr){
	certDataArr.forEach(certInfo => {
		if (check_validity(certInfo.expiring_in) >= 1){
			console.log(`The certificate for ${ certInfo.hostname } is valid!`);
			console.log(`Cert expires in ${ certInfo.expiring_in }`);

		}else if (check_validity(certInfo.expiring_in) <= 0 ){
			console.log(`The certificate for ${ certInfo.hostname }has expired!`);
			console.log(`Days since expiry ${ certInfo.expiring_in }.`);
			console.log(`Expired in ${ certInfo.until }`);
		}	
	});
}
storeAllCertInfo(hosts).then((certDataArr) => {
	notify_about_expiring_certs(certDataArr);	
});