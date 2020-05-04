const sslCertificate = require('get-ssl-certificate')

// Computes the validity of the cert.
function check_validity(valid_to){
	const currentDate = new Date();
	const oneDay = 24 * 60 * 60 * 1000;  
	const parsedDate = Date.parse(valid_to);
	
	return Math.round(Math.abs((parsedDate - currentDate) / oneDay));
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
async function certificateMetadata(hostname){
	new Promise( async (resolve, reject) => {
		let certData = 	await sslCertificate.get(hostname).then(function (certificate) {

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
		  return cert_info;
		});
		if (!isObjEmpty(certData)){
			resolve(certData);
		} else {
			reject('The hosts SSL cert could not be retrieved');
		}
	});
}

async function getCertInfo(hosts){

	let all_certs = [];	 
	 for (const host of hosts) { 
		let certInfo = await certificateMetadata(host)	
		all_certs.push(certInfo);
		}
	 
	return all_certs; 
}

var hosts = ['letsencrypt.org','google.com','apple.com','theverge.com']

async function notify_about_expiring_certs(hosts){
	let arr_cert_metadat = await getCertInfo(hosts); 
	arr_cert_metadat.forEach( certData => {
		console.log(certData.expiring_in);
	})
}
notify_about_expiring_certs(hosts);