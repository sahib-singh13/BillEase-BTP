// src/Pages/WarrantySubmitPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUser, FaBoxOpen, FaCalendarAlt, FaBuilding, FaHeadset, FaPaperPlane, FaSpinner, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming you have this component

// --- Configuration ---
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
if (!GOOGLE_MAPS_API_KEY) {
    console.error("CRITICAL: REACT_APP_GOOGLE_MAPS_API_KEY is not set in .env file. Map functionality WILL FAIL.");
}
const mapLibraries = ['places']; // Specify Places API library
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Default map center (India)
const defaultZoom = 2;
console.log("Google Maps API Key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

const WarrantySubmitPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Get data passed via navigation state, provide defaults
    const { billData, selectedItem, companyName, currentUser } = location.state || {};

    // --- State ---
    const [isSubmitting, setIsSubmitting] = useState(false); // For the final "Submit Request" button
    const [userLocation, setUserLocation] = useState(null); // { lat: number, lng: number } - User's coords
    const [serviceCenters, setServiceCenters] = useState([]); // Array of found place results
    const [mapCenter, setMapCenter] = useState(defaultCenter); // Current center of the map
    const [mapZoom, setMapZoom] = useState(defaultZoom); // Current map zoom level
    const [mapError, setMapError] = useState(null); // Stores map/places related errors for display
    const [mapInstance, setMapInstance] = useState(null); // Holds the map object instance
    const [isLoadingPage, setIsLoadingPage] = useState(true); // Initial loading for data validation
    const [isSearchingPlaces, setIsSearchingPlaces] = useState(false); // Loading indicator for Places search
    const [searchAttempted, setSearchAttempted] = useState(false); // Ensure search runs only once conditions met

    // --- Google Maps Loader Hook ---
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY, // Pass the key here
        libraries: mapLibraries,
        id: 'google-map-script-warranty-submit-final-v2', // Unique ID
    });

    // --- Effects ---

    // 1. Validate essential data on mount and redirect if missing
    useEffect(() => {
        // Check immediately, no need for timeout if data comes from state
        if (!billData?._id || !selectedItem?.itemName || !companyName || !currentUser?.email) {
            console.error("WarrantySubmitPage: Missing required data in location state.", location.state);
            toast.error("Missing warranty claim details. Redirecting...");
            navigate('/customerDashboard', { replace: true });
            // No need to set isLoadingPage false if redirecting
        } else {
            setIsLoadingPage(false); // Mark initial data check complete
        }
    }, [billData, selectedItem, companyName, currentUser, navigate, location.state]);

    // 2. Get User's Current Geolocation (runs once if location not set)
    useEffect(() => {
        let isMounted = true;
        if (!userLocation && navigator.geolocation) { // Only if location not set and geolocation supported
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (!isMounted) return;
                    const newUserLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setUserLocation(newUserLocation);
                    setMapCenter(newUserLocation); // Center map on user
                    setMapZoom(12); // Zoom in closer
                    console.log("User location obtained:", newUserLocation);
                    setMapError(null); // Clear any previous location errors
                },
                (error) => {
                    if (!isMounted) return;
                    console.error("Error getting user location:", error);
                    const msg = `Could not get location: ${error.message}. Map shows default area.`;
                    setMapError(msg); // Display error near map
                    // Don't toast here unless desired, keep default center/zoom
                },
                { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
            );
        } else if (!navigator.geolocation) {
             const msg = "Geolocation is not supported by this browser.";
             setMapError(msg); toast.error(msg);
        }
        return () => { isMounted = false; }; // Cleanup
    }, [userLocation]); // Dependency ensures it runs only once initially

     // 3. Search for Service Centers (using useCallback for stability)
     const searchNearbyServiceCenters = useCallback(() => {
        // **Critical Prerequisite Checks**
        if (!isLoaded) { console.log("Places Search: Map script not loaded."); return; }
        if (!mapInstance) { console.log("Places Search: Map instance not ready."); return; }
        if (!userLocation) { console.log("Places Search: User location not available."); setMapError("Waiting for your location..."); return; }
        if (!companyName) { console.log("Places Search: Company name missing."); return; }
        if (isSearchingPlaces) { console.log("Places Search: Already searching."); return; }
        if (!window.google || !window.google.maps || !window.google.maps.places) {
             console.error("Places Search Error: Google Maps Places library not loaded.");
             setMapError("Map Places service not available."); return;
        }

        setIsSearchingPlaces(true);
        setMapError(null); // Clear previous map errors
        setServiceCenters([]); // Clear previous results
        console.log(`Searching Places API for "${companyName} service center" near`, userLocation);

        const service = new window.google.maps.places.PlacesService(mapInstance);
        const request = {
            location: userLocation,
            radius: '20000', // 20km radius
            // Use more specific types or keywords if possible
            keyword: `${companyName} service center repair customer care`,
            // Example type restriction: type: 'electronics_store'
        };

        let searchCompleted = false; // Prevent multiple state updates from one callback
        service.nearbySearch(request, (results, status) => {
            if (searchCompleted) return;
            searchCompleted = true;
            setIsSearchingPlaces(false); // Mark search as finished

            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                console.log(`Places API Found ${results.length} results.`);
                const validResults = results.filter(r => r.geometry?.location); // Ensure results have geometry
                setServiceCenters(validResults.slice(0, 15)); // Store maybe top 15
                 if (validResults.length === 0) {
                    const msg = `No nearby "${companyName}" service centers found within 20km.`;
                    toast.info(msg, { duration: 4000 });
                    setMapError(msg);
                 } else {
                    setMapError(null); // Clear error message on success
                 }
            } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                 const msg = `No nearby service centers found for "${companyName}".`;
                 console.log(msg); setMapError(msg); toast.info(msg);
                 setServiceCenters([]); // Ensure empty
            } else {
                 // Handle other Places API errors
                 console.error("Google Places Service Error:", status);
                 const msg = `Error finding service centers (${status}). Check API key permissions/billing or try later.`;
                 setMapError(msg); toast.error("Error finding service centers.");
                 setServiceCenters([]); // Ensure empty
            }
        });
     // Dependencies for useCallback: ensures function is stable unless these change
     }, [isLoaded, mapInstance, userLocation, companyName, isSearchingPlaces]);

     // 4. Effect to Trigger the Search *Once* Conditions are Met
     useEffect(() => {
        // Check if all conditions are true AND search hasn't been attempted yet
        if (isLoaded && userLocation && mapInstance && companyName && !searchAttempted) {
            console.log("All prerequisites met, triggering Places API search.");
            setSearchAttempted(true); // Mark search as attempted
            searchNearbyServiceCenters(); // Call the search function
        }
     // Dependencies control when this effect checks conditions
     }, [isLoaded, userLocation, mapInstance, companyName, searchAttempted, searchNearbyServiceCenters]);


    // --- Handlers ---

    // Handler for the final submission (Simulated)
    const handleSubmitWarrantyRequest = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Submitting warranty request...");
        console.log("Simulating Warranty Request Submission:", { /* ... data ... */ });
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        toast.success("Warranty request submitted (Simulation)!", { id: toastId });
        // navigate('/customerDashboard');
    };

    // Handler for contacting customer care
    const handleContactCustomerCare = () => {
         const companySearch = encodeURIComponent(`${companyName} customer care contact`);
         const googleSearchUrl = `https://www.google.com/search?q=${companySearch}`;
         toast(`Opening search for ${companyName} support...`, { icon: 'ℹ️'});
         window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
    };

    // Callback function for GoogleMap onLoad
    const onMapLoad = useCallback((map) => {
        setMapInstance(map); // Store the map instance in state
        console.log("Google Map instance loaded.");
    }, []);

    // Callback function for GoogleMap onUnmount
    const onMapUnmount = useCallback(() => {
        setMapInstance(null); // Clear the map instance
        console.log("Google Map instance unmounted.");
    }, []);

    // --- Render Logic ---

    if (isLoadingPage) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500"><LoadingSpinner fullPage={true} /> Loading claim details...</div>;
    }

    // Styling...
    const cardClass = "bg-white shadow-lg rounded-lg p-6 border border-gray-200 h-full flex flex-col";
    const labelClass = "block text-xs font-semibold text-gray-500 mb-0.5 uppercase tracking-wide";
    const valueClass = "text-gray-800 text-sm sm:text-base break-words";
    const mapContainerOuterStyle = "flex-grow flex items-center justify-center text-gray-500 italic text-center relative min-h-[400px] bg-gray-100 rounded-lg overflow-hidden"; // Added overflow-hidden
    const mapContainerStyle = { width: '100%', height: '100%' }; // Map fills container
    const submitButtonClass = "w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out inline-flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="bg-gradient-to-br from-blue-50 via-gray-50 to-orange-50 min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                 <div className="bg-white shadow-xl rounded-lg p-8 md:p-10 border-t-4 border-blue-500">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-blue-600 text-center flex items-center justify-center">
                        <FaShieldAlt className="mr-3" /> Confirm Warranty Claim
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Map */}
                        <section aria-labelledby="map-heading" className={cardClass}>
                             <h2 id="map-heading" className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center flex-shrink-0">
                                <FaMapMarkerAlt className="mr-2 text-blue-500"/> Nearby Service Centers for "{companyName}"
                             </h2>
                             <div className={mapContainerOuterStyle}>
                                 {/* Map Loading/Error States */}
                                 {loadError && <div className="text-red-600 p-4 font-medium">Map Error: Could not load Google Maps script. Please check API key and console.</div>}
                                 {!isLoaded && !loadError && <div className="flex flex-col items-center"><LoadingSpinner /> <span className='mt-2 text-sm text-gray-600'>Loading Map...</span></div>}
                                 {!GOOGLE_MAPS_API_KEY && isLoaded && ( <div className='text-red-500 font-medium p-4'>Map API Key is missing.<br/> Map functionality is disabled.</div> )}

                                 {/* Map Component - Renders only if script loaded and API key exists */}
                                 {isLoaded && GOOGLE_MAPS_API_KEY && (
                                     <GoogleMap
                                         mapContainerStyle={mapContainerStyle}
                                         center={mapCenter}
                                         zoom={mapZoom}
                                         onLoad={onMapLoad} // Use the memoized callback
                                         onUnmount={onMapUnmount} // Use the memoized callback
                                         options={{ // Map customization options
                                            streetViewControl: false,
                                            mapTypeControl: false,
                                            fullscreenControl: true,
                                            zoomControl: true,
                                            // Consider adding min/max zoom
                                         }}
                                     >
                                         {/* User Marker - shows only when location is known */}
                                         {userLocation && <Marker position={userLocation} title="Your Approximate Location" />}

                                         {/* Service Center Markers - shows only when centers are found */}
                                         {serviceCenters.map(center => (
                                             <Marker
                                                 key={center.place_id} // Use stable place_id
                                                 position={center.geometry?.location} // Safely access location
                                                 title={`${center.name}\n${center.vicinity || ''}`} // Tooltip
                                                 // Optional: Add onClick to show InfoWindow or select center
                                                 // onClick={() => console.log('Clicked marker:', center)}
                                             />
                                         ))}
                                     </GoogleMap>
                                 )}
                             </div>
                             {/* Display specific map/places errors or status below map */}
                             <div className="flex-shrink-0 pt-2 text-center h-6"> {/* Fixed height for status */}
                                {isLoaded && isSearchingPlaces && !mapError && <p className="text-xs text-gray-500 animate-pulse">Searching for centers...</p>}
                                {isLoaded && !isSearchingPlaces && mapError && <p className="text-xs text-red-500">{mapError}</p>}
                                {isLoaded && !isSearchingPlaces && !mapError && searchAttempted && serviceCenters.length > 0 && <p className="text-xs text-green-600">Showing nearby service centers.</p>}
                             </div>
                        </section>

                        {/* Right Column: Details and Submit */}
                        <section aria-labelledby="claim-details-heading" className={`${cardClass} justify-between`}>
                             <div> {/* Details Section */}
                                 <div className="flex justify-between items-start mb-6 gap-2">
                                     <h2 id="claim-details-heading" className="text-xl font-semibold text-gray-700 border-b pb-2 flex-grow mr-4">Claim Details</h2>
                                     <button onClick={handleContactCustomerCare} className="ml-auto text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-3 rounded-md inline-flex items-center border border-gray-300 whitespace-nowrap flex-shrink-0" title={`Search for ${companyName} Customer Care`} >
                                         <FaHeadset className="mr-1.5" /> Contact Care
                                     </button>
                                 </div>
                                 <div className="space-y-4 mb-6">
                                     <div className="grid grid-cols-3 gap-x-2 items-center"> <span className={`${labelClass} col-span-1`}><FaUser className="inline mr-1 text-blue-400"/>User:</span> <span className={`${valueClass} col-span-2`}>{currentUser?.name || 'N/A'} ({currentUser?.email || 'N/A'})</span></div>
                                     <div className="grid grid-cols-3 gap-x-2 items-center"><span className={`${labelClass} col-span-1`}><FaBoxOpen className="inline mr-1 text-blue-400"/>Product:</span> <span className={`${valueClass} col-span-2`}>{selectedItem?.itemName || 'N/A'}</span></div>
                                     <div className="grid grid-cols-3 gap-x-2 items-center"><span className={`${labelClass} col-span-1`}><FaBuilding className="inline mr-1 text-blue-400"/>Company:</span> <span className={`${valueClass} col-span-2`}>{companyName || 'N/A'}</span></div>
                                     <div className="grid grid-cols-3 gap-x-2 items-center"><span className={`${labelClass} col-span-1`}><FaCalendarAlt className="inline mr-1 text-blue-400"/>Purchased:</span> <span className={`${valueClass} col-span-2`}>{billData?.purchaseDate ? new Date(billData.purchaseDate).toLocaleDateString() : 'N/A'}</span></div>
                                     <div className="grid grid-cols-3 gap-x-2 items-center"><span className={`${labelClass} col-span-1`}><FaInfoCircle className="inline mr-1 text-blue-400"/>From Bill:</span> <span className={`${valueClass} col-span-2`}>{billData?.billName || 'N/A'}</span></div>
                                     {/* Bill Image Preview */}
                                     {billData?.billImageUrl && (
                                          <div className="mt-3">
                                              <p className={labelClass}>Bill Image:</p>
                                              {billData.billImageUrl.toLowerCase().endsWith('.pdf') ? (
                                                   <a href={billData.billImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm inline-flex items-center"> View Bill PDF </a>
                                              ) : (
                                                  <a href={billData.billImageUrl} target="_blank" rel="noopener noreferrer" title="View full bill image">
                                                     <img src={billData.billImageUrl} alt="Bill Scan" className="max-h-32 rounded border shadow-sm mt-1 object-contain cursor-pointer hover:opacity-80 transition-opacity"/>
                                                  </a>
                                              )}
                                          </div>
                                      )}
                                 </div>
                             </div>
                             {/* Submit Button Area */}
                             <div className="mt-auto pt-6 border-t">
                                 <button onClick={handleSubmitWarrantyRequest} disabled={isSubmitting} className={submitButtonClass} >
                                     {isSubmitting ? ( <> <FaSpinner className="animate-spin mr-2" /> Submitting... </> )
                                      : ( <> <FaPaperPlane className="mr-2" /> Submit Warranty Request </> )}
                                 </button>
                                 <p className="text-xs text-gray-400 mt-2 text-center italic"> This is currently a simulation. </p>
                             </div>
                        </section>
                    </div>
                 </div>
            </div>
             {/* Scrollbar Style */}
             <style jsx global>{`
                .custom-scrollbar-orange::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar-orange::-webkit-scrollbar-track { background: #fff7ed; border-radius: 10px; }
                .custom-scrollbar-orange::-webkit-scrollbar-thumb { background: #fb923c; border-radius: 10px; border: 1px solid #fff7ed; }
                .custom-scrollbar-orange::-webkit-scrollbar-thumb:hover { background: #f97316; }
                .custom-scrollbar-orange { scrollbar-width: thin; scrollbar-color: #fb923c #fff7ed; }
             `}</style>
        </div>
    );
};

export default WarrantySubmitPage;