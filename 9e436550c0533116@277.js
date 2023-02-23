function _1(md) {
    return (
        md `# Chicago Crashes`
    )
}

function _2(html) {
    return (
        html `<code>css</code> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.0/css/bootstrap.min.css" integrity="sha384-PDle/QlgIONtM1aqA2Qemk5gPOE7wFq8+Em+G/hmo5Iq0CCmYZLv3fVRDJ4MMwEA" crossorigin="anonymous">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>`
    )
}

function _L(require) {
    return (
        require('leaflet@1.5.1')
    )
}

function _d3(require) {
    return (
        require('d3')
    )
}

function _dc(require) {
    return (
        require('dc')
    )
}

function _bootstrap(require) {
    return (
        require('bootstrap')
    )
}

function _crossfilter(require) {
    return (
        require('crossfilter2')
    )
}

function _buildvis(md, container, dc, d3, type_crime_dimension, type_crime_group, colorScale, day_dimension, dayGroup, dataset) {
    let view = md `${container()}`

    let crimesByTypeBar = dc.barChart(view.querySelector('#bytype-chart'))
    let crimesByDaySerie = dc.seriesChart(view.querySelector('#byday-serie'))

    crimesByTypeBar
        .width(480)
        .height(200)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .gap(56)
        .elasticX(true)
        .dimension(type_crime_dimension)
        .group(type_crime_group)
        .colors(colorScale)
        .colorAccessor(d => d.key)

    crimesByDaySerie
        .width(480)
        .height(200)
        .dimension(day_dimension)
        .group(dayGroup)
        .x(d3.scaleTime().domain(d3.extent(dataset, d => d3.timeDay(d.date))))
        .xUnits(d3.timeDays)
        .seriesAccessor(d => d.key[0])
        .keyAccessor(d => d.key[1])
        .valueAccessor(d => d.value)
        .colors(colorScale)
        .colorAccessor(d => d.key[0])
        .renderHorizontalGridLines(true)
        .yAxisLabel("Number of crimes")
        .xAxisLabel("Time")

    dc.renderAll()

    return view
}


function _colorScale(d3) {
    return (
        d3.scaleOrdinal()
        .domain(["NO INDICATION OF INJURY", "REPORTED, NOT EVIDENT", "NONINCAPACITATING INJURY", "FATAL"])
        .range(["#ca0020", "#0571b0", "#fdae61", "#25d41c", "#1a0ce8"])
    )
}

function _dataset(d3) {
    return (
        d3.csv('https://gist.githubusercontent.com/Dinesh2908/c2c0e883401d93f4047653e5e5be9492/raw/#file-chicago_trafficcrashes_nov1-10-csv').then(function(data) {
            let dateFormat = d3.utcParse("%Y-%m-%d");

            data.forEach(function(d) {
                d.date = dateFormat(d.CRASH_DATE.substr(0, 10));
                d.MOST_SEVERE_INJURY = d["MOST_SEVERE_INJURY"];
            });

            return data
        })
    )
}

function _map(buildvis, L) {
    buildvis;

    let mapInstance = L.map('mapid').setView([41.878113, -87.629799], 10)
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 17
    }).addTo(mapInstance)

    return mapInstance
}


function _circles_layer(L, map) {
    return (
        L.layerGroup().addTo(map)
    )
}

function _circles(circles_layer, dataset, L, colorScale) {
    circles_layer.clearLayers()
    dataset.forEach(function(d) {
        let circle = L.circle([d.LATITUDE, d.LONGITUDE], 300, {
            color: colorScale(d.MOST_SEVERE_INJURY),
            weight: 0.5,
            fillColor: colorScale(d.MOST_SEVERE_INJURY),
            fillOpacity: 0.5,
        })
        circle.bindPopup("Crime Type: " + d.MOST_SEVERE_INJURY + "<br>Time: " + d.data)
        circles_layer.addLayer(circle)
    })
}


function _facts(crossfilter, dataset) {
    return (
        crossfilter(dataset)
    )
}

function _type_crime_dimension(facts) {
    return (
        facts.dimension(d => d.MOST_SEVERE_INJURY)
    )
}

function _type_crime_group(type_crime_dimension) {
    return (
        type_crime_dimension.group()
    )
}

function _day_dimension(facts, d3) {
    return (
        facts.dimension(d => [d.MOST_SEVERE_INJURY, d3.timeDay(d.date)])
    )
}

function _dayGroup(day_dimension) {
    return (
        day_dimension.group()
    )
}

