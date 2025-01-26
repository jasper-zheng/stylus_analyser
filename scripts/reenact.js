var file_list;
fetch('../../../../../data/files.json')
    .then(response => response.json())
    .then(files => {
    	file_list = files;
        // const fileList = document.getElementById('file-list');
        // console.log(files);
        for (const file in files){
        	// console.log(file);
        	// console.log(files[file]);
        }
    })
    .catch(error => console.error('Error fetching file list:', error));

function setup() {
 // put setup code here
	createCanvas(400,400);

    console.log(file_list['s1d1_ter1_score5']);
    fetch('../../../../../data/' + file_list['s1d1_ter1_score5'])
		.then(response => response.text())
		.then((data) => {
			console.log(data)
		})

}

function draw() {
  // put drawing code here
	background(0);
}
