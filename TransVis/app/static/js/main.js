var selected_layer;
var selected_head_list = [];

$(document).ready(function () {
    $('.ui.dropdown')
        .dropdown();
    append_text();

    var color_map = d3.scale.category10();
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

    function output_to_input(layer, head, index) {
        var weight_list = heatmapdata[layer][head][index];
        max_weights = largest_n_index(weight_list, 10);
        return max_weights;
    }

    $("#layerSelect").dropdown({
        onChange: function () {
            selected_layer = parseInt($("#layerSelect").dropdown('get value'));
        }
    });

    $(".headSelect").checkbox({
        onChecked: function () {
            selected_head_list.push(parseInt($(this).attr('id').slice(10)));
            console.log(selected_head_list);
        },
        onUnchecked: function () {
            var index = selected_head_list.indexOf(parseInt($(this).attr('id').slice(10)));
            if (index != -1) {
                selected_head_list.splice(index, 1);
            }
            console.log(selected_head_list);
        }
    });

    $.get("../static/data/heatmap.json", function (heatmap_data) {
        $('a').hover(
            function () {
                current_id = $(this).attr('id');
                if (current_id.charAt(0) === 'i') {
                    console.log("not implemented");
                }
                else {
                    if (typeof(selected_layer) === 'undefined') return;
                    if (selected_head_list.length === 0) return;
                    for (i = 0; i < selected_head_list.length; i++) {
                        highlight_list = output_to_input(selected_layer, selected_head_list[i], parseInt(current_id.slice(6)));
                        for (j = 0; j < highlight_list.length; j++) {
                            $('#input' + highlight_list[j].toString()).css(
                                {
                                    'color': '#272822',
                                    'background-color': color_map(selected_head_list[i])
                                    // 'opacity':
                                }
                            );
                        }
                    }
                }
            },
            function () {
                current_id = $(this).attr('id');
                if (current_id.charAt(0) === 'i') {
                    console.log("not implemented");
                }
                else {
                    if (typeof(selected_layer) === 'undefined') return;
                    if (selected_head_list.length === 0) return;
                    for (i = 0; i < selected_head_list.length; i++) {
                        highlight_list = output_to_input(selected_layer, selected_head_list[i], parseInt(current_id.slice(6)));
                        for (j = 0; j < highlight_list.length; j++) {
                            $('#input' + highlight_list[j].toString()).css(
                                {
                                    'color': '',
                                    'background-color': ''
                                    // 'opacity': ''
                                }
                            );
                        }
                    }
                }
            }
        );

        heatmapdata = heatmap_data;

        function drawImage(imageObj) {
            var canvas = document.getElementById("heatmapCanvas");
            var context = canvas.getContext("2d");
            var imageX = 0;
            var imageY = 0;

            context.drawImage(imageObj, imageX, imageY);

            var x_labels = input_text;
            var y_labels = output_text;
            var data = [{
                z: heatmapdata[0][0],
                x: input_text,
                y: output_text,
                type: "heatmap",
                colorscale: "Portland"
            }];
            Plotly.newPlot("heatmapDiv", data, {}, {showSendToCloud: true});
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
}