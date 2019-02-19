$(document).ready(function () {
    $('.ui.dropdown')
        .dropdown();
    $.get("../static/data/input.txt", function (data) {
        input_text = data.split(" ");
        $('#highlightTextField').append("<p>Input Text: </p>");
        for (i = 0; i < input_text.length; i++) {
            $('#highlightTextField').append("<a id = \'input" + i + "\'>" + input_text[i] + " </a>");
        }
        $('#highlightTextField').append('<br> <br>');
    });

    $.get("../static/data/output.txt", function (data) {
        output_text = data.split(" ");
        $('#highlightTextField').append("<p>Output Text: </p>");
        for (i = 0; i < output_text.length; i++) {
            $('#highlightTextField').append("<a id = \'input" + i + "\'>" + output_text[i] + " </a>");
        }
    });

    d3.json("../static/data/heatmap.json", function (error, heatmap_data) {
        heatmapdata = heatmap_data;
        $('a').hover(
            function () {
                $(this).addClass('highlight')
            },
            function () {
                $(this).removeClass('highlight')
            }
        );

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

            Plotly.plot("heatmapDiv", data, {}, {showSendToCloud: true});
        }

        var imageObj = new Image();
        imageObj.onload = function () {
            drawImage(this);
        };
        imageObj.crossOrigin = "Anonymous";
        imageObj.src = "https://images.plot.ly/plotly-documentation/images/heatmap-galaxy.jpg";
    });
});
