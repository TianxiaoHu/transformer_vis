var selected_layer;
var selected_head_list = [];
var input_text;
var output_text;
var cross_attn;
var layer_num;
var head_num;
var input_length;
var output_length;
// var opacity_scale;

$(document).ready(function () {

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
            // opacity_scale = d3.scale.linear()
            //     .domain([0, max_value])
            //     .range([0, 0.8]);
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

    $('#animation').on("click", function () {
        live_show();
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
        append_input(input_text);
        append_output(output_text);

        // change text color for head select checkbox
        for (i = 0; i < head_num; i++) {
            $('#headSelectLabel' + i.toString()).css({
                'color': color_map(i)
            });
        }

        // set default value for attention dropdown and layer dropdown
        $("#attentionSelect").dropdown('set selected', '1');
        $("#layerSelect").dropdown('set selected', '0');


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

function opacity_log_scale(weight) {
// transform weight -> [0, 1] to opacity ->[0, 1] in log scale
// opacity = max(1/2 * (log10(weight) + 2), 0)
    if (weight < 0.01) return 0;
    else {
        return (Math.log10(weight) + 2) / 2;
    }
}

function append_input(input) {
    $('#highlightTextFieldInput').append("<p>Input Text: </p>");
    for (i = 0; i < input.length; i++) {
        if (input[i].charAt(0) === '▁') {
            word = input[i].slice(1);
        }
        else {
            word = input[i];
        }
        if (i && input[i - 1] === '⇧') {
            word = word.toUpperCase();
        }
        if (i && input[i - 1] === '↑') {
            word = word.slice(0, 1).toUpperCase() + word.slice(1);
        }
        $('#highlightTextFieldInput').append("<div id = \'input" + i + "\' class='inputText'>" + word + "&nbsp </div>");
        $('#input' + i.toString()).css({
            'position': 'relative',
            'float': 'left',
            'z-index': 10
        });
    }
    $('#highlightTextFieldInput').append('<br> <br>');

    // bind hover action to input text
    $('.inputText').hover(
        function () {
            if (typeof(selected_layer) === 'undefined') return;
            if (selected_head_list.length === 0) return;

            // get current input id (0 ~ 400)
            current_id = $(this).attr('id');
            var selected_id = parseInt(current_id.slice(5));

            // loop over each head and add floating div
            for (i = 0; i < selected_head_list.length; i++) {
                var highlight_color = $('#headSelectLabel' + selected_head_list[i].toString()).css('color');

                // loop over each output
                for (j = 0; j < output_length; j++) {
                    var weight = cross_attn[selected_layer][selected_head_list[i]][j][selected_id];

                    // generate highlight div id, e.g.: highlightHead0Input0Output0
                    var highlight_id = 'highlightHead' + selected_head_list[i].toString() + 'Input' + selected_id.toString() + 'Output' + j.toString();
                    $('#output' + j.toString()).append("<div class='highlightBackground' id=\'" + highlight_id + "\'></div>");
                    $('#' + highlight_id).css({
                        'position': 'absolute',
                        'width': '100%',
                        'height': '100%',
                        'top': '0',
                        'left': '0',
                        'background-color': highlight_color.replace('rgb', 'rgba')
                            .replace(')', ', ' + opacity_log_scale(weight).toString() + ')'),
                        'z-index': '-1'
                    });
                    $('#input' + selected_id.toString()).css({
                        'font-weight': 'bold'
                    })
                }
            }
        },
        function () {
            if (typeof(selected_layer) === 'undefined') return;
            if (selected_head_list.length === 0) return;

            // remove highlight background on top of output text
            $('.highlightBackground').remove();
            // get current input id (0 ~ 400)
            current_id = $(this).attr('id');
            var selected_id = parseInt(current_id.slice(5));
            $('#input' + selected_id.toString()).css({
                'font-weight': ''
            })
        }
    );
}

function append_output(output) {
    $('#highlightTextFieldOutput').append("<p>Output Text: </p>");
    for (i = 0; i < output.length; i++) {
        if (output[i].charAt(0) === '▁') {
            word = output[i].slice(1);
        }
        else {
            word = output[i];
        }
        if (i && output[i - 1] === '⇧') {
            word = word.toUpperCase();
        }
        if (i && output[i - 1] === '↑') {
            word = word.slice(0, 1).toUpperCase() + word.slice(1);
        }
        $('#highlightTextFieldOutput').append("<div id = \'output" + i + "\' class='outputText'>" + word + "&nbsp </div>");
        $('#output' + i.toString()).css({
            'position': 'relative',
            'float': 'left',
            'z-index': 10
        });
    }

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
                    var highlight_id = 'highlightHead' + selected_head_list[i].toString() + 'Output' + selected_id.toString() + 'Input' + j.toString();
                    $('#input' + j.toString()).append("<div class='highlightBackground' id=\'" + highlight_id + "\'></div>");
                    $('#' + highlight_id).css({
                        'position': 'absolute',
                        'width': '100%',
                        'height': '100%',
                        'top': '0',
                        'left': '0',
                        'background-color': highlight_color.replace('rgb', 'rgba')
                            .replace(')', ', ' + opacity_log_scale(weight).toString() + ')'),
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
};

function live_show() {
    $('#highlightTextFieldOutput').empty();
    // animation
    $('#highlightTextFieldOutput').append("<p>Output Text: </p>");

    // word index to loop over output text
    var w_i = 0;
    var timer = setInterval(function () {
            // clean highlight generated in previous word
            $('.highlightBackground').remove();
            if (w_i) {
                $('#output' + (w_i - 1).toString()).css({
                    'font-weight': ''
                })
            }

            if (w_i === output_length) {
                // reset timer
                clearInterval(timer);
                // clean and re-append HTML
                $('#highlightTextFieldOutput').empty();
                append_output(output_text);
            }
            else {
                if (output_text[w_i].charAt(0) === '▁') {
                    word = output_text[w_i].slice(1);
                }
                else {
                    word = output_text[w_i];
                }
                if (w_i && output_text[w_i - 1] === '⇧') {
                    word = word.toUpperCase();
                }
                if (w_i && output_text[w_i - 1] === '↑') {
                    word = word.slice(0, 1).toUpperCase() + word.slice(1);
                }
                // append word in the chart
                $('#highlightTextFieldOutput').append("<div id = \'output" + w_i + "\' class='outputText'>" + word + "&nbsp </div>");
                $('#output' + w_i.toString()).css({
                    'position': 'relative',
                    'float': 'left',
                    'z-index': 10
                });
                if (typeof(selected_layer) === 'undefined') {
                    w_i++;
                    return;
                }

                // get current output id (0 ~ 100)
                var selected_id = w_i;
                for (i = 0; i < selected_head_list.length; i++) {
                    var highlight_color = $('#headSelectLabel' + selected_head_list[i].toString()).css('color');

                    // loop over each input
                    for (j = 0; j < input_length; j++) {
                        var weight = cross_attn[selected_layer][selected_head_list[i]][selected_id][j];

                        // generate highlight div id, e.g.: highlightHead0Output0Input0
                        var highlight_id = 'highlightHead' + selected_head_list[i].toString() + 'Output' + selected_id.toString() + 'Input' + j.toString();
                        $('#input' + j.toString()).append("<div class='highlightBackground' id=\'" + highlight_id + "\'></div>");
                        $('#' + highlight_id).css({
                            'position': 'absolute',
                            'width': '100%',
                            'height': '100%',
                            'top': '0',
                            'left': '0',
                            'background-color': highlight_color.replace('rgb', 'rgba')
                                .replace(')', ', ' + opacity_log_scale(weight).toString() + ')'),
                            'z-index': '-1'
                        });
                        $('#output' + selected_id.toString()).css({
                            'font-weight': 'bold'
                        })
                    }
                }
                w_i++;
            }
            // new word appears every 30 milliseconds
        }, 30
    );
}
