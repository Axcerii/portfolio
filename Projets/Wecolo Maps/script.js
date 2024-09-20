/*******************************************************
Nom ......... : script.js
Role ........ : Affiche la carte sur le site ainsi que toutes ses fonctionnalités
Pour ........ : Wecolo
Dates ....... : 13/12/2021 - 16/12/2021 
Auteur ...... : Géraud PERTHUS, Hugo MALEZET
********************************************************/
//ID de la carte : 
//Check si l'HTML et le JS sont reliés 
  console.log("Les fichiers sont reliés");

//Check si le code est bien chargé sur Wamp
  console.log('Test N°25');

//Implémentation du fichier JSON
  var requestURL = 'https://raw.githubusercontent.com/bhaaahb/projetTut/main/result-final-f.txt';
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();


//Désassembleur de latitude et longitude 
  function ParseDMS(input) {
    var parts = input.split(/[^\d\w\.]+/);  
    var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
    return lat;
  }
  function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  }
// Convertisseur de date
  function date(input){
    var parts = input.split('-');
    var parts2 = parts[2].split('T');
    var convert = parts2[0] + "/" + parts[1] + "/" + parts[0];
    return convert;
  }
//Google Maps, Ajout de la carte
  var map;
  function initMap() {                                                               //Début de la fonction initMap
    map = new google.maps.Map(document.getElementById("map"), {
      mapId: idMap,
      center: {lat: 48.52, lng: 2.19},
      zoom: 7,
    });
    
//Barre de Recherche fournit par Google Maps API
  const marker = new google.maps.Marker({map: map, draggable: false});
  const autocompleteInput = document.getElementById('location');
  const autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {
    fields: ["address_components", "geometry", "name"],
    types: ["address"],
  });
  autocomplete.addListener('place_changed', function () {
    marker.setVisible(false);
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert('No details available for input: \'' + place.name + '\'');
      return;
    }
    renderAddress(place);
    fillInAddress(place);
  });

  function fillInAddress(place) {  // optional parameter
    const addressNameFormat = {
      'street_number': 'short_name',
      'route': 'long_name',
      'locality': 'long_name',
      'administrative_area_level_1': 'short_name',
      'country': 'long_name',
      'postal_code': 'short_name',
    };
    const getAddressComp = function (type) {
      for (const component of place.address_components) {
        if (component.types[0] === type) {
          return component[addressNameFormat[type]];
        }
      }
      return '';
    };
    document.getElementById('location').value = getAddressComp('street_number') + ' '
              + getAddressComp('route');
    for (const component of componentForm) {
      // Location field is handled separately above as it has different logic.
      if (component !== 'location') {
        document.getElementById(component).value = getAddressComp(component);
      }
    }
  }

  function renderAddress(place) {
    map.setCenter(place.geometry.location);
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
  }

//Système de recherche de position

const input = document.getElementById("pac-input");
const searchBox = new google.maps.places.SearchBox(input);

map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(input);
// Bias the SearchBox results towards current map's viewport.
map.addListener("bounds_changed", () => {
  searchBox.setBounds(map.getBounds());
});

let markers = [];

// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener("places_changed", () => {
  const places = searchBox.getPlaces();

  if (places.length == 0) {
    return;
  }

  // Clear out the old markers.
  markers.forEach((marker) => {
    marker.setMap(null);
  });
  markers = [];

  // For each place, get the icon, name and location.
  const bounds = new google.maps.LatLngBounds();

  places.forEach((place) => {
    if (!place.geometry || !place.geometry.location) {
      console.log("Returned place contains no geometry");
      return;
    }

    const icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25),
    };

    // Create a marker for each place.
    markers.push(
      new google.maps.Marker({
        map,
        icon: iconeMarkerVert,
        title: place.name,
        position: place.geometry.location,
        label:'Vous',
      })
    );
    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  });
  map.fitBounds(bounds);
});



//Médias des icones 
  var heartIcon = `/icones/path-copy-18@2x.png`,
  blueHeartIcon=`/icones/path-copy-18@2xBleu.png`;
  var icone = '/icones/Marker_Jaune.png';
  var iconeMarkerFav = '/icones/Marker_fav_rouge.png';
  var iconeMarkerVert='/icones/Marker_Vert.png';

