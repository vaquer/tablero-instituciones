function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, '-'])[1].replace(/\+/g, '%20')) || null;
}

function omitirAcentos(orgName) {
    var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
    var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
    for (var i = 0; i < acentos.length; i++) {
        orgName = orgName.replace(acentos.charAt(i), original.charAt(i));
    }
    return orgName, getapiOrg(orgName);
}

function getapiOrg(orgName) {
    var totalCalidad, percentRecommen, percentCalidad, dataApi, dataApiOPI, dataDescargasOpi, orgTitle, orgLogoUrl,
        downloads, adelaIssued, resourceId, rating, totalRaiting, resourceTitle, resourceType;
    var valueDownloads = [];
    var issuedTotal = 0;
    var issuedPublish = 0;
    var sumaRating = 0;
    var sumaCalidad = 0;
    var isPublicTrue = 0;
    var isPublicFalse = 0;
    var totalRecommendations = 0;

    $(".org-breadcrumb").text(orgName.toUpperCase());
 
    //Ajax Get
    $.ajax({
        //url: 'http://api.datos.gob.mx/v1/data-fusion?catalog-dataset.publisher.name=SHCP&pageSize=1000',
        url: 'https://api.datos.gob.mx/v1/data-fusion?adela.inventory.slug=' + orgName,
        async: false,
        type: 'GET',
        success: function (data) {
            dataApi = data;
        },
        error: function (data) {
            console.error("Error!", data);
        }
    });
    $.ajax({
        url: '/tablero-instituciones/apicomparativa/' + orgName + '/',
        async: false,
        type: 'GET',
        success: function (data) {
            dataApiOPI = data;
        },
        error: function (data) {
            console.error("Error!", data);
        }
    });
    $.ajax({
        url: '/tablero-instituciones/apicomparativa/recursos-mas-descargados/' + orgName + '/',
        async: false,
        type: 'GET',
        success: function (data) {
            dataDescargasOpi = data;
        },
        error: function (data) {
            console.error("Error!", data);
        }
    });

    $('#top-5-datos').dataTable({
        searching: false,
      "language": {
          "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
          }
        },
      "info": false,
      "bLengthChange": false,
      "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        $('td:eq(0)', nRow).attr("tag", aData.slug);
      },
      "ajax": {
        "url": '/tablero-instituciones/apicomparativa/recursos-mas-descargados/' + orgName + '/',
        "type": 'POST',
        "dataSrc": function (json) {
          if(json.recursos === undefined || json.recursos === null){
            alert('Sentimos los incovenientes. Estamos actualizando los datos. Intenta mas tarde.');
            return false;
          }

          return json.recursos;
        }
      },"error": function(){
        alert('Sentimos los incovenientes. Estamos actualizando los datos. Intenta mas tarde.');
        return false;
      },
      "columns": [
          { "data": "recurso" },
          { "data": "descargas", render: $.fn.dataTable.render.number( ',', '.', 0 ), class: 'descargas-tabla' },
          { "data": "liga_saludable", render: function ( data, type, row ) {
                var class_txt = 'ok';
                if(data !== true){
                    class_txt = 'remove';
                }
                return '<span class="glyphicon glyphicon-' + class_txt + '"></>';
            }, class: 'status_link'
          }
      ]
    });

    orgLogoUrl = 'https://raw.githubusercontent.com/mxabierto/assets/master/img/logos/' + orgName + '.png';
    $('#logo_org').attr('src', orgLogoUrl);
} //Fin getapiOrg()
