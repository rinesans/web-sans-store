import 'dotenv/config';

console.log('🔍 Testing Environment Variables...');

// Check all required environment variables
const requiredVars = {
   TOKOPAY_MERCHANT_ID: process.env.TOKOPAY_MERCHANT_ID,
   TOKOPAY_SECRET_KEY: process.env.TOKOPAY_SECRET_KEY,
   JWT_TOKEN: process.env.JWT_TOKEN,
};

console.log('\n📋 Environment Variables Status:');
Object.entries(requiredVars).forEach(([key, value]) => {
   const status = value ? '✅ SET' : '❌ MISSING';
   const displayValue = value ? `${value.substring(0, 10)}...` : 'undefined';
   console.log(`  ${key}: ${status} (${displayValue})`);
});

// Check if all variables are present
const missingVars = Object.entries(requiredVars).filter(([key, value]) => !value);

if (missingVars.length > 0) {
   console.log('\n❌ Missing Environment Variables:');
   missingVars.forEach(([key]) => {
      console.log(`  - ${key}`);
   });
   console.log('\n💡 Solution: Add these variables to your .env.local file');
} else {
   console.log('\n✅ All required environment variables are set!');
}

// Test JWT token format
const jwtToken = process.env.JWT_TOKEN;
if (jwtToken) {
   console.log('\n🔍 JWT Token Analysis:');
   console.log(`  Length: ${jwtToken.length} characters`);
   console.log(`  Format: ${jwtToken.split('.').length === 3 ? '✅ Valid JWT format' : '❌ Invalid JWT format'}`);
   console.log(`  Starts with: ${jwtToken.substring(0, 10)}...`);
}

console.log('\n🎯 Environment Check Complete!');
