const sslCertificate = require('get-ssl-certificate')

// Example hosts that get analyzed
var hosts = ['letsencrypt.org','google.com','apple.com','theverge.com', 'expired.badssl.com']

/**
 * Computes the validity of the cert.
 * @param {string} - The valid_to string contains the date of when the certificate expires.hostname
 * @returns {number} - The number of days it's valid/invalid.
 */
function check_validity(valid_to){
	const currentDate = new Date(Date.now());
	const oneDay = 24 * 60 * 60 * 1000;  
	let parsedDate = Date.parse(valid_to);
	let expiryDate = new Date(parsedDate)

	if (Date.parse(currentDate) < parsedDate) {
		return Math.round(Math.abs((expiryDate - currentDate) / oneDay));
	} else if (Date.parse(currentDate) > parsedDate) {
		return Math.round((expiryDate - currentDate) / oneDay);
	}
}

/**
 * Function to check if the object is empty
 * @param {object} - The object containing certificate metadata.
 * @returns {boolean} - Boolean value for if an object is empty or not.
 */
function isObjEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

/**
 * Main function that fetches the metadata of a certificate.
 * Hostname
 * Valid from
 * Valid until
 * Days until expiry
 * Cert Issuer
 * SAN
 * Location
 * Returns an object formated result
 * @param {string} - The hostname that we fetch certificate information from.
 * @returns {object} - The object contains the metadata for the certificate. 
 */
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
				valid_until: valid_to,
				expiring_in : days_until_expiry
			};
		 res(cert_info);
		});
	});
}

/**
 * Stores all the cert's that were fetched into an array of objects.
 * @param {Array} - Array containing hostnames.
 * @returns {Promise} - Returns a promise that contains array of certifcate objects.
 */ 
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

/**
 *  Generates a response based on the cert being valid/invalid.
 *  @param {Array} certData - Array that contains certificate metadata objects.
 */
function validateCertificates(certData){
	certData.forEach(certInfo => {
		if (certInfo.expiring_in >= 1){
			console.log('\n ------------------------------------------------------');
			console.log(`The certificate for ${ certInfo.hostname } is valid!`);
			console.log(`Cert expires in ${ certInfo.expiring_in } days.`);
			console.log(`Valid until ${ certInfo.valid_until }.`)

		}else if (certInfo.expiring_in <= 0 ){
			console.log('\n ------------------------------------------------------');
			console.log(`The certificate for ${ certInfo.hostname } has expired!`);
			console.log(`Days since expiry ${ certInfo.expiring_in }.`);
			console.log(`Expired in ${ certInfo.valid_until }.`);
		}	
	});
}

// Main execution of the functions.
storeAllCertInfo(hosts).then((certDataArr) => {
	validateCertificates(certDataArr);	
});