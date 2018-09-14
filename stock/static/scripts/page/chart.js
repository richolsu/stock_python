var formatTime = function(unixTimestamp) {
  var dt = new Date(unixTimestamp);

  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var day = dt.getDate();
  var hours = dt.getHours();
  var minutes = dt.getMinutes();
  var seconds = dt.getSeconds();
  var millisecs = dt.getMilliseconds()

  // the above dt.get...() functions return a single digit
  // so I prepend the zero here when needed

  if (month < 10)
    month = '0' + month;

  if (day < 10)
    day = '0' + day;

  if (hours < 10)
    hours = '0' + hours;

  if (minutes < 10)
    minutes = '0' + minutes;

  if (seconds < 10)
    seconds = '0' + seconds;

  if (millisecs < 10)
    millisecs = '00' + millisecs;
  else if (millisecs < 100)
    millisecs = '0' + millisecs;

  return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":"
      + seconds + "." + millisecs;
}

var formatValue = function(value) {

  if (value == undefined || isNaN(value))
    return '';
  
  if (value < 1)
    value = Number.parseFloat(value).toFixed(6);
  else if (value < 100)
    value = Number.parseFloat(value).toFixed(4);
  else
    value = Number.parseFloat(value).toFixed(2);
  
  return value;
}

function onChangeExchange(exchangeTarget, symbolTarget) {
  var exchange =$(exchangeTarget).val();
  $(symbolTarget).find('option').remove();
  var key_list=[], select = [];
  $.each(select_list, function(key, item){
    if (item.exchange == exchange && $.inArray(item.symbol, key_list) == -1) {
      key_list.push(item.symbol);
      $(symbolTarget).append($('<option>').text(item.symbol).attr('value', item.symbol));
    }
  })
  

}

function formatUTCTime(time) {
  return formatTime(time + new Date().getTimezoneOffset()*60*1000);  
}

