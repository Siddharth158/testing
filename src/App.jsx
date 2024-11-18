import React, { useState } from 'react';

const App = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        altitude: null,
        error: null,
        elevation: null,
    });

    const getElevation = async (latitude, longitude) => {
        const apiUrl = `https://maps.googleapis.com/maps/api/elevation/json?locations=${latitude},${longitude}&key=AIzaSyDsb3OAJ8D6H654WfnMj_wMjZN0RhLFJZ8`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                setLocation((prevState) => ({
                    ...prevState,
                    elevation: data.results[0].elevation,
                }));
            } else {
                setLocation((prevState) => ({
                    ...prevState,
                    elevation: "Elevation data not available",
                }));
            }
        } catch (error) {
            setLocation((prevState) => ({
                ...prevState,
                elevation: `Error fetching elevation: ${error.message}`,
            }));
        }
    };

    const getLocation = async () => {
        if (!navigator.geolocation) {
            setLocation({ ...location, error: "Geolocation is not supported by this browser." });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, altitude } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    altitude: altitude || "Not Available",
                    error: null,
                    elevation: null,
                });

                // Fetch elevation data
                await getElevation(latitude, longitude);
            },
            (error) => {
                setLocation({ ...location, error: error.message });
            },
            {
                enableHighAccuracy: true, // Use GPS for high accuracy
                timeout: 10000, // Timeout after 10 seconds
                maximumAge: 0, // Do not use cached location
            }
        );
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>React Geolocation Example</h1>
            <button onClick={getLocation} style={{ padding: '10px 20px', fontSize: '16px' }}>
                Get Location
            </button>
            <div style={{ marginTop: '20px' }}>
                {location.error && <p style={{ color: 'red' }}>Error: {location.error}</p>}
                {location.latitude && (
                    <div>
                        <p>Latitude: {location.latitude}</p>
                        <p>Longitude: {location.longitude}</p>
                        <p>Altitude: {location.altitude}</p>
                        {location.elevation !== null && (
                            <p>Elevation: {location.elevation}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
