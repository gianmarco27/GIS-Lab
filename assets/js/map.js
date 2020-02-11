var osm = new ol.layer.Tile({
    title: 'OpenStreetMap',
    type: 'base',
    visible: true,
    source: new ol.source.OSM()
});

var stamenWatercolor = new ol.layer.Tile({
    title: 'Stamen Watercolor',
    type: 'base',
    visible: false,
    source: new ol.source.Stamen({
        layer: 'watercolor'
    })
});
var stamenToner = new ol.layer.Tile({
    title: 'Stamen Toner',
    type: 'base',
    visible: false,
    source: new ol.source.Stamen({
        layer: 'toner'
    })
});

var bingRoads = new ol.layer.Tile({
    title: 'Bing Maps—Roads',
    type: 'base',
    visible: false,
    source: new ol.source.BingMaps({
        key: 'AmTJJ4INYXmmwbLG_UajYlSofnDxn6fFs02DnfhBXs-BF3PSYnrI6cJg7VmBrXii',
        imagerySet: 'Road'
    })
});
var bingAerial = new ol.layer.Tile({
    title: 'Bing Maps—Aerial',
    type: 'base',
    visible: false,
    source: new ol.source.BingMaps({
        key: 'AmTJJ4INYXmmwbLG_UajYlSofnDxn6fFs02DnfhBXs-BF3PSYnrI6cJg7VmBrXii',
        imagerySet: 'Aerial'
    })
});

var bingAerialWithLabels = new ol.layer.Tile({
    title: 'Bing Maps—Aerial with Labels',
    type: 'base',
    visible: false,
    source: new ol.source.BingMaps({
        key: 'AmTJJ4INYXmmwbLG_UajYlSofnDxn6fFs02DnfhBXs-BF3PSYnrI6cJg7VmBrXii',
        imagerySet: 'AerialWithLabels'
    })
});


var fill = new ol.style.Fill();
var style = new ol.style.Style({
  fill: fill,
  stroke: new ol.style.Stroke({
    color: '#333',
    width: 3
  })
});
    
var getPlosStyle = function(feature) {
  var plos = feature.get('plos');
  if(plos > 5)
    style.getStroke().setColor('#800080');
  if(plos <= 5)
    style.getStroke().setColor('#ff0000');
  if(plos <= 4.25)
    style.getStroke().setColor('#ffa600');
  if(plos <= 3.5)
    style.getStroke().setColor('#ffff00');
  if(plos <= 2.75)
    style.getStroke().setColor('#00ff00');
  if(plos <= 2)
    style.getStroke().setColor('#008000');
  return style;
};  

var getPlosEStyle = function(feature) {
  var plos = feature.get('plos_e');
  if(plos > 5)
    style.getStroke().setColor('#800080');
  if(plos <= 5)
    style.getStroke().setColor('#ff0000');
  if(plos <= 4.25)
    style.getStroke().setColor('#ffa600');
  if(plos <= 3.5)
    style.getStroke().setColor('#ffff00');
  if(plos <= 2.75)
    style.getStroke().setColor('#00ff00');
  if(plos <= 2)
    style.getStroke().setColor('#008000');
  return style;
};





var roadlinkSource = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
        var url = 'http://localhost:3333/geoserver/ows?service=WFS&' +
        'version=2.0.0&request=GetFeature&typeName=Gis-Lab:niguarda_roads&' +
        'outputFormat=text/javascript&srsname=EPSG:3857&' +
        'format_options=callback:loadRoads';
        $.ajax({url: url, dataType: 'jsonp'});
    }
});

var pointsSource = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
        var url = 'http://localhost:3333/geoserver/ows?service=WFS&' +
        'version=2.0.0&request=GetFeature&typeName=Gis-Lab:points_street_matched&' +
        'outputFormat=text/javascript&srsname=EPSG:3857&' +
        'format_options=callback:loadPoints';
        $.ajax({url: url, dataType: 'jsonp'});
    }
});

