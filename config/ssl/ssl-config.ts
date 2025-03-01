import fs from 'fs';
import path from 'path';

interface SSLConfig {
  key: Buffer;
  cert: Buffer;
  ca?: Buffer[];
}

export function getSSLConfig(): SSLConfig {
  const sslKeyPath = process.env.SSL_KEY_PATH || path.join(__dirname, 'certs', 'server.key');
  const sslCertPath = process.env.SSL_CERT_PATH || path.join(__dirname, 'certs', 'server.crt');
  const sslCaPath = process.env.SSL_CA_PATH;

  try {
    const config: SSLConfig = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
    };

    if (sslCaPath) {
      config.ca = [fs.readFileSync(sslCaPath)];
    }

    return config;
  } catch (error) {
    throw new Error(`Failed to load SSL certificates: ${error.message}`);
  }
}

export function validateSSLCertificate(config: SSLConfig): void {
  const tls = require('tls');

  try {
    // Create a test server to validate the certificate
    const server = tls.createServer(config, () => {});
    server.close();
  } catch (error) {
    throw new Error(`Invalid SSL certificate: ${error.message}`);
  }

  // Check certificate expiration
  const x509 = new (require('node-forge')).pki.certificateFromPem(config.cert.toString());
  const expirationDate = new Date(x509.validity.notAfter);
  const now = new Date();
  const daysUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiration <= 0) {
    throw new Error('SSL certificate has expired');
  }

  if (daysUntilExpiration <= 30) {
    console.warn(`Warning: SSL certificate will expire in ${daysUntilExpiration} days`);
  }
}

export function generateSelfSignedCertificate(): SSLConfig {
  const forge = require('node-forge');
  const pki = forge.pki;

  // Generate a new key pair
  const keys = pki.rsa.generateKeyPair(2048);

  // Create a new certificate
  const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  // Add certificate attributes
  const attrs = [{
    name: 'commonName',
    value: 'localhost'
  }, {
    name: 'countryName',
    value: 'US'
  }, {
    shortName: 'ST',
    value: 'California'
  }, {
    name: 'localityName',
    value: 'San Francisco'
  }, {
    name: 'organizationName',
    value: 'Wick & Wax Co'
  }, {
    shortName: 'OU',
    value: 'Development'
  }];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  // Sign the certificate
  cert.sign(keys.privateKey);

  // Convert to PEM format
  const privateKeyPem = pki.privateKeyToPem(keys.privateKey);
  const certificatePem = pki.certificateToPem(cert);

  return {
    key: Buffer.from(privateKeyPem),
    cert: Buffer.from(certificatePem)
  };
}

export function setupHTTPS(app: any): void {
  const https = require('https');
  const sslConfig = getSSLConfig();
  validateSSLCertificate(sslConfig);

  const server = https.createServer(sslConfig, app);
  const port = process.env.HTTPS_PORT || 443;

  server.listen(port, () => {
    console.log(`HTTPS server running on port ${port}`);
  });

  // Redirect HTTP to HTTPS
  const http = require('http');
  http.createServer((req: any, res: any) => {
    res.writeHead(301, {
      Location: `https://${req.headers.host}${req.url}`
    });
    res.end();
  }).listen(80);
}
