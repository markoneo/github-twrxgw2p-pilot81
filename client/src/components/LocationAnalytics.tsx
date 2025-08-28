import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { MapPin, TrendingUp, Users, DollarSign, Navigation, Eye, EyeOff } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  html: '<div class="bg-blue-500 w-3 h-3 rounded-full border-2 border-white shadow-lg"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Geocoding service - using a simple geocoding approach
const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
  try {
    // Using Nominatim (OpenStreetMap's free geocoding service)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    
    // Check if the response is ok before parsing
    if (!response.ok) {
      console.error('Geocoding error:', {
        status: response.status,
        statusText: response.statusText,
        responseText: await response.text()
      });
      return null;
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Simple cache for geocoded locations
const locationCache = new Map<string, [number, number] | null>();

interface LocationData {
  address: string;
  coordinates: [number, number];
  frequency: number;
  totalRevenue: number;
  type: 'pickup' | 'dropoff';
}

interface HeatMapProps {
  heatmapData: LocationData[];
  showPickups: boolean;
  showDropoffs: boolean;
}

// Custom hook for heatmap
const useHeatmap = (map: L.Map | null, heatmapData: LocationData[], showPickups: boolean, showDropoffs: boolean) => {
  useEffect(() => {
    if (!map || typeof window === 'undefined') return;

    // Dynamically import heatmap library
    import('leaflet.heat').then(() => {
      // Clear existing heatmap layers
      map.eachLayer((layer) => {
        if (layer instanceof (L as any).HeatLayer) {
          map.removeLayer(layer);
        }
      });

      // Prepare pickup data
      if (showPickups) {
        const pickupPoints = heatmapData
          .filter(item => item.type === 'pickup')
          .map(item => [item.coordinates[0], item.coordinates[1], item.frequency * 0.5] as [number, number, number]);

        if (pickupPoints.length > 0) {
          const pickupHeatmap = (L as any).heatLayer(pickupPoints, {
            radius: 25,
            blur: 15,
            gradient: {
              0.0: 'blue',
              0.2: 'cyan',
              0.4: 'lime',
              0.6: 'yellow',
              0.8: 'orange',
              1.0: 'red'
            },
            maxZoom: 18,
          });
          pickupHeatmap.addTo(map);
        }
      }

      // Prepare dropoff data with different colors
      if (showDropoffs) {
        const dropoffPoints = heatmapData
          .filter(item => item.type === 'dropoff')
          .map(item => [item.coordinates[0], item.coordinates[1], item.frequency * 0.5] as [number, number, number]);

        if (dropoffPoints.length > 0) {
          const dropoffHeatmap = (L as any).heatLayer(dropoffPoints, {
            radius: 25,
            blur: 15,
            gradient: {
              0.0: 'darkblue',
              0.2: 'blue',
              0.4: 'green',
              0.6: 'lightgreen',
              0.8: 'yellow',
              1.0: 'orange'
            },
            maxZoom: 18,
          });
          dropoffHeatmap.addTo(map);
        }
      }
    }).catch(error => {
      console.error('Failed to load heatmap library:', error);
    });
  }, [map, heatmapData, showPickups, showDropoffs]);
};

// Heatmap component
function HeatmapLayer({ heatmapData, showPickups, showDropoffs }: HeatMapProps) {
  const map = useMap();
  useHeatmap(map, heatmapData, showPickups, showDropoffs);
  return null;
}

// Top locations component
interface TopLocation {
  address: string;
  frequency: number;
  revenue: number;
  type: 'pickup' | 'dropoff';
}

const TopLocationsPanel = ({ topLocations }: { topLocations: TopLocation[] }) => {
  const pickupLocations = topLocations.filter(loc => loc.type === 'pickup').slice(0, 5);
  const dropoffLocations = topLocations.filter(loc => loc.type === 'dropoff').slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center text-red-600">
          <MapPin className="w-5 h-5 mr-2" />
          Top Pickup Locations
        </h3>
        <div className="space-y-2">
          {pickupLocations.map((location, index) => (
            <div key={`pickup-${index}`} className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{location.address}</p>
                <p className="text-xs text-gray-500">{location.frequency} pickups</p>
              </div>
              <div className="text-right ml-2">
                <p className="text-sm font-semibold text-red-600">€{location.revenue.toFixed(0)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center text-blue-600">
          <Navigation className="w-5 h-5 mr-2" />
          Top Dropoff Locations
        </h3>
        <div className="space-y-2">
          {dropoffLocations.map((location, index) => (
            <div key={`dropoff-${index}`} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{location.address}</p>
                <p className="text-xs text-gray-500">{location.frequency} dropoffs</p>
              </div>
              <div className="text-right ml-2">
                <p className="text-sm font-semibold text-blue-600">€{location.revenue.toFixed(0)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function LocationAnalytics() {
  const { projects } = useData();
  const [heatmapData, setHeatmapData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPickups, setShowPickups] = useState(true);
  const [showDropoffs, setShowDropoffs] = useState(true);
  const [geocodingProgress, setGeocodingProgress] = useState(0);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([40.7128, -74.0060]); // Default to NYC

  // Process project data and geocode locations
  useEffect(() => {
    const processLocationData = async () => {
      setLoading(true);
      setGeocodingProgress(0);

      // Get all unique addresses
      const allAddresses = new Set<string>();
      projects.forEach(project => {
        if (project.pickupLocation) allAddresses.add(project.pickupLocation);
        if (project.dropoffLocation) allAddresses.add(project.dropoffLocation);
      });

      const addressArray = Array.from(allAddresses);
      const locationData: LocationData[] = [];
      let processed = 0;

      // Geocode addresses with progress tracking
      for (const address of addressArray) {
        if (locationCache.has(address)) {
          processed++;
          setGeocodingProgress((processed / addressArray.length) * 100);
          continue;
        }

        try {
          // Add delay to respect rate limits
          if (processed > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          const coordinates = await geocodeAddress(address);
          locationCache.set(address, coordinates);
          processed++;
          setGeocodingProgress((processed / addressArray.length) * 100);
        } catch (error) {
          console.error(`Failed to geocode ${address}:`, error);
          locationCache.set(address, null);
          processed++;
          setGeocodingProgress((processed / addressArray.length) * 100);
        }
      }

      // Process pickup locations
      const pickupFrequency = new Map<string, { count: number, revenue: number }>();
      projects.forEach(project => {
        if (project.pickupLocation) {
          const current = pickupFrequency.get(project.pickupLocation) || { count: 0, revenue: 0 };
          pickupFrequency.set(project.pickupLocation, {
            count: current.count + 1,
            revenue: current.revenue + project.price
          });
        }
      });

      pickupFrequency.forEach((data, address) => {
        const coordinates = locationCache.get(address);
        if (coordinates) {
          locationData.push({
            address,
            coordinates,
            frequency: data.count,
            totalRevenue: data.revenue,
            type: 'pickup'
          });
        }
      });

      // Process dropoff locations
      const dropoffFrequency = new Map<string, { count: number, revenue: number }>();
      projects.forEach(project => {
        if (project.dropoffLocation) {
          const current = dropoffFrequency.get(project.dropoffLocation) || { count: 0, revenue: 0 };
          dropoffFrequency.set(project.dropoffLocation, {
            count: current.count + 1,
            revenue: current.revenue + project.price
          });
        }
      });

      dropoffFrequency.forEach((data, address) => {
        const coordinates = locationCache.get(address);
        if (coordinates) {
          locationData.push({
            address,
            coordinates,
            frequency: data.count,
            totalRevenue: data.revenue,
            type: 'dropoff'
          });
        }
      });

      // Set map center to the most frequent location or a default
      if (locationData.length > 0) {
        const mostFrequent = locationData.reduce((prev, current) => 
          prev.frequency > current.frequency ? prev : current
        );
        setMapCenter(mostFrequent.coordinates);
      }

      setHeatmapData(locationData);
      setLoading(false);
    };

    if (projects.length > 0) {
      processLocationData();
    } else {
      setLoading(false);
    }
  }, [projects]);

  // Calculate top locations
  const topLocations = useMemo(() => {
    const locationMap = new Map<string, TopLocation>();

    heatmapData.forEach(item => {
      const key = `${item.address}-${item.type}`;
      locationMap.set(key, {
        address: item.address,
        frequency: item.frequency,
        revenue: item.totalRevenue,
        type: item.type
      });
    });

    return Array.from(locationMap.values()).sort((a, b) => b.frequency - a.frequency);
  }, [heatmapData]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const pickupStats = heatmapData.filter(item => item.type === 'pickup');
    const dropoffStats = heatmapData.filter(item => item.type === 'dropoff');

    return {
      totalLocations: new Set([...pickupStats.map(p => p.address), ...dropoffStats.map(d => d.address)]).size,
      mostPopularPickup: pickupStats.reduce((prev, current) => prev.frequency > current.frequency ? prev : current, pickupStats[0]),
      mostPopularDropoff: dropoffStats.reduce((prev, current) => prev.frequency > current.frequency ? prev : current, dropoffStats[0]),
      totalTrips: pickupStats.reduce((sum, item) => sum + item.frequency, 0)
    };
  }, [heatmapData]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-green-600" />
          Location Analytics
        </h3>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600 mb-2">Processing location data...</p>
          {geocodingProgress > 0 && (
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Geocoding addresses</span>
                <span>{Math.round(geocodingProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${geocodingProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Locations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLocations}</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTrips}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Top Pickup</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {stats.mostPopularPickup?.address.split(',')[0] || 'N/A'}
              </p>
              <p className="text-xs text-gray-500">
                {stats.mostPopularPickup?.frequency || 0} trips
              </p>
            </div>
            <Users className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Top Dropoff</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {stats.mostPopularDropoff?.address.split(',')[0] || 'N/A'}
              </p>
              <p className="text-xs text-gray-500">
                {stats.mostPopularDropoff?.frequency || 0} trips
              </p>
            </div>
            <Navigation className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Location Heat Map
              </h3>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={showPickups}
                    onChange={(e) => setShowPickups(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-red-600">Pickups</span>
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={showDropoffs}
                    onChange={(e) => setShowDropoffs(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-blue-600">Dropoffs</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="h-96">
            {heatmapData.length > 0 ? (
              <MapContainer
                center={mapCenter}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <HeatmapLayer 
                  heatmapData={heatmapData} 
                  showPickups={showPickups}
                  showDropoffs={showDropoffs}
                />
                
                {/* Show markers for top locations */}
                {topLocations.slice(0, 10).map((location, index) => {
                  const locationData = heatmapData.find(item => 
                    item.address === location.address && item.type === location.type
                  );
                  
                  return locationData ? (
                    <Marker
                      key={`${location.address}-${location.type}-${index}`}
                      position={locationData.coordinates}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-semibold">{location.address}</p>
                          <p className="text-gray-600">{location.frequency} {location.type}s</p>
                          <p className="text-green-600 font-medium">€{location.revenue.toFixed(2)}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ) : null;
                })}
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No location data available</p>
                  <p className="text-sm">Create some projects to see the heat map</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Locations Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Popular Locations
          </h3>
          
          {topLocations.length > 0 ? (
            <TopLocationsPanel topLocations={topLocations} />
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No location data yet</p>
              <p className="text-sm text-gray-400">Complete some projects to see popular locations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}