var PLOSSource = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
        var url = 'http://localhost:3333/geoserver/ows?service=WFS&' +
        'version=2.0.0&request=GetFeature&typeName=Gis-Lab:roads_PLOS-computed&' +
        'outputFormat=text/javascript&srsname=EPSG:3857&' +
        'format_options=callback:loadPLOS';
        $.ajax({url: url, dataType: 'jsonp'});
    }
});
var geojsonFormat = new ol.format.GeoJSON();

function loadRoads(response) {
    roadlinkSource.addFeatures(geojsonFormat.readFeatures(response));
}

function loadPoints(response) {
    pointsSource.addFeatures(geojsonFormat.readFeatures(response));
}

function loadPLOS(response) {
    PLOSSource.addFeatures(geojsonFormat.readFeatures(response));
}

var roadlinks = new ol.layer.Vector({
    title: 'Niguarda Roadlinks',
    type: 'roadlink',
    source: roadlinkSource,
    visible: true,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgb(58, 100, 255)',
            width: 2
        })
    })
});

var points = new ol.layer.Vector({
    title: 'Niguarda Points',
    source: pointsSource,
    visible: true,
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: null,
            stroke: new ol.style.Stroke({
                color: 'rgba(255,0,0,0.9)',
                width: 2
            })
        })
    })
});

var plos = new ol.layer.Vector({
    title: 'Niguarda PLOS',
    type: 'roadlink',
    source: PLOSSource,
    visible: true,
    style: getPlosStyle
});

var plos_E = new ol.layer.Vector({
    title: 'Niguarda PLOS Enchanched',
    type: 'roadlink',
    source: PLOSSource,
    visible: true,
    style: getPlosEStyle
});



var map = new ol.Map({
    target: document.getElementById('map'),
    layers: [
        new ol.layer.Group({
            title: 'Base Maps',
            layers: [stamenToner, stamenWatercolor, bingAerialWithLabels, bingAerial,
            bingRoads, osm]
        }),
        new ol.layer.Group({
            title: 'Roads',
            layers: [roadlinks, plos, plos_E]
        }),
        new ol.layer.Group({
            title: 'Points',
            layers: [points]
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([9.190561,45.516172]),
        zoom: 17.5
    }),
    controls: ol.control.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.FullScreen(),
        new ol.control.OverviewMap(),
        new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326'
        })
    ])

});

var elementPopup = document.getElementById('popup');
var popup = new ol.Overlay({
element: elementPopup
});
map.addOverlay(popup);


var layerSwitcher = new ol.control.LayerSwitcher({
    groupSelectStyle : 'none'
});
map.addControl(layerSwitcher);



map.on('click', function(event) {
    var feature = map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
        return feature;
    });
    if (feature != null) {
        var pixel = event.pixel;
        var coord = map.getCoordinateFromPixel(pixel);
        popup.setPosition(coord);
        if(feature.get('plos') != null){
            $(elementPopup).attr('title', 'Info');
            $(elementPopup).attr('data-content', '<b>Id: </b>' + feature.get('sourceid') +'</br><b>road: </b>' + feature.get('roadname') +'</br><b>PLOS: </b>' + feature.get('plos')+'</br><b>PLOS_E: </b>' + feature.get('plos_e'));
        } else if(feature.get('2_Data_Typ') != null){
            $(elementPopup).attr('title', 'Info');
            $(elementPopup).attr('data-content', '<b>Id: </b>' + feature.get('sourceid') +'</br><b>Lat: </b>' + feature.get('lat_1_Coor') +'</br><b>Lon: </b>' + feature.get('long_1_Coo') +'</br><b>Type: </b>' + feature.get('2_Data_Typ')+'</br><b>Value: </b>' + feature.get('3_Value'));
        } else {
            $(elementPopup).attr('title', 'Info');
            $(elementPopup).attr('data-content', '<b>Id: </b>' + feature.get('sourceid') +'</br><b>road: </b>' + feature.get('roadname'));    
        }
        $(elementPopup).popover({'placement': 'top', 'html': true});
        $(elementPopup).popover('show');
    }
});

map.on('pointermove', function(event) {
    if (event.dragging) {
        $(elementPopup).popover('destroy');
        return;
    }
    var pixel = map.getEventPixel(event.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});




