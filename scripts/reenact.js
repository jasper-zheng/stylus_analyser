let file_list;
let lines;
let events = [];

let cur_page = 0;
let cur_task = 2;

// ==========================
// constants:

const width_base = 0.01;
const width_scale = 3.0;
const fading_speed = 0.007;
const fading_min = 0.06;

var canvas_width = 745

// ==========================
// lists:

const tasks = ['body scanning', 'exploring', 'scoring']

// ==========================
// elements

var selectTaskDOM = []
var selectSessionDOM = []

// ==========================

function preload() {
	// put setup code here
	loadJSON('../../../../../data/files.json', handleJSON);
}

function handleJSON(data){
	file_list = data;
	console.log(file_list['s1d1_ter1_score9']);
	lines = loadStrings('../../../../../data/' + file_list['s1d1_ter1_score9'], parseLogs);
}

function parseLogs(data){
	var page_count = 0;
	var first_page_idx = parseInt(lines[0].split(',')[0]);
	var this_page = [];
	lines.forEach((line_str, index) => {
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
			if (index == lines.length - 1){
				events.push(this_page);
			}
		} else {
			events.push(this_page);
			this_page = new Array();
			page_count = page_count+1;
		}
	})
	cur_page = events.length - 1;
}

function windowResized(){
	// console.log(windowWidth + ' ' + windowHeight)
	canvas_width = Math.min(745, windowWidth-30);
	resizeCanvas(canvas_width,canvas_width/760*400)
	trace();
}


function setup() {
	console.log('setting');
	var canvas_div = document.getElementById("canvasContainer");
	var selectPage = document.getElementById("selectPage");
	var selectTask = document.getElementById("selectTask");
	var selectSession = document.getElementById("selectSession");

    var canvas = createCanvas(canvas_width,canvas_width/760*400);
	canvas.parent('canvasContainer');

    console.log(events)
    for (let i = 0; i < events.length; i++){
    	const option = document.createElement("option");
    	option.setAttribute('value',i);
    	option.innerHTML = i;
    	if (i==events.length-1){
    		option.setAttribute('selected','selected');
    	}
    	selectPage.appendChild(option);
    }

    console.log(`Selected item: ${cur_page}`);
    trace();

    selectPage.addEventListener('change', function() {
        cur_page = this.value;
        trace();
    });


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
        }
    });

    Object.entries(file_list).forEach(([log, file_path]) => {
    	console.log(log);

    	// const option = document.createElement("div");
    	// option.setAttribute('class', cur_task == index ? 'ct_div actived' : 'ct_div');
    	// option.setAttribute('value',index);
    	// option.innerHTML = task;
    	// selectTask.appendChild(option);
    	// selectTaskDOM.push(option)
    });

    // selectTask.addEventListener('click', function(e) {
    //     // Check if the clicked element is a table cell
    //     if (e.target.tagName === 'DIV') {
    //         // console.log(`You clicked: ${e.target.getAttribute('value')}`);
    //         cur_task = e.target.getAttribute('value')
    //         selectTaskDOM.forEach((dom,index) =>{
	// 	    	dom.setAttribute('class', cur_task == index ? 'ct_div actived' : 'ct_div');
	// 	    })
    //     }
    // });

    // ===========================================
    
}

function trace() {
	scale(canvas_width/760)
	background(20);
	strokeCap(SQUARE);
	// console.log(cur_page)

	let ink = 1.0;
	let ink_now = 1.0;
	let startX, startY, prevX, prevY, anchorX, anchorY;
	prevX = 0.0;
	prevY = 0.0;
	for (let i = events[cur_page].length; i > 0; i--){
		const phase = events[cur_page][i-1];
		if (phase.decay){
			ink -= fading_speed;
			ink_now = Math.max(fading_min, ink);
		} else {
			ink_now = 1.0;
		}
		stroke(phase.r*255,phase.g*255,phase.b*255,ink_now*255);
		strokeWeight(width_base + width_scale * phase.p);

		anchorX = phase.x;
        anchorY = phase.y;

		if ((i == events[cur_page].length)||(phase.event=="up")){
			startX = phase.x;
			startY = phase.y;
		} else {
			startX = prevX;
			startY = prevY;
		}
		// console.log(startX + ' ' + startY + '; ' + anchorX + ' ' + anchorY)
		line(startX, startY, anchorX, anchorY)
		prevX = anchorX;
		prevY = anchorY;
	}

}

function draw() {
  // put drawing code here
	
}
