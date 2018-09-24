

function loadExcel() {
	var url = "Book1.xlsx";
var oReq = new XMLHttpRequest();
oReq.open("GET", url, true);
oReq.responseType = "arraybuffer";

oReq.onload = function(e) {
  var arraybuffer = oReq.response;

  /* convert data to binary string */
  var data = new Uint8Array(arraybuffer);
  var arr = new Array();
  for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  var bstr = arr.join("");

  /* Call XLSX */
  var workbook = XLSX.read(bstr, {type:"binary"});

  /* DO SOMETHING WITH workbook HERE */
  var first_sheet_name = workbook.SheetNames[0];
  /* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];
    
  var sheet_name_list = workbook.SheetNames;  
  
                 var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/  
                 sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/  
                     /*Convert the cell value to Json*/  
                     var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);    
                     if (exceljson.length > 0 && cnt == 0) {  
                         BindTable(exceljson, '#exceltable');  
                         cnt++;  
                     }  
                 });  
				 
  //console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
}

oReq.send();
}

//Randomize Options
function shuffle(arra1) {
    var ctr = arra1.length, temp, index;
// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

 
function GenerateHTML(){
	 
//Generate Buttons
for(var i=0;i<arrayOfQuestions.length;i++){
	if(i==0){
		$(".numbersbox").append("<div class='numbers selected' id="+i+">"+(i+1)+"</div>");
	}else{
		$(".numbersbox").append("<div class='numbers disableClick' id="+i+"><div class='locked' title='Complete the previous question to unlock this question.'></div>"+(i+1)+"</div>");
	}
}
FillQuestionAndOptions(0);
}
 
$(document).on('click','body .numbers',function(){
	//if($(this).find(".locked").length>0){
		//return false;
	//}
	$(this).parent().find(".selected").removeClass("selected");
	$(this).addClass("selected");
	$(this).find(".locked").remove();
	FillQuestionAndOptions($(this).attr("id"));

});


 function FillQuestionAndOptions(questionIndex){
	 $(".questionbox").empty();
	 $(".questionbox").append("<span id='timerbox'>Time remaining : -- seconds</span>");
	 $(".questionbox").append("<div class='question'>"+arrayOfQuestions[questionIndex][0]+"</div>");
	 $(".questionbox").append("<div id='optionsform'></div>");
	 $(".questionbox").append("<div id='nextquestion' class='card'>Next Question</div>");
	 
	var TempArrayOfOptions=[4];
	TempArrayOfOptions[0] = "<div class='optionstyle'><input type='radio' name='option' value='c'>&nbsp;"+arrayOfQuestions[questionIndex][1]+"</div><br>";
	TempArrayOfOptions[1] =  "<div class='optionstyle'><input type='radio' name='option' value='nc'>&nbsp;"+arrayOfQuestions[questionIndex][2]+"</div><br>";
	TempArrayOfOptions[2] =  "<div class='optionstyle'><input type='radio' name='option' value='nc'>&nbsp;"+arrayOfQuestions[questionIndex][3]+"</div><br>";
	TempArrayOfOptions[3] =  "<div class='optionstyle'><input type='radio' name='option' value='nc'>&nbsp;"+arrayOfQuestions[questionIndex][4]+"</div><br>";
	
	TempArrayOfOptions=shuffle(TempArrayOfOptions);
	
	for(var x=0;x<4;x++){
		$("#optionsform").append(TempArrayOfOptions[x]);
	}
	
	startTimer(5);
	console.log(TempArrayOfOptions);
 }
 
 var interval;
 function startTimer(value){
	timerVal=value;
	clearInterval(interval);
	interval = setInterval(function(){
		if(timerVal>0){
			 $("#timerbox").html("Time remaining : "+ --timerVal +" seconds");
		 }else if(timerVal==0){
			 evaluateAnswer();
			// LockQuestion();
			 
		 }
	},1000);
 }
 
 function evaluateAnswer(){
	 var result = "notattempted";
	if($("input[value='c']").is(':checked')){
		 console.log("Correct answer");
		 result = "correct";
	 }else{
		 console.log("Wrong answer");
		  result = "incorrect";
	 }
	 UnlockQuestion(result);
 }
 
 $(document).ready(function(){
	 UnlockQuestion();
 });
 
 function UnlockQuestion(result){
	 $(".numbers").each(function(){
	if($(this).hasClass("selected")){
		if(result != "correct"){
			$(this).css("background", "#ff0131");
			$(this).prepend("<div class='"+result+"' title='Incorrect answer'></div>");
		}else{
			$(this).css("background", "#51ce00");
			$(this).prepend("<div class='"+result+"' title='Correct answer'></div>");
		}
		
		$(this).removeClass("selected");
$("#"+($(this).attr("id")*1+1)).trigger("click");
return false; 
	}	
	 });
	 
	// localStorage.SetItem("Current", );
 }

 var arrayOfQuestions;
 
 function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
}


 function BindTable(jsondata, tableid) {/*Function used to convert the JSON array to Html Table*/  
     var columns = BindTableHeader(jsondata, tableid); /*Gets all the column headings of Excel*/ 

	 //Create array of Options
	 arrayOfQuestions = createArray(jsondata.length,5);
	 console.log(jsondata.length);
     for (var i = 0; i < jsondata.length; i++) {
		 
         for (var colIndex = 0; colIndex < columns.length; colIndex++) {  
             var cellValue = jsondata[i][columns[colIndex]];
		
             if (cellValue == null)
                 cellValue = "";  
			 
			 
		//Fill Questions and options
		arrayOfQuestions[i][colIndex] = cellValue;
        }
     }
	 console.log(arrayOfQuestions);
	 GenerateHTML();
 }

 
 function BindTableHeader(jsondata, tableid) {/*Function used to get all column names from JSON and bind the html table header*/  
     var columnSet = [];
     for (var i = 0; i < jsondata.length; i++) {  
         var rowHash = jsondata[i];  
         for (var key in rowHash) {  
             if (rowHash.hasOwnProperty(key)) {  
                 if ($.inArray(key, columnSet) == -1) {/*Adding each unique column names to a variable array*/  
                     columnSet.push(key);  
                 }  
             }  
         }  
     } 
     return columnSet;  
 } 
 
//Disable Right Click
function rightclick() {
    var rightclick;
    var e = window.event;
    if (e.which) rightclick = (e.which == 3);
    else if (e.button) rightclick = (e.button == 2);{
		if(rightclick==true){
			//alert("Right click is forbidden.");
		}
	}
}

