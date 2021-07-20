'use strict';

//// Track how the PWA was launched
window.addEventListener('DOMContentLoaded', () => {
init();
});

var lables = {
    // user labels
    "Excited" : "H/P",
    "Happy" : "H/P",
    "Pleased" : "H/P",
    "Relaxed" : "L/P",
    "Peaceful" : "L/P",
    "Calm" : "L/P",
    "Sleepy" : "L/N",
    "Bored" : "L/N",
    "Sad" : "L/N",
    "Nervous" : "H/N",
    "Annoying" : "H/N",
    "Angry" : "H/N",
    // app labels
    "Anger" : "H/N",
    "Disgust" : "H/N",
    "Fear" : "H/N",
    "Happiness" : "H/P",
    "Neutral" : "L/P",
    "Sadness" : "L/N",
    "Surprise" : "H/P",
};
var user_selection = [];
var app_selection = [];
//========== install PWA as mobile app


var vgaButton = document.querySelector('button#vga');
var qvgaButton = document.querySelector('button#qvga');
var hdButton = document.querySelector('button#hd');
var dimensions = document.querySelector('p#dimensions');
var video = document.querySelector('video#video_container');
var indicator = document.querySelector('#indicator');

// screen capture
var screenshotButton = document.querySelector('#screen_buttons');
var end_record = document.querySelector('#end_record');
var popUpImage = document.querySelector('#pop-up-image');
var img = document.querySelector('#screenshot-img');
var showResult = document.querySelector('#show_result');
var image_container = document.querySelector('#image_container');
var toggleButton = document.querySelector('#toggle-btn');
var canvas = document.createElement('canvas');
var pic_count = 0;
var pic_number = image_link.length;
var frame_per_second = 3;
//$('input[type="radio"]').click(function(){
//    user_selection.push(this.value);
//    toggleButton.click();
//    $('#screen_buttons').toggle();
//});
end_record.onclick = function(){
    recorde_flag = false;
    socket.emit('end_record');
}
screenshotButton.onclick = function() {
    recorde_flag = true;
    if(pic_count >= pic_number)
      {
        pic_count++;
    }
    pic_count++;
};
//======
function successCallback(stream) {
  window.stream = stream; // stream available to console
  video.srcObject = stream;
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
  vgaButton.click();
}



var qvgaConstraints = {
    audio: false,
      video: {
        width: { max: 320 },
        height: { max: 240 }
      }
}

var vgaConstraints = {
  audio: false,
      video: {
        width: { max: 640 },
        height: { max: 480 }
      }
};

var hdConstraints = {
  audio: false,
      video: {
        width: { max: 1280 },
        height: { max: 720 }
      }
};

qvgaButton.onclick = function() {
  getMedia(qvgaConstraints);
};
vgaButton.onclick = function() {
  getMedia(vgaConstraints);
};
hdButton.onclick = function() {
  getMedia(hdConstraints);
};

function getMedia(constraints) {
  if (window.stream) {
    video.src = null;
    window.stream.getVideoTracks()[0].stop();
  }
  navigator.mediaDevices.getUserMedia(
    constraints
  ).then(
    successCallback,
    errorCallback
  );
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('./service-worker.js')
    .then(function(registration) {
        console.log('Service Worker Registered!');
        return registration;
    })
    .catch(function(err) {
        console.error('Unable to register service worker.', err);
    });
}

//hdButton.click();
qvgaButton.click();

//================== send image to server
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    window.location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
var url_param = findGetParameter('new_url');
var recorde_flag = false;
//    var socket = io('http://127.0.0.1:8080');
//    var socket = io('http://vibe:80');
    var socket = io();

