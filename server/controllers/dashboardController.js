const admin = require('firebase-admin');
const db = admin.firestore();

const customerCollection = db.collection('Users');
const itinerantCollection = db.collection('Itinerants');

exports.viewDashboard = async (req, res) => {
    try {
        // Get all active customers 
        const customersSnapshot = await customerCollection
            .where('status', '==', true)
            .orderBy('createdAt', 'desc')
            .get();
        
        // Count the number of active customers
        const activeCustomersCount = customersSnapshot.size;

        // Get all active itinerants
        const itinerantsSnapshot = await itinerantCollection
            .where('status', '==', true)
            .orderBy('createdAt', 'desc')
            .get();

        // Count the number of active customers
        const activeItinerantsCount = itinerantsSnapshot.size;

           // Get all inactive customers 
           const inactiveCustomersSnapshot = await customerCollection
           .where('status', '==', false)
           .orderBy('createdAt', 'desc')
           .get();
       
       // Count the number of active customers
       const inactiveCustomersCount = inactiveCustomersSnapshot.size;
      


        // Return the results
        res.send({ success: true, data: { activeCustomersCount, activeItinerantsCount, inactiveCustomersCount } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};