//Placement des marqueurs du JSON
  request.onload = function(){
//Initialisation des variables principales
    var Base_de_donnees = request.response;         //Récupérer les données du JSON
    var Sejour = Base_de_donnees["sejour"];         //Récupérer les données du Tableau Inférieur à la Base de données
    var sejourLength = Sejour.length;               //Nombre de sejour disponible
    var favoris = [];                               //Tableau contenant des booleens pour savoir quel séjour est en favoris ou non
    var dictionnaireCoordonnees = [];               //Dictionnaire contenant toutes les latitudes et longitude {lat: x, lng: y}
    var infoWindows = [];                           //Tableau contenant toutes les infosWindows
    var fermer = false;                             //Vérifier si une infoWindows est ouverte
    var memoire;                                    //Index de l'infoWindows ouverte précédemment
    var markers = [];                               //Tableau contenant tous les marqueurs
    var price =[];                                  //Tableau contenant le prix des séjours en chaîne de caractères
    var favoriClose = false;                        //Verifier l'écouteur d'évènement du bouton favori
    var iconeMarker;                                //Icone du marqueur

//Vérification des favoris dans le local storage
  for(ii = 0 ; ii < sejourLength ; ii++){
    if(localStorage.getItem(`Favori${ii}`)){
      favoris[ii] = true;
    }
  }

//Vérification de la base de données
//    console.table(Base_de_donnees);
//    console.log(sejourLength);

//Création du bouton "favori"
var favori = `<div style="text-align : center; display : flex; justify-content : flex-end;"><button class="favoriIcon" ><img class="Heart" src =${heartIcon}> </button> </div>`;

//Boucle pour placer les marqueurs, les infos windows et favoris                                          Début de la grande boucle
  for(let ii = 0 ; ii < sejourLength ; ii++){
    var entree = Sejour[ii],                       //Entrées d'un séjour x
    latitude = ParseDMS(entree['latitude']),       //Conversion de la latitude 
    longitude = ParseDMS(entree['longitude']),     //Conversion de la longitude
    Tarif = entree['sejourTarifreservation'];      //Accès aux entrées du tableau 'sejourTarifreservation'

  //Création des informations contenus dans les infoWindows
    var infoWindowOptions = {
      content: `<div class="infos">
      <h3> ${entree['titre']}</h3> 
      <h4> Lieu : ${entree['ville']}</h4>
      <p> Prix  : ${Tarif['prix']} €</p>
      <p> Dates : Du ${date(Tarif['dateDebut'])} au ${date(Tarif['dateFin'])}</p>
      <img style="width : 18.25rem; height : auto; margin : auto auto;" src='${entree['image']}'>
      ${favori}
      </div>
      `
    }
  //Verification des informations des coordonnées
//  console.log(latitude);
//  console.log(longitude);
//  console.log(entree);

  //Gestion des coordonnées
    entree['coordonnées'] = {lat: latitude, lng: longitude};
    dictionnaireCoordonnees.push(entree['coordonnées']);

  //Conversion des prix en chaîne de caractère pour les labels
    price[ii] = Tarif['prix'].toString();
    
  //Image des marqueurs
  if (favoris[ii]){
    iconeMarker = new google.maps.MarkerImage(iconeMarkerFav);
  }
  else{
    iconeMarker = new google.maps.MarkerImage(icone);
  }

  //Création des marqueurs sur la carte
    markers[ii] = new google.maps.Marker({
      position: entree['coordonnées'],              //Coordonnées du Marqueurs*
      map: map,                                     //Carte utilisé*
      icon: iconeMarker,                            //Image de l'icone utilisé
      title: entree['ville'],                       //Indication au survol du marqueur
      label: price[ii]+'€',                         //Indication écrite sur le marqueur
    });

  //Remplissage du tableau contenant les infoWindows
    infoWindows[ii] = (new google.maps.InfoWindow(infoWindowOptions));  
    
    infoWindows[ii].index = ii;                                                //baba (indication d'un ajout fait par un professeur)
    markers[ii].index = ii;                                                    //baba

    
    //position[ii] = markers; //baba j'ai comment
  //Ecouteur d'évènement sur les marqueurs
    google.maps.event.addListener(markers[ii], 'click', function() {          //baba      //Ouverture de l'écouteur d'évènement
    
    //Vérification de savoir si une fenêtre est ouverte
      if(fermer){
        infoWindows[memoire].close(map, markers[memoire]);
        fermer = false;
      }
    //Ouverture de la fenêtre
      infoWindows[this.index].open(map, markers[this.index]);                 //baba

    //Indication qu'une fenêtre est ouverte
      fermer = true;
      memoire = ii;
    //Implémentation des favoris : 
    var changementIcon = markers[ii];
    var changementIconUrl = changementIcon['url'];
    console.log(changementIcon['url']);
    //Décalage pour faire apparaître l'écouteur d'évènement une fraction de seconde après l'ouverture de la fenêtre
      setTimeout(()=>{
        var fav = document.querySelector(".favoriIcon");
        var heart = document.querySelector(".Heart");
      //Ouverture de l'écouteur d'évènement sur le bouton favori
        fav.addEventListener("click", function listenerFavori(){
          if(favoriClose){
            fav.removeEventListener("click", listenerFavori);
            favoriClose = false;
          }
          favoriClose = true;
          if (favoris[memoire]){
            favoris[memoire] = false;
            localStorage.removeItem(`Favori${memoire}`);
            heart.src=`${heartIcon}`;
          console.log('Gris !');
            changementIconUrl = icone;
            changementIcon['icon'] = changementIconUrl;
            markers[memoire] = changementIcon;
            console.table(markers);
          }
          else{
            favoris[memoire] = true;
            localStorage.setItem(`Favori${memoire}`, true);
            heart.src=`${blueHeartIcon}`;
          console.log('Bleu !');
          changementIconUrl = iconeMarkerFav;
          changementIcon['icon'] = changementIconUrl;
          markers[memoire] = changementIcon;
          console.table(markers);
          }
        });
      //Fin de l'écouteur d'évènement
      //Affichage du favori si le favori est présent de base à l'ouverture
          if (favoris[memoire]){
          //console.log('Le coeur est rouge par défaut !')
            heart.src=`${blueHeartIcon}`;
          }
      },1);
      //Fin du décalage de 1ms
    });                                                                                   //Fin de l'écouteur d'évènement 
  }                                                                                         //Fin de la grande boucle
  //Implémentation des clusters
  //console.table(markers);
    new markerClusterer.MarkerClusterer({markers, map});
    }

  //Géolocalisation fourni par Google Maps API :


    infoWindow = new google.maps.InfoWindow();

    const locationButton = document.createElement("button");

    locationButton.textContent = "Lancer la géolocalisation";
    locationButton.classList.add("Geolocalisation");
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent("Location found.");
            infoWindow.open(map);
            map.setCenter(pos);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {


        handleLocationError(false, infoWindow, map.getCenter());
      }
    });
  }                                                                             //Fin de la fonction initMap
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(map);
    }

