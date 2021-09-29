// Packages:
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'


// Constants:
const firebaseConfig = {
  apiKey: 'AIzaSyCuRgowqWimMDoKxXdAJ3gU3K3uANx_43c',
  authDomain: 'jessyapp-hq.firebaseapp.com',
  projectId: 'jessyapp-hq',
  storageBucket: 'jessyapp-hq.appspot.com',
  messagingSenderId: '56155904134',
  appId: '1:56155904134:web:c4a76f61611a3741ea5907',
  measurementId: 'G-7SWL0VJCPN'
};


// Functions:
const app = initializeApp(firebaseConfig);
getAnalytics(app)