var tta = '';
//var socket = io('https://vibe-ml-engine-o5tympfaqq-lz.a.run.app/:8080');
socket.on('connect', function(){
  console.log('connected');
});
//socket.on('client event', function(data){console.log('my event');});
socket.on('disconnect', function(){console.log('disconnect');});
var xcanvas = document.createElement("CANVAS");
function sendmessage() {
    var img_temp = document.createElement('img');

    xcanvas.width = video.videoWidth;
    xcanvas.height = video.videoHeight;
    xcanvas.getContext('2d').drawImage(video, 0, 0);
    var new_message = xcanvas.toDataURL('image/png');
    //alert (new_message);
    img_temp.src = xcanvas.toDataURL('image/png');
    img_temp.width = video.videoWidth/10;
    img_temp.height = video.videoHeight/10;
    image_container.appendChild(img_temp);
    var selected_model = 'both';
    if($('#left').is(':checked'))
        selected_model = 'left';
    else if($('#right').is(':checked'))
        selected_model = 'right';
    else if($('#both').is(':checked'))
        selected_model = 'both';

    socket.emit('start_record', [new_message,slider.value/1,slider_2.value/100,selected_model,slider_fear.value/100]);

}
var rec_message = 0;
//socket.on('hardware_usage', function (data) {
//    if(data.error == 'None')
//    {
//        var data_temp = data.response
//        var cpu_value = 0
//        var memory_value = 0
//        for (var prop in data_temp) {
//          if (data_temp.hasOwnProperty(prop)) {
//                if(prop == 'cpu')
//                {
//                    cpu_value = parseFloat(data_temp[prop])
//                }
//                else if(prop == 'memory')
//                {
//                    memory_value = parseFloat(data_temp[prop])
//                }
//            }
//        }
//
//
//    }
//});
socket.on('new_message_client_temp', function (data) {
    if(data.error == 'None')
  {
    var data_temp = data.response
    var arousal = 0
    var valence = 0
    var scaler = 1
    var multiplier = 200 //
    var posi = $('#indicator');
    var cpu = $('#cpu_usage');
    var mem = $('#memory_usage');
    var cpu_value = 0
    var memory_value = 0

//    console.log(posi.position().left);
//    console.log(posi.position().top);
    for (var prop in data_temp) {
      if (data_temp.hasOwnProperty(prop)) {
        if(prop == 'arousal')
        {
            arousal = parseFloat(data_temp[prop])
        }
        else if(prop == 'valence')
        {
            valence = parseFloat(data_temp[prop])
        }
        else if(prop == 'cpu')
        {
            cpu_value = parseFloat(data_temp[prop])
        }
        else if(prop == 'memory')
        {
            memory_value = parseFloat(data_temp[prop])
        }
        else if(prop == 'labels')
            adjust_value([
                parseFloat(data_temp[prop][0]),
                parseFloat(data_temp[prop][1]),
                parseFloat(data_temp[prop][2]),
                parseFloat(data_temp[prop][3]),
                parseFloat(data_temp[prop][4]),
                parseFloat(data_temp[prop][5]),
                parseFloat(data_temp[prop][6])
                ]);

//        current_top = $('#indicator').style.top
//        current_left = $('#indicator').style.left
//        alert(current_top,current_left)
//        $('#indicator').animate({
//            top: $('#indicator').style.top + Math.round(180*arousal) + 'px',
//            left: $('#indicator').style.left + Math.round(180*valence) + 'px',
//        });
      }
    }
//    var left_new = 215+Math.round(scaler*180*valence)
//    if valence > 0:
//        valence = valence * 5
    var left_new = 215+Math.round(scaler*multiplier*valence)
    console.log(left_new)
//    var top_new = 210-Math.round(scaler*180*arousal)
//    if arousal < 0:
//        arousal = arousal * 5
    var top_new = 210-Math.round(scaler*multiplier*arousal)
    console.log(top_new)
    posi.animate({
        left: ''+ left_new +'px',
        top: ''+ top_new +'px'
    },
    {
    duration: 400
    });
    cpu.html(cpu_value);
    mem.html(memory_value);
//    alert(rec_message);
//    alert(app_selection);
    console.log('====================');
    console.log(cpu_value);
    console.log(memory_value);
    console.log(valence);
    console.log(arousal);
    console.log(left_new);
    console.log(top_new);
//    console.log(data.response);
  }
  else
//    alert(data.error);
    {
        console.log(data.error);
        console.log(data.response);
        console.log(data);
    }
});