function _container() {
    return (
        function container() {
            return `
<main role="main" class="container">
    <div class="row">
      <h4>Crashes in Chicago (2022 Nov 1st - 10th)</h4>
    </div>
    <div class='row'>
        <div id='mapid' class="col-6"></div>

        <div class="col-6">
          <div id='bytype-chart'>
            <h5>Number of Crashes by Type of MOST_SEVERE_INJURY</h5>
          </div>

          <div id='byday-serie'>
            <h5>Number of Crashes by Day </h5>
          </div>
        </div>
    </div>
  </main>
 `
        }
    )
}

function _20(html) {
    return (
        html `
<style>
#mapid{
  width: 650px;
  height: 480px;
}

.dc-chart path.dc-symbol, .dc-legend g.dc-legend-item.fadeout {
  fill-opacity: 0.5;
  stroke-opacity: 0.5; }

.dc-chart rect.bar {
  stroke: none;
  cursor: pointer; }
  .dc-chart rect.bar:hover {
    fill-opacity: .5; }

.dc-chart rect.deselected {
  stroke: none;
  fill: #ccc; }

.dc-chart .pie-slice {
  fill: #fff;
  font-size: 12px;
  cursor: pointer; }
  .dc-chart .pie-slice.external {
    fill: #000; }
  .dc-chart .pie-slice :hover, .dc-chart .pie-slice.highlight {
    fill-opacity: .8; }

.dc-chart .pie-path {
  fill: none;
  stroke-width: 2px;
  stroke: #000;
  opacity: 0.4; }

.dc-chart .selected path, .dc-chart .selected circle {
  stroke-width: 3;
  stroke: #ccc;
  fill-opacity: 1; }

.dc-chart .deselected path, .dc-chart .deselected circle {
  stroke: none;
  fill-opacity: .5;
  fill: #ccc; }

.dc-chart .axis path, .dc-chart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges; }

.dc-chart .axis text {
  font: 10px sans-serif; }

.dc-chart .grid-line, .dc-chart .axis .grid-line, .dc-chart .grid-line line, .dc-chart .axis .grid-line line {
  fill: none;
  stroke: #ccc;
  shape-rendering: crispEdges; }

.dc-chart .brush rect.selection {
  fill: #4682b4;
  fill-opacity: .125; }

.dc-chart .brush .custom-brush-handle {
  fill: #eee;
  stroke: #666;
  cursor: ew-resize; }

.dc-chart path.line {
  fill: none;
  stroke-width: 1.5px; }

.dc-chart path.area {
  fill-opacity: .3;
  stroke: none; }

.dc-chart path.highlight {
  stroke-width: 3;
  fill-opacity: 1;
  stroke-opacity: 1; }

.dc-chart g.state {
  cursor: pointer; }
  .dc-chart g.state :hover {
    fill-opacity: .8; }
  .dc-chart g.state path {
    stroke: #fff; }

.dc-chart g.deselected path {
  fill: #808080; }

.dc-chart g.deselected text {
  display: none; }

.dc-chart g.row rect {
  fill-opacity: 0.8;
  cursor: pointer; }
  .dc-chart g.row rect:hover {
    fill-opacity: 0.6; }

.dc-chart g.row text {
  fill: #fff;
  font-size: 12px;
  cursor: pointer; }

.dc-chart g.dc-tooltip path {
  fill: none;
  stroke: #808080;
  stroke-opacity: .8; }

.dc-chart g.county path {
  stroke: #fff;
  fill: none; }

.dc-chart g.debug rect {
  fill: #00f;
  fill-opacity: .2; }

.dc-chart g.axis text {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none; }

.dc-chart .node {
  font-size: 0.7em;
  cursor: pointer; }
  .dc-chart .node :hover {
    fill-opacity: .8; }

.dc-chart .bubble {
  stroke: none;
  fill-opacity: 0.6; }

.dc-chart .highlight {
  fill-opacity: 1;
  stroke-opacity: 1; }

.dc-chart .fadeout {
  fill-opacity: 0.2;
  stroke-opacity: 0.2; }

.dc-chart .box text {
  font: 10px sans-serif;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none; }

.dc-chart .box line {
  fill: #fff; }

.dc-chart .box rect, .dc-chart .box line, .dc-chart .box circle {
  stroke: #000;
  stroke-width: 1.5px; }

.dc-chart .box .center {
  stroke-dasharray: 3, 3; }

.dc-chart .box .data {
  stroke: none;
  stroke-width: 0px; }

.dc-chart .box .outlier {
  fill: none;
  stroke: #ccc; }

.dc-chart .box .outlierBold {
  fill: red;
  stroke: none; }

.dc-chart .box.deselected {
  opacity: 0.5; }
  .dc-chart .box.deselected .box {
    fill: #ccc; }

.dc-chart .symbol {
  stroke: none; }

.dc-chart .heatmap .box-group.deselected rect {
  stroke: none;
  fill-opacity: 0.5;
  fill: #ccc; }

.dc-chart .heatmap g.axis text {
  pointer-events: all;
  cursor: pointer; }

.dc-chart .empty-chart .pie-slice {
  cursor: default; }
  .dc-chart .empty-chart .pie-slice path {
    fill: #fee;
    cursor: default; }

.dc-data-count {
  float: right;
  margin-top: 15px;
  margin-right: 15px; }
  .dc-data-count .filter-count, .dc-data-count .total-count {
    color: #3182bd;
    font-weight: bold; }

.dc-legend {
  font-size: 11px; }
  .dc-legend .dc-legend-item {
    cursor: pointer; }

.dc-hard .number-display {
  float: none; }

div.dc-html-legend {
  overflow-y: auto;
  overflow-x: hidden;
  height: inherit;
  float: right;
  padding-right: 2px; }
  div.dc-html-legend .dc-legend-item-horizontal {
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer; }
    div.dc-html-legend .dc-legend-item-horizontal.selected {
      background-color: #3182bd;
      color: white; }
  div.dc-html-legend .dc-legend-item-vertical {
    display: block;
    margin-top: 5px;
    padding-top: 1px;
    padding-bottom: 1px;
    cursor: pointer; }
    div.dc-html-legend .dc-legend-item-vertical.selected {
      background-color: #3182bd;
      color: white; }
  div.dc-html-legend .dc-legend-item-color {
    display: table-cell;
    width: 12px;
    height: 12px; }
  div.dc-html-legend .dc-legend-item-label {
    line-height: 12px;
    display: table-cell;
    vertical-align: middle;
    padding-left: 3px;
    padding-right: 3px;
    font-size: 0.75em; }

.dc-html-legend-container {
  height: inherit; }
</style>`
    )
}

