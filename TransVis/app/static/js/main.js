$(document).ready(function() {
    $('.ui.dropdown')
        .dropdown();
    d3.json("../static/data/heatmap.json", function(error, data) {
        heatmapdata = data;

    function drawImage(imageObj) {
        var canvas = document.getElementById("heatmapCanvas");
        var context = canvas.getContext("2d");
        var imageX = 0;
        var imageY = 0;

        context.drawImage(imageObj, imageX, imageY);

        var data = [{
            z: heatmapdata,
            type: "heatmapgl",
            colorscale: "Picnic"
        }];

        Plotly.plot("heatmapDiv", data, {}, { showSendToCloud: true });
    }
    var imageObj = new Image();
    imageObj.onload = function() {
        drawImage(this);
    };
    imageObj.crossOrigin = "Anonymous";
    imageObj.src = "https://images.plot.ly/plotly-documentation/images/heatmap-galaxy.jpg";
    });

});
