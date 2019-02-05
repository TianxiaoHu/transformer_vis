$(document).ready(function() {
    $('.ui.dropdown')
        .dropdown();

    // TESTER = document.getElementById('highlight');
    //     // Plotly.plot(TESTER, [{
    //     //     x: [1, 2, 3, 4, 5],
    //     //     y: [1, 2, 4, 8, 16]
    //     // }], {
    //     //     margin: { t: 0 }
    //     // });

    function drawImage(imageObj) {
        var canvas = document.getElementById("heatmapCanvas");
        var context = canvas.getContext("2d");
        var imageX = 0;
        var imageY = 0;
        var imageWidth = imageObj.width;
        var imageHeight = imageObj.height;

        context.drawImage(imageObj, imageX, imageY);

        // var imageData = context.getImageData(imageX, imageY, imageWidth, imageHeight);
        // var data = imageData.data;

        var zdata=[[1, 2, 3], [2, 3, 4], [3, 4, 5]];
        var data = [{
            z: zdata,
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
