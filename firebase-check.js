// FIREBASE CONFIGURATION CHECKER - Run this in browser console

console.log('🔍 FIREBASE CONFIGURATION CHECK');

function checkFirebaseConfig() {
  console.log('\n📋 CHECKING FIREBASE STATUS:');
  
  // Check environment variables
  console.log('\n🔧 ENVIRONMENT VARIABLES:');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Not set');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set');
  
  // Check if we're in demo mode
  const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "AIzaSyDemoKeyForDevelopmentOnly";
  
  console.log('\n🎯 MODE STATUS:');
  console.log('Demo Mode:', isDemoMode ? '❌ YES (Demo mode active)' : '✅ NO (Real Firebase)');
  
  if (isDemoMode) {
    console.log('\n📝 WHY DEMO MODE:');
    console.log('- Firebase API key not configured');
    console.log('- Using demo credentials');
    console.log('- Sign-in will use mock authentication');
    
    console.log('\n🔧 TO ENABLE REAL FIREBASE:');
    console.log('1. Create Firebase project: https://console.firebase.google.com/');
    console.log('2. Enable Google Authentication');
    console.log('3. Add these to .env.local:');
    console.log('   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...your_real_key');
    console.log('   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com');
    console.log('   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id');
    console.log('   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com');
    console.log('   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012');
    console.log('   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc...');
    console.log('4. Restart development server');
    
  } else {
    console.log('\n✅ FIREBASE CONFIGURED:');
    console.log('- Real Firebase authentication should work');
    console.log('- Google sign-in will use real OAuth');
    console.log('- User data will come from Google');
  }
  
  // Test sign-in button
  console.log('\n🧪 TESTING SIGN-IN:');
  const signInButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent?.toLowerCase().includes('sign in') || 
    btn.textContent?.toLowerCase().includes('google')
  );
  
  if (signInButton) {
    console.log('Sign-in button found: ✅');
    console.log('Click it to test authentication');
    
    // Add click listener to show what mode we're in
    signInButton.addEventListener('click', () => {
      console.log(`🔐 Sign-in clicked - Mode: ${isDemoMode ? 'DEMO' : 'REAL FIREBASE'}`);
    });
  } else {
    console.log('Sign-in button found: ❌');
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`Current Mode: ${isDemoMode ? 'Demo Mode' : 'Real Firebase'}`);
  console.log(`Sign-in Type: ${isDemoMode ? 'Mock Authentication' : 'Google OAuth'}`);
  console.log(`Next Step: ${isDemoMode ? 'Configure Firebase' : 'Test Real Sign-In'}`);
}

// Auto-run the check
checkFirebaseConfig();

console.log('\n💡 TIP: Run this command in console to check again:');
console.log('checkFirebaseConfig()');