AmCharts.useUTC = true;
function createStockChart(targetDivId) {
  
  var options = {
      "type" : "stock",
      "theme": "light",

      // "color": "#fff",
      "dataSets" : [ {
        "dataProvider" : [],
        "fieldMappings" : [ {
          "fromField" : "open",
          "toField" : "open"
        }, {
          "fromField" : "high",
          "toField" : "high"
        }, {
          "fromField" : "low",
          "toField" : "low"
        }, {
          "fromField" : "close",
          "toField" : "close"
        }, {
          "fromField" : "volume",
          "toField" : "volume"
        }, {
          "fromField" : "color",
          "toField" : "color"
        }, {
          "fromField" : "labelColor",
          "toField" : "labelColor"            
        }, {
          "fromField" : "count",
          "toField" : "count"
        } ],
        "color" : "#777",
        "title" : "Stock",
        "compared" : false,
        "categoryField" : "date",
      } ],

      "panels" : [
          {
            "showCategoryAxis" : false,    
            
//            "valueAxis" : { 
//              "showFirstLabel":false,
//              "dashLength" : 5, 
//              "maxiumum" : 80 
//            },
//              "categoryAxis" : { 
//              "dashLength" : 1 
//            },             
            "title" : "",
            "percentHeight" : 70,
            "stockGraphs" : [ {
              "type" : "candlestick",
              "id" : "g1",
              "openField" : "open",
              "closeField" : "close",
              "highField" : "high",
              "lowField" : "low",
              "valueField" : "close",
              "lineColor" : "#00ff00",
              "fillColors" : "#00ff00",
              "negativeLineColor" : "#e05f2f",
              "negativeFillColors" : "#e05f2f",
              "fillAlphas" : 1,
              "comparedGraphLineThickness" : 2,
              "columnWidth" : 0.7,
              "useDataSetColors" : false,
              "comparable" : true,
              "compareField" : "close",
              "showBalloon" : false,
              "proCandlesticks" : true
            } ],

            "stockLegend" : {
              "markerSize" : 0,
              "labelText" : "",
              "markerType" : "none",
              "valueTextRegular" : "Open: [[open]] High: [[high]] Low: [[low]] Close: [[close]] Volume: [[volume]]",
            // "periodValueTextComparing": "[[percents.value.close]]%"
            }
          }, {
            "title" : "Volume",
            "percentHeight" : 30,
            "columnWidth" : 0.7,
            "showCategoryAxis" : true,

            "categoryAxis": {
              "boldPeriodBeginning":false,
              "markPeriodChange":false,
              "equalSpacing" : false,
              "gridAlpha" : 0.5,
              "maxSeries" : 240000,
              "minPeriod" : "1DD",
              "gridColor" : "#ffffff",
              "dateFormats" : [ {
                period : 'fff',
                format : 'JJ:NN:SS.QQQ'
              }, {
                period : 'ss',
                format : 'JJ:NN:SS'
              }, {
                period : 'mm',
                format : 'JJ:NN:SS'
              }, {
                period : 'hh',
                format : 'LA'
              }, {
                period : 'DD',
                format : 'MMM DD'
              }, {
                period : 'WW',
                format : 'MMM DD'
              }, {
                period : 'MM',
                format : 'MMM DD'
              }, {
                period : 'YYYY',
                format : 'YYYY'
              } ],
              "labelFunction": function(valueText, date, categoryAxis) {
                if (this.minPeriod == "100fff"){
                  valueText = valueText.substr(0, valueText.length-2);
                }
                return valueText;
              }
            },
            "marginTop": 20,
            "stockGraphs" : [ {
              "valueField" : "volume",
              "countField" : "count",
              "fillColorsField" : "color",
              "lineColorField" : "color",
              "type" : "column",
              "fontSize": 9,
              "labelColorField": "labelColor",
              "labelOffset": -3,
              "labelPosition": "inside",
              "balloonText" : "#Results: <b>[[count]]</b>",
              "fillAlphas" : 1,
              "showBalloon": false,
              "lineColor" : "#22272c",
              "fillColors" : "#22272c",
            } ],
            "stockLegend" : {                    
              "enabled" : false,
              "markerType" : "none",
              "markerSize" : 0,
              "labelText" : "",
              "periodValueTextRegular" : "[[volume]]"
            },
          } ],

      "panelsSettings" : {
        "color" : "#080e15",
        "plotAreaFillColors" : "#080e15",
        "plotAreaFillAlphas" : 1,
        "marginLeft" : 70,
        "marginRight": 40,
        "marginTop" : 5,
        "marginBottom" : 5,
        "usePrefixes" : false
      },

      "chartScrollbarSettings" : {
        "enabled": false,
        "graph" : "g1",
        "graphType" : "line",
        "usePeriod" : "DD",
        "backgroundColor" : "#080e15",
        "graphFillColor" : "#666",
        "graphFillAlpha" : 0.5,
        "gridColor" : "#fff",
        "gridAlpha" : 1,
        "selectedBackgroundColor" : "#444",
        "selectedGraphFillAlpha" : 1
      },

      "categoryAxesSettings" : {
        "boldPeriodBeginning":false,
        "markPeriodChange":false,
        "equalSpacing" : false,
        "gridAlpha" : 0.5,
        "maxSeries" : 240000,
        "minPeriod" : "1DD",
        "gridColor" : "#ffffff",
        "dateFormats" : [ {
          period : 'fff',
          format : 'JJ:NN:SS.QQQ'
        }, {
          period : 'ss',
          format : 'JJ:NN:SS'
        }, {
          period : 'mm',
          format : 'JJ:NN:SS'
        }, {
          period : 'hh',
          format : 'LA'
        }, {
          period : 'DD',
          format : 'MMM DD'
        }, {
          period : 'WW',
          format : 'MMM DD'
        }, {
          period : 'MM',
          format : 'MMM DD'
        }, {
          period : 'YYYY',
          format : 'YYYY'
        } ]
      },

      "valueAxesSettings" : {
        "gridColor" : "#ffffff",
        "gridAlpha" : 0.5,
//        "color": "#ffffff",
        "showFirstLabel":true,
        "showLastLabel":false,
        "inside" : false,        
      },

      "chartCursorSettings" : {
        "fullWidth" : true,
        "cursorColor" : '#e05f2f',
        "cursorAlpha" : 0.7,
        "pan" : true,
        "cursorPosition" : "middle",
        "valueLineEnabled" : true,
        "valueLineBalloonEnabled" : true,
        "categoryBalloonDateFormats" : [ {
          period : "YYYY",
          format : "YYYY"
        }, {
          period : "MM",
          format : "YYYY-MM"
        }, {
          period : "WW",
          format : "YYYY-MM-DD"
        }, {
          period : "DD",
          format : "YYYY-MM-DD"
        }, {
          period : "hh",
          format : "LA"
        }, {
          period : "mm",
          format : "JJ:NN"
        }, {
          period : "ss",
          format : "JJ:NN:SS"
        }, {
          period : "fff",
          format : "JJ:NN:SS.fff"
        } ]
      },

      "legendSettings" : {
      // "color": "#fff"
      },

      "stockEventsSettings" : {
        "showAt" : "high",
        "type" : "pin"
      },

      "balloon" : {
        "textAlign" : "left",
        "offsetY" : 10
      },
      "listeners": [{
        "event": "dataUpdated",
        "method": function(e) {
          
          if (targetDivId == 'history_chart') {
            for (var x in e.chart.periodSelector.periods) {
              var period = e.chart.periodSelector.periods[x];
              if ('MAX' == period.period) {
                period.selected = true;
              } else {
                period.selected = false;
              }
            }

            e.chart.periodSelector.setDefaultPeriod();
            
          }else{
            var data = e.chart.dataSets[0].dataProvider;
            if (data.length > 0)
              e.chart.zoom(new Date(data[0].date), new Date(data[data.length-1].date));
          }
        }
      }]
  };
  
  var period_options = {
      "periodSelector" : {
        "hideOutOfScopePeriods" : true,
        "inputFieldsEnabled" : false,
        "position" : "bottom",
        "periods" : [ {
          "period" : "hh",
          "count" : 1,
          "label" : "1 Hour"
        }, {
          "period" : "DD",
          "count" : 1,
          "label" : "1 Day"
        }, {
          "period" : "DD",
          "count" : 15,
          "label" : "15 Days"
        }, {
          "period" : "MM",
          "count" : 1,
          "label" : "1 Month"
        }, {
          "period" : "MAX",
          "label" : "MAX"
        } ]
      },
  }
  
  var labelOption = {
      "panels" : [{},{
        "stockGraphs" : [ {
        "labelText": "[[count]]",
        }]
      }]                    
  }
  if (targetDivId == 'history_chart') {
    options =$.extend(true, options, period_options, labelOption);
  }
  
  var chart = AmCharts.makeChart(targetDivId, options);

  return chart;
}

