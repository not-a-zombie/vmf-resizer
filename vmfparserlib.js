//This parser was originally written for C so the format is really weird for javascript
//an object is defined as a keyval and another object - basically a linked list
//a keyval is defined as a string key, a string_val or obj_val, and a boolean isStringVal
//note that the quotation marks used in object names are kept because I'm lazy

//a plane is defined as an array of 9 numbers - 3 groups of 3, where each group is one point
function displacePlane(displacement,plane){
	return [plane[0]+displacement[0],plane[1]+displacement[1],plane[2]+displacement[2],plane[3]+displacement[0],plane[4]+displacement[1],plane[5]+displacement[2],plane[6]+displacement[0],plane[7]+displacement[1],plane[8]+displacement[2]];
}
function calculateNormalOfPlane(plane){
	//calculate cross product of p2-p1 and p3-p2, then normalize
	var v1 = [ plane[3]-plane[0] ,plane[4]-plane[1] ,plane[5]-plane[2] ];
	var v2 = [ plane[6]-plane[3] ,plane[7]-plane[4] ,plane[8]-plane[5] ];
	var crossProduct = [ v1[1]*v2[2] - v1[2]*v2[1]  , v1[2]*v2[0] - v1[0]*v2[2]  , v1[0]*v2[1] - v1[1]*v2[0] ];
	return normalizeVec(crossProduct);
}
//[theta,phi]
function vecToEulerAngles(vec){
	vec=normalizeVec(vec);
	var phi = Math.asin(vec[2]);
	if(vec[0]!=0||vec[1]!=0){
		var theta = Math.atan2(vec[1],vec[0]);
		return [theta,phi];
	}
	return [0,phi];
}
function normalizeVec(vec){
	size = Math.sqrt(vec[0]*vec[0]+vec[1]*vec[1]+vec[2]*vec[2]);
	return [vec[0]/size,vec[1]/size,vec[2]/size];
}
function unquote(str){
	if(str.charAt(0)=='"'){
		str=str.substring(1,str.length);
	}
	if(str.charAt(str.length-1)=='"'){
		str=str.substring(0,str.length-1);
	}
	return str;
}
function quote(str){
	return "\""+str+"\"";
}
function strToPlane(str){
	return str.match(/[\d\.\-]+/g).map(Number);
}
function planeToStr(plane){
	return "\"(" + plane[0] + " " + plane[1] + " " + plane[2] + ") (" + plane[3] + " " + plane[4] + " " + plane[5] + ") (" + plane[6] + " " + plane[7] + " " + plane[8] + ")\"";
}
function findKeyval(obj,key){
	return _findKeyval(obj.obj_val,key);
}
function _findKeyval(obj,key){
	if(obj.keyval){
		if(obj.keyval.key==key){
			return obj.keyval;
		}
	}
	if(obj.nextObj){
		return _findKeyval(obj.nextObj,key);
	}
	return null;
}
function findAllKeyvals(obj,key){
	var result = [];
	_findAllKeyvals(obj.obj_val,key,result);
	return result;
}
function _findAllKeyvals(obj,key,result){
	if(obj.keyval){
		if(obj.keyval.key==key){
			result.push(obj.keyval);
		}
	}
	if(obj.nextObj){
		_findAllKeyvals(obj.nextObj,key,result);
	}
}
function findAllKeyvalsRecursive(obj,key){
	var result = [];
	_findAllKeyvalsRecursive(obj,key,result);
	return result;
}
function _findAllKeyvalsRecursive(obj,key,result){
	if(obj.keyval){
		if(obj.keyval.key==key){
			result.push(obj.keyval);
		}
		if(!obj.keyval.isStringVal){
			_findAllKeyvalsRecursive(obj.keyval.obj_val,key,result);
		}
	}
	if(obj.nextObj){
		_findAllKeyvalsRecursive(obj.nextObj,key,result);
	}
}
function printVMF(obj){
	outStr="";
	tabLevel = 0;
	printObj(obj);
	return outStr;
}
var tabLevel = 0;
var outStr=""
function printTabs(){
	for(var i = 0; i < tabLevel; i++){
		outStr+="\t"
	}
}
function printObj(obj){
	if(!obj.keyval){
		printTabs();
		outStr+="{\r\n";
		tabLevel++;
	}else{
		if(obj.keyval.isStringVal){
			printTabs();
			outStr+=obj.keyval.key+" "+obj.keyval.string_val+"\r\n";
		}else{
			printTabs();
			outStr+=obj.keyval.key + "\r\n";
			printObj(obj.keyval.obj_val);
		}
	}
	if(obj.nextObj){
		printObj(obj.nextObj);
	}
	if(!obj.keyval){
		tabLevel--;
		printTabs();
		outStr+="}\r\n";
	}
}