// Test Environment Variables
console.log('🔍 Checking environment variables...');

// Check if NEXT_PUBLIC_JWT_TOKEN exists
const jwtToken = process.env.NEXT_PUBLIC_JWT_TOKEN;
console.log('JWT Token present:', jwtToken ? 'YES' : 'NO');
console.log('JWT Token length:', jwtToken ? jwtToken.length : 0);
console.log('JWT Token preview:', jwtToken ? jwtToken.substring(0, 20) + '...' : 'NONE');

// Check other environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log(
   'All env vars starting with NEXT_PUBLIC_:',
   Object.keys(process.env).filter((key) => key.startsWith('NEXT_PUBLIC_'))
);
