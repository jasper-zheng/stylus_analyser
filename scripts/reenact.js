let file_list;
let lines;
let events = [];
let eventsT = [];

let cur_page = 0;
let cur_task = 2;
let cur_log = "s1d3_ter2_score"

let to_trace = false;

let time_updated = false;

// ==========================
// constants:

const width_base = 0.01;
const width_scale = 2.4;
const fading_speed = 0.007;
const fading_min = 0.06;

var canvas_width = 740;
var canvas_width_default = 740;

// ==========================
// lists:

const tasks = ['body scanning', 'exploring', 'scoring']

// ==========================
// elements

var selectTaskDOM = []
var selectSessionDOM = []
var selectPage, selectTask, selectSession;

// ==========================
// player: 

let audioPlayer = 0;
audioPlayer.duration = -1;
let playButton;
let pauseButton;
let seekBar;
let curTime, durTime;

// ==========================
// timeline:

var eventsLoaded = 0;
var canplaythroughLoaded = 0;

function MainCanvas(p){
	p.preload = function() {
		// put setup code here
		p.loadJSON('../../../../../data/files_clean.json', p.handleJSON);
	}
	p.handleJSON = function(data){
		createTimeline();
		file_list = data;
		console.log(file_list['s1d3_ter2_score']['logs']);
		lines = p.loadStrings('../../../../../data/' + file_list['s1d3_ter2_score']['logs'], p.parseLogs);
	}
	p.parseLogs = function(data){
		var page_count = 0;
		var this_page = [];
		events = []
		eventsT = []
		data.forEach((line_str, index) => {
			var line_data = line_str.split(',');
			var e = {
				page:parseInt(line_data[0]),
				x:parseInt(line_data[1]),
				y:parseInt(line_data[2]),
				p:parseFloat(line_data[3]),
				event:line_data[4],
				decay:Boolean(parseInt(line_data[5])),
				r:parseFloat(line_data[6]),
				g:parseFloat(line_data[7]),
				b:parseFloat(line_data[8]),
				t:parseFloat(line_data[9]),
			}
			if (e.page==page_count){
				this_page.push(e);
				if (index == data.length - 1){
					events.push(this_page);
				}
			} else {
				events.push(this_page);
				this_page = new Array();
				this_page.push(e);
				page_count = page_count+1;
			}
			eventsT.push(e.t)
		})
		console.log('event done update')
		cur_page = events.length - 1;
		if (to_trace){
			p.listPages();
			to_trace = false;
		}

		eventsLoaded = 1;
		// console.log(events)
		// refreshTimeline(data.length);
	}
	p.windowResized = function(){
		canvas_width = Math.min(canvas_width_default, p.windowWidth-30);
		p.resizeCanvas(canvas_width,canvas_width/760*400)
		p.trace(audioPlayer.currentTime);
		resizeTimeline();
	}
	p.listLogs=function(){
		selectSession.innerHTML = '';
		selectSessionDOM = [];
		Object.entries(file_list).forEach(([log, file_path]) => {
			if (cur_task == 0){
				if (log.includes("bodyscan")){
					p.addDOM(log)
				}
			} else if (cur_task == 1){
				if ((!log.includes("bodyscan")&&(!log.includes("score")))) {
					p.addDOM(log)
				}
			} else {
				if (log.includes("score")){
					p.addDOM(log)
				}
			}
	    });
	}

	p.addDOM = function(log_name){
		const option = document.createElement("div");
		option.setAttribute('class', cur_log == log_name ? 'ct_div actived' : 'ct_div');
		option.innerHTML = log_name;
		selectSession.appendChild(option);
		selectSessionDOM.push(option)
	}

	p.listPages = function(){
		selectPage.innerHTML = '';
	    for (let i = 0; i < events.length; i++){
	    	const option = document.createElement("option");
	    	option.setAttribute('value',i);
	    	option.innerHTML = i;
	    	if (i==events.length-1){
	    		option.setAttribute('selected','selected');
	    	}
	    	selectPage.appendChild(option);
	    }
	    setTimeout(()=>{p.trace(9999.0);},50)
	}

	p.setup = function() {
		console.log('setting');
		selectPage = document.getElementById("selectPage");
		selectTask = document.getElementById("selectTask");
		selectSession = document.getElementById("selectSession");

	    var canvas = p.createCanvas(canvas_width,canvas_width/760*400);
		canvas.parent('canvasContainer');
		console.log('eventsT: ')
	    console.log(eventsT)

	    // ===========================================
	    // controllers:

	    tasks.forEach((task,index) =>{
	    	const option = document.createElement("div");
	    	option.setAttribute('class', cur_task == index ? 'ct_div actived' : 'ct_div');
	    	option.setAttribute('value',index);
	    	option.innerHTML = task;
	    	selectTask.appendChild(option);
	    	selectTaskDOM.push(option)
	    })

	    selectTask.addEventListener('click', function(e) {
	        // Check if the clicked element is a table cell
	        if (e.target.tagName === 'DIV') {
	            // console.log(`You clicked: ${e.target.getAttribute('value')}`);
	            cur_task = e.target.getAttribute('value')
	            selectTaskDOM.forEach((dom,index) =>{
			    	dom.setAttribute('class', cur_task == index ? 'ct_div actived' : 'ct_div');
			    })
			    p.listLogs()
	        }
	    });

	    p.listLogs()

	    selectSession.addEventListener('click', function(e) {
	        if (e.target.tagName === 'DIV') {
	            cur_log = e.target.textContent
	            selectSessionDOM.forEach((dom,index) =>{
			    	dom.setAttribute('class', cur_log == dom.textContent ? 'ct_div actived' : 'ct_div');
			    })
			    to_trace = true;
			    lines = p.loadStrings('../../../../../data/' + file_list[cur_log]['logs'], p.parseLogs);
	        }
	        audioPlayer.src='../../../../../data/' + file_list[cur_log]['audio']
	    	audioPlayer.load();
	    	seekBar.value = 0;
	    });

	    // ===========================================
	    // draw:

	    p.listPages();

	    selectPage.addEventListener('change', function() {
	        cur_page = this.value;
	        setTimeout(()=>{p.trace(9999.0);},20)
	        
	    });
	    
	    // ===========================================
	    // audio:
	    audioPlayer = document.getElementById('audioPlayer')
	    playButton = document.getElementById('playButton');
		pauseButton = document.getElementById('pauseButton');
		seekBar = document.getElementById('seekBar');
		curTime = document.getElementById('curTime');
		durTime = document.getElementById('durTime');


	    audioPlayer.src='../../../../../data/' + file_list[cur_log]['audio']
	    audioPlayer.load();
		audioPlayer.addEventListener('canplaythrough', function(){
			console.log('canplaythrough')
			durTime.innerHTML = (audioPlayer.duration||0).toFixed(3);
			seekBar.max = audioPlayer.duration||0;
			// refreshTimeline(audioPlayer.duration||0);
			canplaythroughLoaded = audioPlayer.duration||0
		}, false);

		// Play the audio
		playButton.addEventListener('click', () => {
		    audioPlayer.play();
		});
		pauseButton.addEventListener('click', () => {
		    audioPlayer.pause();
		});

		// Update the slider as the audio plays
		audioPlayer.addEventListener('timeupdate', () => {
		    seekBar.value = audioPlayer.currentTime || 0;
		    time_updated = true;
		});

		// Seek to a specific time in the audio when the slider is moved
		seekBar.addEventListener('input', () => {
		    audioPlayer.currentTime = seekBar.value;
		});

	}
	p.trace = function(frame) {
		p.scale(canvas_width/760)
		p.background(20);
		p.strokeCap(p.SQUARE);

		let ink = 1.0;
		let ink_now = 1.0;
		let startX, startY, prevX, prevY, anchorX, anchorY;
		prevX = 0.0;
		prevY = 0.0;

		var pen_down = true;
		for (let i = events[cur_page].length; i > 0; i--){
			const phase = events[cur_page][i-1];
			if (frame<phase.t){
				continue;
			}
			if (phase.decay){
				ink -= fading_speed;
				ink_now = Math.max(fading_min, ink);
			} else {
				ink_now = 1.0;
			}
			p.stroke(phase.r*255,phase.g*255,phase.b*255,ink_now*255);
			p.strokeWeight(width_base + width_scale * phase.p);

			anchorX = phase.x;
	        anchorY = phase.y;

			if ((i == events[cur_page].length)||(phase.event=="up")||pen_down){
				startX = phase.x;
				startY = phase.y;
				pen_down = false;
			} else {
				startX = prevX;
				startY = prevY;
			}
			// console.log(startX + ' ' + startY + '; ' + anchorX + ' ' + anchorY)
			p.line(startX, startY, anchorX, anchorY)
			prevX = anchorX;
			prevY = anchorY;
		}
	}
	p.draw = function() {
	  // put drawing code here
		curTime.innerHTML = audioPlayer.currentTime.toFixed(3)
		
		if (time_updated){
			// console.log('time update')
			p.trace(audioPlayer.currentTime);
			time_updated = false;
		}
	}
}

