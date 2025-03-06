import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { Feature, Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { useEffect, useRef } from 'react';
import 'ol/ol.css'
import { Point } from 'ol/geom';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Heatmap } from 'ol/layer';



function MapComponent() {

  const mapRef = useRef(null);

  const southWest = fromLonLat([36.53881, 31.88188])
  const northEast = fromLonLat([36.61966,31.92023])

  const bounds = [
    southWest[0], southWest[1],
    northEast[0], northEast[1]
  ];

  const points = [
    { coords: [-0.1276, 51.5074], population: 1000 }, // London
    { coords: [-3.7038, 40.4168], population: 500 },  // Madrid
    { coords: [2.3522, 48.8566], population: 800 },   // Paris
    { coords: [4.8951, 52.3676], population: 1500 },  // Amsterdam
    { coords: [-74.0060, 40.7128], population: 1200 }, // New York
  ];


  useEffect(() => {

    if (!mapRef.current) return;

    const heatSource = new VectorSource();
    points.forEach((point) => {
      const feature = new Feature(new Point(fromLonLat(point.coords)));
      feature.set('population', point.population); // Store population as an attribute
      heatSource.addFeature(feature);
    });

    const heatmapLayerGreen = new Heatmap({

      source: heatSource,
      blur: 0,
      opacity: 0.5,
      radius: 30,
      weight: (feature) => 1,
      gradient: [
        '#00FF00', // Green for low intensity
        '#00FF00'
      ]


    })

    const heatmapLayerYellow = new Heatmap({

      source: heatSource,
      blur: 0,
      opacity: 0.5,
      radius: 50,
      weight: (feature) => 1,
      gradient: [
        '#fff200', // Green for low intensity
        '#fff200'
      ]


    })

    const heatmapLayerRed = new Heatmap({

      source: heatSource,
      blur: 0,
      opacity: 0.5,
      radius: 70,
      weight: (feature) => 1,
      gradient: [
        '#ff0000', // Green for low intensity
        '#ff0000'
      ]


    })

    const pointFeature = new Feature({
      geometry: new Point(fromLonLat([36.57,31.90]))
    })

    pointFeature.setStyle(
      new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({color:"red"}),
          stroke: new Stroke({color: "white", width: 2})
        })
      })

    )

    const pointSource = new VectorSource({
      features: [pointFeature]

    })

    const vectorLayer = new VectorLayer({

      source: pointSource

    })

  const tileLayer = new TileLayer({
    source: new OSM()
  });

  const mapView = new View({
    center: fromLonLat([36.57, 31.90]),
    zoom: 10,
    //extent: bounds

  })

  const map = new Map({
    target: mapRef.current,
    layers: [tileLayer, vectorLayer, heatmapLayerRed, heatmapLayerYellow, heatmapLayerGreen],
    view: mapView


  })


    return () => map.setTarget(undefined)

  }, []);

  return (

    <div ref={mapRef} style={{width: "100%", height: "100vh"}}></div>

  )

}

export default MapComponent;