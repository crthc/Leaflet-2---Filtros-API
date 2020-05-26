var map = L.map('mapid').on('load', onMapLoad).setView([41.430, 2.206], 10);
//map.locate({setView: true, maxZoom: 17});
	
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
var data_markers = [];

function onMapLoad() {

	console.log("Mapa cargado");
	 $.ajax({
            type:'GET',
			dataType:'json',
            url: 'http://localhost:8080/mapa/api/apiRestaurants.php',
            success: function(restaurants) {
				let kind = []; // Array containing kinds of food of every restaurant.
				let kindFood = []; // Array containing restaurants kinds of food.
				
				for( let types of restaurants){    // obtaining from json object the kinds of restaurants.
					kind.push(types.kind_food); 
					if (kindFood.includes(types.kind_food) === false) {
						kindFood.push(types.kind_food);
					}	
				} 

				let kinds = kindFood.join(); // Passing kindFood array into a string.
				let kinds2 = kinds.split(','); // Passing the string into an array in order to have separate kinds of food.
				let kindsUnique = [...new Set(kinds2)]; // Passing array to Non Duplicate kinds of food - Unique Array of kinds of food!
				kindsUnique.unshift('Todos');
				
				console.log(kindsUnique);
				

				$('#kind_food_selector').empty(); 
				$.each(kindsUnique, function(i, p) {
    			$('#kind_food_selector').append($('<option></option>').val(p).html(p)); 
				}); // Populate select options with unique kinds of food by passing kindsUnique array values.

				
				
				data_markers = restaurants;
				console.log(data_markers);
				
				
				render_to_map(data_markers, 'Todos');
				
				
            },
			error: function() {
				alert('No hay respuesta');
			}
        });

  
		

    /*
	FASE 3.1
		1) Relleno el data_markers con una petición a la api
		2) Añado de forma dinámica en el select los posibles tipos de restaurantes
		3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
		
	*/

};


$('#kind_food_selector').on('change', function() {
	console.log(this.value);
  render_to_map(data_markers, this.value);
  
});


function render_to_map(data_markers,filter){
	
	let markerTemporal;
	markers.clearLayers();

	for (let i of data_markers){
		if (filter=='Todos' || i.kind_food.includes(filter)){
			markerTemporal = L.marker([i.lat, i.lng]).bindPopup("<b>"+i.name+"</b><br><br>"+i.kind_food+"<br>"+i.address);
			markers.addLayer(markerTemporal).addTo(map);
		}
	}
	
		
	
	

	
	/*
	FASE 3.2
		1) Limpio todos los marcadores
		2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa

		if (filter=='Todos' || i.kind_food.split(",").includes(filter))
	*/
			
}


