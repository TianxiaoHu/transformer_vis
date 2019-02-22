$(document).ready(function () {
    $('.ui.dropdown')
        .dropdown();
    append_text();

    function input_to_output(index) {
        // TODO
        return 1;
    };

    function largest_n_index(arr, count) {
        var outp = [];
        for (var i = 0; i < arr.length; i++) {
            outp.push(i); // add index to output array
            if (outp.length > count) {
                outp.sort(function (a, b) {
                    return arr[b] - arr[a];
                }); // descending sort the output array
                outp.pop(); // remove the last index (index of smallest element in output array)
            }
        }
        return outp;
    }

    function output_to_input(index) {
        var weight_list = heatmapdata[index];
        max_5_weight = largest_n_index(weight_list, 10);
        return max_5_weight;
    }

    $.get("../static/data/heatmap.json", function (heatmap_data) {
        $('a').hover(
            function () {
                current_id = $(this).attr('id');
                if (current_id.charAt(0) === 'i') {
                    console.log("not implemented");
                }
                else {
                    console.log("here");
                    highlight_list = output_to_input(parseInt(current_id.slice(6)));
                    console.log(highlight_list);
                    for (i = 0; i < highlight_list.length; i++) {
                        $('#input' + highlight_list[i].toString()).addClass('highlight');
                    }
                }
            },
            function () {
                current_id = $(this).attr('id');
                if (current_id.charAt(0) === 'i') {
                    console.log("not implemented");
                }
                else {
                    highlight_list = output_to_input(parseInt(current_id.slice(6)));
                    for (i = 0; i < highlight_list.length; i++) {
                        $('#input' + highlight_list[i].toString()).removeClass('highlight');
                    }
                }
                // $(this).removeClass('highlight')
            }
        );

        heatmapdata = heatmap_data;

        function drawImage(imageObj) {
            var canvas = document.getElementById("heatmapCanvas");
            var context = canvas.getContext("2d");
            var imageX = 0;
            var imageY = 0;

            context.drawImage(imageObj, imageX, imageY);

            var data = [{
                z: heatmapdata,
                type: "heatmapgl",
                colorscale: "Portland"
            }];

            Plotly.plot("heatmapDiv", data, {}, {showSendToCloud: true});
        }

        var imageObj = new Image();
        imageObj.onload = function () {
            drawImage(this);
        };
        imageObj.src = "https://images.plot.ly/plotly-documentation/images/heatmap-galaxy.jpg";
    });
});

function append_text() {
    $.get("../static/data/input_tokenize_clean.json", function (data) {
        input_text = data;
        $('#highlightTextField').append("<p>Input Text: </p>");
        for (i = 0; i < input_text.length; i++) {
            if (input_text[i].charAt(0) === '▁') {
                word = input_text[i].slice(1);
            }
            else {
                word = input_text[i];
            }
            $('#highlightTextField').append("<a id = \'input" + i + "\'>" + word + " </a>");
        }
        $('#highlightTextField').append('<br> <br>');

        // make sure "output data" is appended after "input data"
        $.get("../static/data/output_tokenize_clean.json", function (data) {
            output_text = data;
            $('#highlightTextField').append("<p>Output Text: </p>");
            for (i = 0; i < output_text.length; i++) {
                if (output_text[i].charAt(0) === '▁') {
                    word = output_text[i].slice(1);
                }
                else {
                    word = output_text[i];
                }
                $('#highlightTextField').append("<a id = \'output" + i + "\'>" + word + " </a>");
            }
            $('#highlightTextField').append('<br> <br>');
        });
    });
};