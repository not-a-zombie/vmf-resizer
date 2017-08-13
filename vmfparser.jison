//This parser was originally written for C so the format is really weird for javascript
//an object is defined as a keyval and another object - basically a linked list
//a keyval is defined as a string key, a string_val or obj_val, and a boolean isStringVal
//note that the quotation marks used in object names are kept

/* lexical grammar */
%lex
%%

[ \t\n\r] {
	//discard spaces and tabs
}

"{" {
	return 'OPENBRACKET';
}
"}" {
	return 'CLOSEBRACKET';
}
<<EOF>>               return 'EOF'
\"[^\\"]*\" {
	return 'WORD';
}
[^ \t\n\r{}][^ \t\n\r{}]* {
	return 'WORD';
}


/lex
	
%start goal

%% /* language grammar */

goal:
	keyvalues EOF
	{
		return $1;
	}
	;
	
object:
	'OPENBRACKET' keyvalues 'CLOSEBRACKET'
	{
		var obj = {};
		obj.nextObj = $2;
		$$ = obj;
	}
	;
	
keyvalues:
	keyvalue keyvalues
	{
		var obj = {};
		obj.keyval = $1;
		obj.nextObj = $2;
		$$ = obj;
	}
	|
	{
		$$ = null;
	}
	;
	
keyvalue:
	wordthing wordthing{
		//console.log("key+value: " + $1 + " " + $2);
		var keyval = {};
		keyval.key= $1;
		keyval.string_val = $2;
		keyval.isStringVal=true;//i forget what this is for
		$$=keyval;
	}
	|
	wordthing object{
		//console.log("key+object: " + $1);
		var keyval = {};
		keyval.key=$1;
		keyval.obj_val=$2;
		keyval.isStringVal=false;
		$$=keyval;
	}
	;
	
wordthing:
	WORD
	{
		//console.log("word found: " + yytext);
		$$ = yytext;
	}
	;