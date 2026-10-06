// Living Word - Firebase settings. Keep this in its own file so replacing index.html never wipes it.
window.LW_FB = {
  config: {
    apiKey: "AIzaSyBOZWRgEYDKG1TnfcxVtjEjmSAYkS5222Y",
    authDomain: "living-word-fb3c2.firebaseapp.com",
    projectId: "living-word-fb3c2",
    storageBucket: "living-word-fb3c2.firebasestorage.app",
    messagingSenderId: "526378335676",
    appId: "1:526378335676:web:fa33b10f3e5eccb840bfb9"
  },
  // Firestore collection names. They must match the paths allowed in your published rules.
  notesCollection: "lw_notes",
  versesCollection: "lw_verses",
  meetingsCollection: "lw_meetings"
};
