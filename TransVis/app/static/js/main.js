var selected_layer;
var selected_head_list = [];
var input_text;
var output_text;
var cross_attn;
var layer_num;
var head_num;
var input_length;
var output_length;
var opacity_scale;

$(document).ready(function () {

    // initialize dropdown list
    $('.ui.dropdown')
        .dropdown();

    // create color map for different heads
    var color_map = d3.scale.category10();

    // bind dropdown list action
    $("#layerSelect").dropdown({
        onChange: function () {
            selected_layer = parseInt($("#layerSelect").dropdown('get value'));

            var max_value = d3.max(cross_attn[selected_layer], function (heads_array) {
                return d3.max(heads_array, function (array) {
                    return d3.max(array);
                })
            });

            // linear scaler for opacity
            opacity_scale = d3.scale.linear()
                .domain([0, max_value])
                .range([0, 0.8]);
        }
    });

    // bind checkbox action
    $(".headSelect").checkbox({
        onChecked: function () {
            selected_head_list.push(parseInt($(this).attr('id').slice(10)));
        },
        onUnchecked: function () {
            var index = selected_head_list.indexOf(parseInt($(this).attr('id').slice(10)));
            if (index != -1) {
                selected_head_list.splice(index, 1);
            }
        }
    });

    $.get("../static/data/cross.json", function (data) {
        // load data to global variable
        input_text = data['article'];
        output_text = data['summary'];
        cross_attn = data['cross_attn'];

        // save dimention to global variable
        layer_num = cross_attn.length;
        head_num = cross_attn[0].length;
        output_length = cross_attn[0][0].length;
        input_length = cross_attn[0][0][0].length;

        // TODO: append layer and head dynamically according to `layer_num` and `head_num`

        // append input and output data HTML
        append_text(input_text, output_text);

        // change text color for head select checkbox
        for (i = 0; i < head_num; i++) {
            $('#headSelectLabel' + i.toString()).css({
                'color': color_map(i)
            });
        }

        // set default value for attention dropdown and layer dropdown
        $("#attentionSelect").dropdown('set selected', '1');
        $("#layerSelect").dropdown('set selected', '0');

        // bind hover action to output text
        $('.outputText').hover(
            function () {
                if (typeof(selected_layer) === 'undefined') return;
                if (selected_head_list.length === 0) return;

                // get current output id (0 ~ 100)
                current_id = $(this).attr('id');
                var selected_id = parseInt(current_id.slice(6));

                // loop over each head and add floating div
                for (i = 0; i < selected_head_list.length; i++) {
                    var highlight_color = $('#headSelectLabel' + selected_head_list[i].toString()).css('color');

                    // loop over each input
                    for (j = 0; j < input_length; j++) {
                        var weight = cross_attn[selected_layer][selected_head_list[i]][selected_id][j];

                        // generate highlight div id, e.g.: highlightHead0Output0Input0
                        var highlightId = 'highlightHead' + selected_head_list[i].toString() + 'Output' + selected_id.toString() + 'Input' + j.toString();
                        $('#input' + j.toString()).append("<div class='highlightBackground' id=\'" + highlightId + "\'></div>");
                        $('#' + highlightId).css({
                            'position': 'absolute',
                            'width': '100%',
                            'height': '100%',
                            'top': '0',
                            'left': '0',
                            'background-color': highlight_color.replace('rgb', 'rgba')
                                .replace(')', ', ' + opacity_scale(weight).toString() + ')'),
                            'z-index': '-1'
                        });
                        $('#output' + selected_id.toString()).css({
                            'font-weight': 'bold'
                        })
                    }
                }
            },
            function () {
                if (typeof(selected_layer) === 'undefined') return;
                if (selected_head_list.length === 0) return;

                // remove highlight background on top of input text
                $('.highlightBackground').remove();
                // get current output id (0 ~ 100)
                current_id = $(this).attr('id');
                var selected_id = parseInt(current_id.slice(6));
                $('#output' + selected_id.toString()).css({
                    'font-weight': ''
                })
            }
        );

        // heatmapdata = cross_attn;
        //
        // function drawImage(imageObj) {
        //     var canvas = document.getElementById("heatmapCanvas");
        //     var context = canvas.getContext("2d");
        //     var imageX = 0;
        //     var imageY = 0;
        //
        //     context.drawImage(imageObj, imageX, imageY);
        //
        //     var x_labels = input_text;
        //     var y_labels = output_text;
        //     var data = [{
        //         z: heatmapdata[0][0],
        //         x: input_text,
        //         y: output_text,
        //         type: "heatmap",
        //         colorscale: "Portland"
        //     }];
        //     Plotly.newPlot("heatmapDiv", data, {}, {showSendToCloud: true});
        // }
        //
        // var imageObj = new Image();
        // imageObj.onload = function () {
        //     drawImage(this);
        // };
        // imageObj.src = "https://images.plot.ly/plotly-documentation/images/heatmap-galaxy.jpg";
    });
});

function append_text(input, output) {
    $('#highlightTextFieldInput').append("<p>Input Text: </p>");
    for (i = 0; i < input.length; i++) {
        if (input[i].charAt(0) === '▁') {
            word = input[i].slice(1);
        }
        else {
            word = input[i];
        }
        $('#highlightTextFieldInput').append("<div id = \'input" + i + "\' class='inputText'>" + word + "&nbsp </div>");
        $('#input' + i.toString()).css({
            'position': 'relative',
            'float': 'left',
            'z-index': 10
        });
    }
    $('#highlightTextFieldInput').append('<br> <br>');

    $('#highlightTextFieldOutput').append("<p>Output Text: </p>");
    for (i = 0; i < output.length; i++) {
        if (output[i].charAt(0) === '▁') {
            word = output[i].slice(1);
        }
        else {
            word = output[i];
        }
        $('#highlightTextFieldOutput').append("<div id = \'output" + i + "\' class='outputText'>" + word + "&nbsp </div>");
        $('#output' + i.toString()).css({
            'position': 'relative',
            'float': 'left',
            'z-index': 10
        });
    }
    $('#highlightTextFieldOutput').append('<br> <br>');
};
