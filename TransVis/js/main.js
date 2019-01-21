var validFeatureNames = [];
var minFrame;
var maxFrame;
var maxFilterValue = [];
var minFilterValue = [];
var firstSelect = true;
var filterOption = ["frames_appeared", "max_speed", "mean_speed", "min_speed",
                    "trace_x_range", "trace_y_range", "travel_distance",
                    "mean_angle", "max_angle", "accumulated_angle"];
filterOption.sort();
filterOption.push("No Filter");

$(document).ready(function() {

    // automatically scale `pseudoVideoBackground`
    // leave the left height to `trajectoryPanel`
    $("#pseudoVideoBackground").height($("#pseudoVideoBackground").width() * 0.5625);
    $("#trajectoryPanelContainer").height($("#video").height() - $("#pseudoVideoBackground").height());
    // automatically adjust `mdsChart` to a square
    $("#mdsChart").height($("#mdsChart").width());
    $("#parentDiv").height($("#panel").height() - $("#selectPanel").height() - $("#mdsChart").height());

    // load video file
    d3.json("json/filedir.json", function(error, filedata) {
        var vl = d3.selectAll('#videoOption');
        vl.selectAll('#videoOption')
            .data(filedata)
            .enter()
            .append('div')
            .attr('class', 'item')
            .attr('data-value', function(d) {
                return d;
            })
            .text(function(d) {
                return d;
            });

        // load selected video data
        $('#videoSelect .dropdown').dropdown({
            onChange: function() {
                if (!firstSelect) {
                    //update the pseudo video slider
                    var keypressSlider = document.getElementById('keypress');
                    keypressSlider.noUiSlider.destroy();
                    initializePage();
                    d3.select('#mdsChart')
                        .selectAll('svg')
                        .remove();
                    d3.select("#antNumView")
                        .selectAll('svg')
                        .remove();
                    d3.selectAll(".speedFilterInfo")
                        .remove();
                    $('#directionSelect .dropdown').dropdown('restore placeholder text');
                    $('#directionSelect .dropdown').dropdown('clear');
                    $('#boxControlPanel .dropdown').dropdown('restore placeholder text');
                    $('#boxControlPanel .dropdown').dropdown('clear');
                    $('#xScatterSelect').dropdown('restore placeholder text');
                    $('#yScatterSelect').dropdown('clear');
                    $('#trajectoryPanel .ui.checkbox').checkbox('set unchecked');

                }
                var selected = $('#videoSelect .dropdown')
                    .dropdown('get value');
                var filepath = "json/" + selected[0] + "/";
                $("#loader").attr("class", "ui massive active loader");
                d3.json(filepath + "ant.json", function(error, data) {
                    d3.json(filepath + "frame.json", function(error, fdata) {
                        d3.json(filepath + "feature.json", function(error, feadata) {
                            d3.json(filepath + "all_clusters.json", function(error, clusdata) {
                                d3.json(filepath + "heatmap.json", function(error, hdata) {
                                    d3.json(filepath + "ant_num.json", function(error, numdata) {
                                        antdata = data;
                                        framedata = fdata;
                                        featuredata = feadata;
                                        clusterdata = clusdata;
                                        heatmapdata = hdata;
                                        antNumdata = numdata;

                                        // find start and end frame of pseudo video
                                        maxFrame = d3.max(framedata, function(frame) {
                                            return frame["frame_id"];
                                        });
                                        minFrame = d3.min(framedata, function(frame) {
                                            return frame["frame_id"];
                                        });

                                        for (var i in filterOption) {
                                            maxFilterValue[filterOption[i]] = d3.max(featuredata, function(feature) {
                                                return feature[filterOption[i]]
                                            });
                                            minFilterValue[filterOption[i]] = d3.min(featuredata, function(feature) {
                                                return feature[filterOption[i]]
                                            });
                                        }

                                        // set frame range to the slider
                                        d3.select('#myTimeSlider')
                                            .select('#slider')
                                            .attr('min', function() {
                                                return minFrame;
                                            });
                                        d3.select('#myTimeSlider')
                                            .select('#slider')
                                            .attr('max', function() {
                                                return maxFrame;
                                            });
                                        $("#slider").val(minFrame);
                                        $('#range').html(minFrame);

                                        // find calculated features
                                        validFeatureNames = [];
                                        for (var feature in featuredata[0]) {
                                            if (feature != "ant_id") validFeatureNames.push(feature);
                                            // sort feature names alphabetically
                                            validFeatureNames.sort();
                                        };
                                        // if user select the video for the first time
                                        if (firstSelect) {
                                            initializeClusterSelect();
                                            initializePlayButton();
                                            drawScatterChartSelect();
                                            drawBoxChartSelect();
                                        }
                                        initializeTrajectoryOption();
                                        initializeTimeFilter();
                                        firstSelect = false;
                                        $("#loader").attr("class", "ui massive disabled loader");
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    });
});

// initialize full webpage
// remove all svg and set all checkbox to unchecked
initializePage = function() {
    clearPlayer();
    deselectAllAntBox();
    // clean checkboxes on `control-panel`
    d3.selectAll('#checkBoxlist')
        .selectAll('div')
        .remove();
    d3.selectAll('#clusterBox')
        .selectAll('.ui.checkbox')
        .remove();
    d3.selectAll("#antBox")
        .selectAll('div')
        .remove();
};


