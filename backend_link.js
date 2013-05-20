/* 
	logic engine
	(C) 2013 Jason Hunt
	nulluser@gmail.com
*/



"use strict";


var id_pending_root = -1;			// index of root object that we are waiting for ids for
var id_pending = 0;					// true if we are waiting for ids
var id_pending_count = 0;			// number of ids we ar waiting for


function backend_request(i, cmd_class, cmd)
{
	var xmlhttp;
	
	if (window.XMLHttpRequest)
  	{	// code for IE7+, Firefox, Chrome, Opera, Safari
  		xmlhttp=new XMLHttpRequest();
  	}
	else
  	{	// code for IE6, IE5
  		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  	}

	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			backend_process(i, cmd_class, xmlhttp.responseText);
		}
	}
	
	xmlhttp.open("GET", "backend_link.php?" + cmd, true);
	xmlhttp.send();
}






function backend_process_addobject(i, cmd_class, data)
{
	obj[i].id = data;


	if (id_pending)
	{
		id_pending_count--;			// waiting for one less ID
		
		//debug("got id for " + i + "<br>pending: " + id_pending_count);		
	
		// see if we are done waiting for ids
		if (id_pending_count == 0)
		{		
			id_pending = 0;

			if (id_pending_root < 0)
			{
				debug("Invalid id_pending_root");
				return;
			}

			//debug("got all id for " + id_pending_root);
			//debug("root: " + i_pending_root);

			// Need to set the source list for the root object
			
			var id_list = new Array;
			
			// buid id list
			for (var j in obj[id_pending_root].guides)
				id_list.push( obj[ obj[id_pending_root].guides[j] ] .id);

			// For comma seperated string to store in backend
			var guide_list = id_list.join(",");

			// debug(obj[id_pending_root].guides.length + " <br>" + guide_list);

			// Set guide list for the root id
			backend_setguides(id_pending_root, obj[id_pending_root].id, guide_list);
			
			id_pending_root = -1;	// Invalidate root
		}
	}
}







function backend_process(i, cmd_class, data)
{
	if (cmd_class == "add_object")
	{
		backend_process_addobject(i, cmd_class, data);
	}
	
	
	if (cmd_class == "list_objects")
	{
	
		//alert(data);
	
		//data = "var json_tmp =   { \"object_list\" : [  ] } ;"
		
		//data = "{ 'object_list' : [  ] }  ";
	
	
		//var tmp_list = 
		var tmp = eval('(' + data + ')');
	
		if (tmp.num == 0) return;
		
	
		for (var j = 0; j < tmp.num; j++)
		{
			var id = parseInt(tmp.object_list[j].id);
			var type = tmp.object_list[j].type;
			var x_pos = parseInt(tmp.object_list[j].x_pos);
			var y_pos = parseInt(tmp.object_list[j].y_pos);
			var attached = parseInt(tmp.object_list[j].attached);
			var dir = parseInt(tmp.object_list[j].dir);
			var source_id = parseInt(tmp.object_list[j].source);
			var guide_list = tmp.object_list[j].term_list;
			
			//alert("id: " + id + " type: " + type + " pos( " + x_pos + "," + y_pos + ")" + " a: " + attached );
		
			id = parseInt(id);
		
			x_pos = parseInt(x_pos);
			y_pos = parseInt(y_pos);
		
			attached = parseInt(attached);
			dir = parseInt(dir);
		
		
			var index = add_object(obj, x_pos, y_pos, type, attached, dir, 0);
	
			obj[index].id = id;
			obj[index].guide_list = guide_list;
			obj[index].source_id = source_id;


			//alert(JSON.stringify(obj[index]));
			//function add_object(objects, x, y, type, attached, dir)
	
		}
	
	
	
	
		// add objects added, need to decode guidelist and sources
		// very bad, O^2
		
		
		for (var j in obj)
		{
		
			var guide_list = obj[j].guide_list.split(',');
			
			//debug(guide_list.length);
			
			for (var k = 0; k < guide_list.length; k++)
			{
		
				for (var l in obj)
				{
					if (obj[l].id == guide_list[k])
					{

					obj[j].guides.push(l);
					
					}
					
					
				}
					
					
			}
				
			
			for (var l in obj)
			{
		
					if (obj[l].id == obj[j].source_id)
					{

					obj[j].source = parseInt(l);
					
					}
									
			}
				
		
		
		}
	
	
	}
	
	
	//alert("Index: " + i + " cmd_class: " + cmd_class + " data: " + data);
}


function backend_update( )
{
	/*for (var i in obj)
	{
		if (obj[i].type == "httpsource")
			data_source_request(i, obj[i].source_name);
		
	}*/
}


function backend_hookobject(index, id, source)
{
	var cmd = "command=hook_object&" +
		      "id=" + id + "&" +
		      "source=" + source;
		      
	//alert(cmd);

 	backend_request(index, "hook_object", cmd);
}



function backend_unhookobject(index, id)
{
	var cmd = "command=unhook_object&" +
		      "id=" + id ;
		      
	//alert(cmd);

 	backend_request(index, "unhook_object", cmd);
}


function backend_deleteobject(index, id)
{
	var cmd = "command=delete_object&" +
		      "id=" + id ;
		      
	//alert(cmd);

 	backend_request(index, "delete_object", cmd);
}




function backend_addobject(index, type, x_pos, y_pos, x_size, y_size, attached, dir)
{
	var cmd = "command=add_object&" +
		      "type=" + type + "&" +
    	      "x_pos=" + x_pos + "&" +
    	      "y_pos=" + y_pos + "&" + 
    	      "x_size=" + x_size + "&" +
    	      "y_size=" + y_size + "&" +
       	      "attached=" + attached + "&" +
    	      "dir=" + dir;

	//alert(cmd);


	if (id_pending == 0)
	{
		id_pending_root = index;
	}
		
	id_pending = 1;
	id_pending_count++;

 	backend_request(index, "add_object", cmd);
}


function backend_moveobject(index, id, x_pos, y_pos)
{
	var cmd = "command=move_object&" +
			  "id=" + id + "&" + 
    	      "x_pos=" + x_pos + "&" +
    	      "y_pos=" + y_pos;
    	      
    	      
	//alert(cmd);

 	backend_request(index, "move_object", cmd);
}



function backend_setguides(index, id, guides)
{
	var cmd_class = "object_setguides";

	var cmd = "command=" + cmd_class + "&" +
		      "id=" + id  + "&" +
		      "guides=" + guides;
		      
	//alert(cmd);

 	backend_request(index, cmd_class, cmd);
}




function backend_load( )
{
	var cmd = "command=list_objects";
	
	reset();
	
	
	backend_request(0, "list_objects", cmd);
}





function backend_start( )
{
	//setInterval(function() { backend_update(); }.bind(this), 1000);
	
	backend_load();
	
	
}
