new p5(MainCanvas);

var timeline_instance;

var frame_size = 10;
var timelineHeight = 40;

function Timeline(p){
	p.length = 0;
	p.sec_per_frame = 0;
	p.setup = function() {
		console.log('creating timeline');
		var timelineContainer = document.getElementById("timelineContainer");
	    var canvas = p.createCanvas(canvas_width,canvas_width/760*timelineHeight);
		canvas.parent('timelineContainer');
	}
	p.calculateLength = function(length){
		p.length = length;
		p.sec_per_frame = length/canvas_width;
		// console.log(lines.length)
		// console.log('p.sec_per_frame: '+p.sec_per_frame)
	}
	p.resizeTimeline = function(){
		p.calculateLength(p.length)
		p.resizeCanvas(canvas_width,canvas_width/760*timelineHeight)
		p.display()
	}
	p.display = function(){
		console.log('draw timeline')
		p.background(255);
		p.strokeWeight(1)

		var playheadL = 0;
		var playheadT = 0;
		for (let x = 0; x < canvas_width; x++){
			var count = 0;
			var startT = x*p.sec_per_frame;
			var endT = (x+1)*p.sec_per_frame;

			for (let l = playheadL; l<eventsT.length; l++){
				playheadT = eventsT[l]
				if (playheadT > endT){ 
					count += l-playheadL
					break;
				}
			}
			playheadL+=count
			// console.log(eventsT.length)
			// p.stroke(255,255,255,count/100*255)
			p.stroke(200,200,200,255)
			p.line(x,timelineHeight*(1-count/80),x,timelineHeight)
			
		}
	}
	p.draw = function(){
		if (eventsLoaded && canplaythroughLoaded){
			timeline_instance.calculateLength(canplaythroughLoaded)
			timeline_instance.display()
			eventsLoaded = 0
			canplaythroughLoaded = 0;
		}
	}
}

function createTimeline(){
	timeline_instance = new p5(Timeline);
}
function resizeTimeline(){
	timeline_instance.resizeTimeline()
}
// function refreshTimeline(length){
// 	timeline_instance.calculateLength(length)
// 	timeline_instance.display()
// }