var histo, detail, compare1, compare2, strategy_result;
var hightlight_bar_color = '#f3c200';
var normal_bar_color = '#777777';
var highlight_label_color = '#000000';
  
jQuery(document).ready(
    function() {
      

      var key_list=[], select = [];
      $.each(select_list, function(key, item){
        if ($.inArray(item.exchange, key_list) == -1) {
          key_list.push(item.exchange);          
          $('#history_exchange').append($('<option>').text(item.exchange).attr('value', item.exchange));
          $('#compare1_exchange').append($('<option>').text(item.exchange).attr('value', item.exchange));
          $('#compare2_exchange').append($('<option>').text(item.exchange).attr('value', item.exchange));
        }
      })
      
      $.each(strategy_list, function(key, item){
        $('#analytics_strategy').append($('<option>').text(item).attr('value', item));
      })
      

      onChangeExchange('#history_exchange', '#history_trading_pair');
      onChangeExchange('#compare1_exchange', '#compare1_trading_pair');
      onChangeExchange('#compare2_exchange', '#compare2_trading_pair');
      
      var today = new Date();
      $('#history_to').datepicker("setDate", today);
      $('#history_from').datepicker("setDate",
          new Date(today.setMonth(today.getMonth() - 3)));
      $('#history_from, #history_to').change(function() {
        refresh_history_chart();
      });            


      var oTable = $('#strategy_result').DataTable({
        processing : true,
        serverSide : true,
        searching : false,
        ordering : true,
        scrollY: "200px",
        scrollX : true,
        paging: false,
        ajax : {
          url : strategy_page_url,
          type : "POST",
          data : function(data) {
            var filter = {
              order: data.columns[data.order[0].column].data,
              dir:data.order[0].dir,
              strategy : $('#analytics_strategy').val(),
              exchange : $('#history_exchange').val(),
              symbol : $('#history_trading_pair').val(),
              threshold : $('#analytics_threshold').val(),
              granularityInMs : $('#analytics_group_size').val(),
              start_date : $('#history_from').val(),
              end_date : $('#history_to').val()
            }
            return filter;
          },
          dataSrc : function(json) {
            return json;
          },
        },
        select : { style: 'single' },
        columns : [ {
          data : 'startMs',
          render : formatTime,
          title : 'Time'
        }, {
          data : 'startMs',
          render : formatUTCTime,
          title : 'Time(UTC)'
        }, {
          data : 'importance', 
          render: function(data) {
            return Number.parseFloat(data).toFixed(2);
          },
          title : '%'
        }, {
          data : 'volume',
          render : function(data){
            return Number.parseFloat(data).toFixed(4);
          },
          title : 'Trading Volume'
        }, {
          data : 'count',
          title : 'Count'            
        }, {
          data : 'open',
          render : formatValue,
          title : 'Open Price'            
        }, {
          data : 'high',
          render : formatValue,
          title : 'High Price'
        }, {
          data : 'low',
          title : 'Low Price',
          render : formatValue,
        }, {
          data : 'close',
          title : 'Close Price',
          render : formatValue,
        }, {
          data : 'startMs',
          title : 'Start Time in MS'
        } ],
//        language: {select: {rows: {1: ""}}},
        columnDefs: [
          { className: "dt-right", "targets": [2, 3, 4, 5, 6, 7, 8] }
        ],
        order: [  [ 0, "desc" ] ],
        fnDrawCallback : function(oSettings, b, c) {
          $('#strategy_result').DataTable().row(':eq(0)', {
            page : 'current'
          }).select();
          refresh_detail_chart();
        }
      });

      
      $("#strategy_result").click(function(event) {
        oTable.row(event.target.parentNode).select();
        refresh_detail_chart();
      });
      
      AmCharts.ready(function() {
        histo = createStockChart('history_chart');

        refresh_history_chart();
      });

      function blockUI(targetId) {
        App.blockUI({
            target: targetId,
            overlayColor: '#ffffff',
            animate: true
        });
      }
      
      function unblockUI(targetId) {
        App.unblockUI(targetId);
      }
      
      
      function check_data(data, startMs, endMs, chart) {
        var chart_name = '';
        switch(chart) {
          case detail: 
            chart_name='detail';
            break;
          case compare1: 
            chart_name='compare1';
            break;
          case compare2: 
            chart_name='compare2';
            break;
            
        }
        if (data.length == 0) {
          toastr.warning("There are no data to draw " + chart_name + " chart", "Sorry!");
          data = {
            dummyValue: 0
          };
          chart.panels[0].addLabel(0, '50%', 'The chart contains no data', 'center', 14, 'yellow');
          chart.dataSets[0].dataProvider = data;
          chart.validateNow();
        }else{
          chart.panels[0].clearLabels();
          var open=0, high=0, low=0, close=0;
          $.each(data, function(key, item){
            open += item.open;
            high += item.high;
            low += item.low;
            close += item.close;
            item.volume = Number.parseFloat(item.volume).toFixed(4);
            item.count = 0;
            item.color = normal_bar_color;
          });
          
          open = open/data.length;
          high = high/data.length;
          low = low/data.length;
          close = close/data.length;
          
          if (data[0].date>startMs) {
            data = [{date:startMs, open:open, high:high, low:low, close:close}, ...data];
          }
          if (data[data.length-1].date<endMs) {
            data.push({date:endMs});
          }
          
          switch ($('#time_range_select').val()) {
            case "100":
              chart.categoryAxesSettings.minPeriod = "100fff";
              chart.chartScrollbarSettings.usePeriod = "100fff";
              break;
            case "1000":
              chart.categoryAxesSettings.minPeriod = "1ss";
              chart.chartScrollbarSettings.usePeriod = "1ss";
              break;
            case "3000":
              chart.categoryAxesSettings.minPeriod = "3ss";
              chart.chartScrollbarSettings.usePeriod = "3ss";
              break;
            case "6000":
              chart.categoryAxesSettings.minPeriod = "6ss";
              chart.chartScrollbarSettings.usePeriod = "6ss";
              break;
          }

          chart.dataSets[0].dataProvider = data;
          chart.validateData();
          
        }
      }
      
      
      function refresh_history_chart() {
        
        $('#display_on_chart').prop('checked', false);
        $.ajax({
          beforeSend: function(){
            blockUI('#history_chart');
          },
          complete: function(){
            unblockUI('#history_chart');
          },
          type : "POST",
          url : history_url,
          data : {
            strategy : $('#analytics_strategy').val(),
            group_size: $('#analytics_group_size').val(),
            threshold : $('#analytics_threshold').val(),
            exchange : $('#history_exchange').val(),
            symbol : $('#history_trading_pair').val(),
            granularityInMs : $('#history_granularity').val(),
            start_date : $('#history_from').val(),
            end_date : $('#history_to').val()
          },
          success : function(data, res) {
            if (data.length == 0) {
              toastr.warning("There are no data to draw history chart", "Sorry!");
              data = {
                dummyValue: 0
              };
              histo.panels[0].addLabel(0, '50%', 'The chart contains no data', 'center', 14, 'yellow');
              histo.dataSets[0].dataProvider = data;
              histo.validateNow();
              
            }else{
              histo.panels[0].clearLabels();
              $.each(data, function(key, item) {
                item.count = 0;
                item.volume = Number.parseFloat(item.volume).toFixed(4);
                item.color = normal_bar_color;
                item.labelColor = normal_bar_color;
              })

              switch ($('#history_granularity').val()) {
                case "1440":
                  histo.categoryAxesSettings.minPeriod = "DD";
                  histo.chartScrollbarSettings.usePeriod = "DD";
                  break;
                case "360":
                  histo.categoryAxesSettings.minPeriod = "6hh";
                  histo.chartScrollbarSettings.usePeriod = "6hh";
                  break;
                case "60":
                  histo.categoryAxesSettings.minPeriod = "1hh";
                  histo.chartScrollbarSettings.usePeriod = "1hh";
                  break;
                case "15":
                  histo.categoryAxesSettings.minPeriod = "15mm";
                  histo.chartScrollbarSettings.usePeriod = "15mm";
                  break;
              }

//              var stockEvents = [ {
//                date: new Date(1525132800000),
//                type: "arrowUp",
//                backgroundColor: "#00CC00",
//                graph: "g1",
//                description: "Highest value"
//              }, {
//                date: new Date(1528243200000),
//                type: "arrowDown",
//                backgroundColor: "#CC0000",
//                graph: "g1",
//                description: "Lowest value"
//              } ];
//              histo.dataSets[0].stockEvents = stockEvents;
              histo.dataSets[0].dataProvider = data;              
              histo.validateData();

            }
            

          },
        });

      }

      function refresh_detail_chart() {

        if (detail == undefined)
          return;
        
        var selectedRowData = oTable.row({
          selected : true
        }).data();
        if (selectedRowData == undefined)
          return;
        startMs = selectedRowData.startMs;
        granularityInMs = $('#time_range_select').val();
        startMs = startMs - granularityInMs * 30;
        endMs = startMs + granularityInMs * 60;

        $.ajax({
          beforeSend: function(){
            blockUI('#detail_chart');
          },
          complete: function(){
            unblockUI('#detail_chart');
          },
          type : "POST",
          url : detail_url,
          data : {
            strategy : $('#analytics_strategy').val(),
            group_size: $('#analytics_group_size').val(),
            threshold : $('#analytics_threshold').val(),
            exchange : $('#history_exchange').val(),
            symbol : $('#history_trading_pair').val(),
            granularityInMs : $('#time_range_select').val(),
            start_date : startMs,
            end_date : endMs
          },
          success : function(data, res) {
            
            data = check_data(data, startMs, endMs, detail);
          },
        });
        
        $('#compare1_trading_pair').trigger('change');
        $('#compare2_trading_pair').trigger('change');

      }

      function get_strategy_result() {

        $.ajax({
          beforeSend: function(){
            blockUI();
          },
          complete: function(){
            unblockUI();
          },
          type : "POST",
          url : strategy_run_url,
          data : {
            strategy : $('#analytics_strategy').val(),
            exchange : $('#history_exchange').val(),
            symbol : $('#history_trading_pair').val(),
            threshold : $('#analytics_threshold').val(),
            granularityInMs : $('#analytics_group_size').val(),
            start_date : $('#history_from').val(),
            end_date : $('#history_to').val()
          },
          success : function(data, res) {
            if (data.total == 0) {
              toastr.warning("There are no strategy result", "Sorry!");
              data.percent = 0;
              data.volume = 0;
            }
            
            $('#result_total').html(data.total);
            $('#result_average_percent').html(data.percent);
            $('#result_average_volume').html(formatValue(data.volume));
          },
        });

      }

      function refresh_compare1_chart() {

        var selectedRowData = oTable.row({
          selected : true
        }).data();
        startMs = selectedRowData.startMs;
        granularityInMs = $('#time_range_select').val();
        startMs = startMs - granularityInMs * 30;
        endMs = startMs + granularityInMs * 60;

        $.ajax({
          beforeSend: function(){
            blockUI('#compare_chart_1');
          },
          complete: function(){
            unblockUI('#compare_chart_1');
          },
          type : "POST",
          url : detail_url,
          data : {
            strategy : $('#analytics_strategy').val(),
            group_size: $('#analytics_group_size').val(),
            threshold : $('#analytics_threshold').val(),
            exchange : $('#compare1_exchange').val(),
            symbol : $('#compare1_trading_pair').val(),
            granularityInMs : granularityInMs,
            start_date : startMs,
            end_date : endMs
          },
          success : function(data, res) {

            data = check_data(data, startMs, endMs, compare1);            
            
          },
        });

      }

      function refresh_compare2_chart() {

        var selectedRowData = oTable.row({
          selected : true
        }).data();
        startMs = selectedRowData.startMs;
        granularityInMs = $('#time_range_select').val();
        startMs = startMs - granularityInMs * 30;
        endMs = startMs + granularityInMs * 60;

        $.ajax({
          beforeSend: function(){
            blockUI('#compare_chart_2');
          },
          complete: function(){
            unblockUI('#compare_chart_2');
          },          
          type : "POST",
          url : detail_url,
          data : {
            strategy : $('#analytics_strategy').val(),
            group_size: $('#analytics_group_size').val(),
            threshold : $('#analytics_threshold').val(),
            exchange : $('#compare2_exchange').val(),
            symbol : $('#compare2_trading_pair').val(),
            granularityInMs : granularityInMs,
            start_date : startMs,
            end_date : endMs
          },
          success : function(data, res) {

            data = check_data(data, startMs, endMs, compare2);

          },
        });

      }

      function update_strategy_all_result() {
        $.ajax({
          type : "POST",
          url : strategy_all_url,
          data : {
            strategy : $('#analytics_strategy').val(),
            exchange : $('#history_exchange').val(),
            symbol : $('#history_trading_pair').val(),
            threshold : $('#analytics_threshold').val(),
            granularityInMs : $('#analytics_group_size').val(),
            start_date : $('#history_from').val(),
            end_date : $('#history_to').val()
          },
          success : function(data, res) {
            strategy_result = data;
            if ($('#display_on_chart').is(':checked')) {
              display_on_chart();
            }
          }
        });
      }
      
      $('#run_strategy').click(function() {
        $('#strategy_body').removeClass('hidden');
        if (detail == undefined) {
          detail = createStockChart('detail_chart');
          $("#detail_chart .amcharts-period-selector-div").remove();
        }
          
        

        get_strategy_result();
        update_strategy_all_result();
        
        oTable.draw();
      })
      
      $('#detail_exchange').text($("#history_exchange option:selected").text());
      $('#detail_trading_pair').text($("#history_trading_pair option:selected").text());

      $('#history_exchange, #history_trading_pair, #history_granularity')
          .change(function() {
            
            $('#detail_exchange').text($("#history_exchange option:selected").text());
            $('#detail_trading_pair').text($("#history_trading_pair option:selected").text());
            
            if ($(this).attr("id") == 'history_exchange') {
              onChangeExchange('#history_exchange', '#history_trading_pair');
            }              

            refresh_history_chart();
          })

      $('#compare1_exchange, #compare1_trading_pair').change(function() {
        
        if ($(this).attr("id") == 'compare1_exchange') {
          onChangeExchange('#compare1_exchange', '#compare1_trading_pair');
        }
        
        if ($('#compare1_exchange').val() != 0
            && $('#compare1_trading_pair').val() != 0) {
          $('#compare_chart_1').removeClass('hidden');
          if (compare1 == undefined) {
            compare1 = createStockChart('compare_chart_1');
            $("#compare_chart_1 .amcharts-period-selector-div").remove();
          }
            
          refresh_compare1_chart();
        } else {
          $('#compare_chart_1').addClass('hidden');
        }
      })

      $('#compare2_exchange, #compare2_trading_pair').change(function() {
        
        if ($(this).attr("id") == 'compare2_exchange') {
          onChangeExchange('#compare2_exchange', '#compare2_trading_pair');
        }
        
        if ($('#compare2_exchange').val() != 0
            && $('#compare2_trading_pair').val() != 0) {
          $('#compare_chart_2').removeClass('hidden');
          if (compare2 == undefined) {
            compare2 = createStockChart('compare_chart_2');
//            delete compare2.periodSelector;
          }
            
          refresh_compare2_chart();
        } else {
          $('#compare_chart_2').addClass('hidden');
        }
      })

      function display_on_chart() {
        
        if ($('#display_on_chart').is(':checked')) {
          var dt = $('#history_granularity').val() * 60000;
          $.each(histo.dataSets[0].dataProvider, function(key, hist_value) {
            var group_cnt = 0;
            $.each(strategy_result, function(key, stg_value) {
              if (hist_value.date <= stg_value && stg_value.startMs < hist_value.date + dt) {
                group_cnt++;
              }
            })
            
            hist_value.count = group_cnt;
            
            if (hist_value.count>0) {
              hist_value.color = hightlight_bar_color;
              hist_value.labelColor = highlight_label_color;

            } else {
              hist_value.color = normal_bar_color;
              hist_value.labelColor = normal_bar_color;

            }

          });
          histo.panels[1].stockGraphs[0].showBalloon = true;
          
        }else{
          $.each(histo.dataSets[0].dataProvider, function(key, hist_value) {
            hist_value.color = normal_bar_color;
            hist_value.labelColor = normal_bar_color;
            histo.panels[1].stockGraphs[0].showBalloon = false;
          });
        }
        
        histo.validateData();
              
      }
      
      $('#display_on_chart').change(function(a, b, c) {
        blockUI('#history_chart');
        display_on_chart();
        unblockUI('#history_chart');
      })

      $('#time_range_select').change(function() {
        refresh_detail_chart();
      })
      
      
    })