socket.on('new_message_client', function (data) {
//    alert('test')
  //socket.broadcast.emit('new_message', data);
  if(data.error == 'None')
  {
    var data_temp = data.response
    var maxProp = null
    var maxValue = -1
    for (var prop in data_temp) {
      if (data_temp.hasOwnProperty(prop)) {
        var value = parseFloat(data_temp[prop])
        if (value > maxValue) {
          maxProp = prop
          maxValue = value
        }
      }
    }
    app_selection.push(maxProp);
    rec_message++;
//    alert(rec_message);
//    alert(app_selection);
    console.log(maxProp);
    console.log(maxValue);
    console.log(data.response);
    console.log(app_selection);
  }
  else
    alert(data.error);
});
var myVar;
myVar = setInterval(function() {
    if(recorde_flag === true)
        sendmessage();
}, 1000/frame_per_second);
//================== wheel selector

var nbOptions = 7;
var angleStart = -360;

// jquery rotate animation
function rotate(li,d) {
    $({d:angleStart}).animate({d:d}, {
        step: function(now) {
            now+=30;
            $(li)
               .css({ transform: 'rotate('+now+'deg)' })
               .find('label')
                  .css({ transform: 'rotate('+(-now)+'deg)' });
        }, duration: 0
    });
}

// show / hide the options
function toggleOptions(s) {
    $(s).toggleClass('open');
    var li = $(s).find('li');
    var deg = $(s).hasClass('half') ? 180/(li.length-1) : 360/li.length;
    for(var i=0; i<li.length; i++) {
        var d = $(s).hasClass('half') ? (i*deg)-90 : i*deg;
        $(s).hasClass('open') ? rotate(li[i],d) : rotate(li[i],angleStart);
    }
}

$('.selector button').click(function(e) {
    toggleOptions($(this).parent());
});

setTimeout(function() { toggleOptions('.selector'); }, 100);//@ sourceURL=pen.js

//================== wheel selector

//================== bar chart
// REf
// http://stackoverflow.com/questions/40061862/chart-js-update-bars-of-a-bar-chart
var canvas = document.getElementById("barChart");
var ctx = canvas.getContext('2d');
canvas.height = 250;
var chartType = 'bar';
var myBarChart;

// Global Options:
Chart.defaults.global.defaultFontColor = 'white';
Chart.defaults.global.defaultFontSize = 12;

var data = {
  labels: ["Anger", "Disgust", "Fear", "Happiness", "Neutral", "Sadness", "Surprise"],
  datasets: [{
    label: "Facial Emotion Recognition",
    fill: false,
    lineTension: 0.1,
    backgroundColor: "rgba(0,255,0,0.4)",
    borderColor: "green", // The main line color
    borderCapStyle: 'square',
    pointBorderColor: "white",
    pointBackgroundColor: "green",
    pointBorderWidth: 1,
    pointHoverRadius: 8,
    pointHoverBackgroundColor: "yellow",
    pointHoverBorderColor: "green",
    pointHoverBorderWidth: 2,
    pointRadius: 4,
    pointHitRadius: 10,
    data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ],
    spanGaps: true,
  }]
};
var options = {
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  },
  title: {
    fontSize: 18,
    display: true,
    text: 'Percentage of Emotions',
    position: 'bottom'
  }
};


function init() {
  // Chart declaration:
  myBarChart = new Chart(ctx, {
    type: chartType,
    data: data,
    options: options
  });
}


function addData() {
  myBarChart.data.labels[12] ="2017";
  myBarChart.data.labels[13] ="2018";
  myBarChart.data.datasets[0].data[12] = 0.9;
  myBarChart.data.datasets[0].data[13] = 0.1;
  myBarChart.update();
}

function adjust_value(values) {
  myBarChart.data.datasets[0].data = values;
  myBarChart.update();
}