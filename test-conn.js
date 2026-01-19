const https = require('node:https');

const url = "https://zlyxqefiemtoxbxvubjn.supabase.co/rest/v1/User?select=*&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseXhxZWZpZW10b3hieHZ1YmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTc0OTEsImV4cCI6MjA4NDM3MzQ5MX0.Oo9UlqUPiagLphn08LL5IKiHff2FclKXIhx6z2MHKtk";

console.log('Testing connection to:', url.substring(0, 50) + '...');

https.get(url, (res) => {
  console.log('StatusCode:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
});