function _$(require) {
    return (
        require('jquery').then(jquery => {
            window.jquery = jquery;
            return require('popper@1.0.1/index.js').catch(() => jquery);
        })
    )
}

export default function define(runtime, observer) {
    const main = runtime.module();
    main.variable(observer()).define(["md"], _1);
    main.variable(observer()).define(["html"], _2);
    main.variable(observer("L")).define("L", ["require"], _L);
    main.variable(observer("d3")).define("d3", ["require"], _d3);
    main.variable(observer("dc")).define("dc", ["require"], _dc);
    main.variable(observer("bootstrap")).define("bootstrap", ["require"], _bootstrap);
    main.variable(observer("crossfilter")).define("crossfilter", ["require"], _crossfilter);
    main.variable(observer("buildvis")).define("buildvis", ["md", "container", "dc", "d3", "type_crime_dimension", "type_crime_group", "colorScale", "day_dimension", "dayGroup", "dataset"], _buildvis);
    main.variable(observer("colorScale")).define("colorScale", ["d3"], _colorScale);
    main.variable(observer("dataset")).define("dataset", ["d3"], _dataset);
    main.variable(observer("map")).define("map", ["buildvis", "L"], _map);
    main.variable(observer("circles_layer")).define("circles_layer", ["L", "map"], _circles_layer);
    main.variable(observer("circles")).define("circles", ["circles_layer", "dataset", "L", "colorScale"], _circles);
    main.variable(observer("facts")).define("facts", ["crossfilter", "dataset"], _facts);
    main.variable(observer("type_crime_dimension")).define("type_crime_dimension", ["facts"], _type_crime_dimension);
    main.variable(observer("type_crime_group")).define("type_crime_group", ["type_crime_dimension"], _type_crime_group);
    main.variable(observer("day_dimension")).define("day_dimension", ["facts", "d3"], _day_dimension);
    main.variable(observer("dayGroup")).define("dayGroup", ["day_dimension"], _dayGroup);
    main.variable(observer("container")).define("container", _container);
    main.variable(observer()).define(["html"], _20);
    main.variable(observer("$")).define("$", ["require"], _$);
    return main;
}