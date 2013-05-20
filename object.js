/* 
	logic engine
	(C) 2013 Jason Hunt
	nulluser@gmail.com
*/


/*
	Object 
*/

"use strict";

var dir_type = new Object();

dir_type.none = 0;
dir_type.up = 1;
dir_type.down = 2;
dir_type.left = 3;
dir_type.right = 4;


function object_type(name)
{
	this.x_pos = 0;
	this.y_pos = 0;
	this.x_size = 50;
	this.y_size = 50;

	this.type = "none";
	
	this.id = 0;
	

	this.selected = 0;
	this.guides = new Array;
	this.attached = -1;
	this.solved = 0;
	this.dir = dir_type.none;
	this.output = 0;
	this.next_output = 0;
	this.source = -1;

	this.show_name = 0;
	this.show_analog = 0;
	this.show_output = 0;

	this.evaluate = function() {  } 
	this.draw_icon = function(ctx) { 		bounding_rect(ctx, this); } 


	this.add_output_terminal = function(objects, pos, store)
	{
		if (!store) return;
		
		var index = add_object(objects, 
							   this.x_pos + this.x_size,
							   this.y_pos + this.y_size/2 - guide_size/2 + pos * (guide_size+2), 
						       "guide", 1, dir_type.right, store);

		this.guides.push(index);
	}


	this.add_input_terminal = function(objects, pos, store)
	{
		if (!store) return;
		
		
		var index = add_object(objects, 
						      this.x_pos-guide_size, 
						      this.y_pos + this.y_size/2 - guide_size/2 + pos * (guide_size+2), 
							  "guide", 1, dir_type.left, store);

		this.guides.push(index);
	}
}






function bounding_rect(ctx, o)
{
	ctx.beginPath();	
	ctx.moveTo(get_x(o.x_pos), get_y(o.y_pos));		
	ctx.lineTo(get_x(o.x_pos+o.x_size), get_y(o.y_pos));
	ctx.lineTo(get_x(o.x_pos+o.x_size), get_y(o.y_pos+o.y_size));
	ctx.lineTo(get_x(o.x_pos), get_y(o.y_pos+o.y_size));
		
	ctx.closePath();	
		
	ctx.fill();
	ctx.stroke();	
}




function add_object(objects, x, y, type, attached, dir, store)
{
	var o = new object_type;

	objects.push(o);

	o.type = type;

	o.x_pos = x;
	o.y_pos = y;

	o.dir = dir;
	
	var index = objects.length - 1;

		
	if (type == "guide")
		o.attached = attached;		
	
	if (store)
	{
		backend_addobject(index, obj[index].type, obj[index].x_pos, obj[index].y_pos, obj[index].x_size, obj[index].y_size, obj[index].attached, obj[index].dir);
	}	
		
		
	// Decode object type
	if (type == "timebase")   timebase_type  (objects, o, store);
	if (type == "binput")     binput_type    (objects, o, store);
	if (type == "httpsource") httpsource_type(objects, o, store);
	if (type == "boutput")    boutput_type   (objects, o, store);
	if (type == "aoutput")    aoutput_type   (objects, o, store);
	if (type == "notgate")     notgate_type  (objects, o, store);
	if (type == "mult")       mult_type      (objects, o, store);
	if (type == "div")        div_type       (objects, o, store);
	if (type == "add")        add_type       (objects, o, store);
	if (type == "sub")        sub_type       (objects, o, store);
	if (type == "power")      power_type     (objects, o, store);
	if (type == "sine")       sine_type      (objects, o, store);
	if (type == "cosine")     cosine_type    (objects, o, store);
	if (type == "andgate")    andgate_type   (objects, o, store);
	if (type == "orgate")     orgate_type    (objects, o, store);
	if (type == "xorgate")    xorgate_type   (objects, o, store);
	if (type == "xyscope")    xyscope_type   (objects, o, store);
	if (type == "guide")      guide_type     (objects, o, store);
	
	if (type == "block")      block_type     (objects, o, store);
	if (type == "vbar")       vbar_type      (objects, o, store);
	if (type == "hbar")       hbar_type      (objects, o, store);
	



	return index;
}


function timebase_type (objects, o, store)
{
	o.x_size = 30;
	o.y_size = 30;

	o.show_output = 1;
		
	o.add_output_terminal(objects, 0, store);		
	
	o.evaluate = function() 
	{ 
		if (this.guides.length < 1) return;
		this.next_output = this.output + 0.01;
		obj[this.guides[0]].next_output = this.next_output;
	} 
	
	o.draw_icon = function(ctx) 
	{
		ctx.beginPath();
				
		ctx.arc(get_x(this.x_pos + this.x_size/2), 
				get_y(this.y_pos + this.y_size/2), 
				(this.x_size/2)*zoom, 0, Math.PI*2, true);				
		
			
		ctx.fill();		
		ctx.stroke();
		
		ctx.closePath();			
	}
}


function binput_type (objects, o, store)
{
	o.x_size = 30;
	o.y_size = 30;
	o.show_output = 1;
	
	o.add_output_terminal(objects, 0, store);		
		
	o.evaluate = function() 
	{ 
		if (this.guides.length < 1) return;

		this.next_output  = this.output;
		obj[this.guides[0]].next_output = this.output;		
	} 	
							 
	o.draw_icon = function(ctx) 
	{
		ctx.beginPath();
		
		ctx.arc(get_x(this.x_pos + this.x_size/2), 
				get_y(this.y_pos + this.y_size/2), 
				(this.x_size/2)*zoom, 0, Math.PI*2, true);
		
		ctx.fill();
		ctx.stroke();
								
	}
}

function httpsource_type (objects, o, store)
{
	o.x_size = 80;
	o.y_size = 30;
	o.show_output = 1;
	
	o.add_output_terminal(objects, 0, store);		
		
	o.source_name = "counter";			
		
	o.evaluate = function() 
	{ 
		if (this.guides.length < 1) return;

		this.next_output  = this.output;
		obj[this.guides[0]].next_output = this.output;		
	} 	
							 
	o.draw_icon = function(ctx) 
	{
		bounding_rect(ctx, this);
								
	}
}

function boutput_type (objects, o, store)
{
	o.x_size = 30;
	o.y_size = 30;
	o.show_output = 1;
	
	o.add_input_terminal(objects, 0, store);		
			
	o.evaluate = function() 
	{ 
		if (this.guides.length < 1) return;

		this.next_output = obj[this.guides[0]].output;
	} 		
	
	o.draw_icon = function(ctx) 
	{
		bounding_rect(ctx, this);
	
	}	
}


function aoutput_type (objects, o, store)
{
	o.x_size = 60;
	o.y_size = 30;
		
	o.show_analog = 1;
	
	o.add_input_terminal(objects, 0, store);	
		
	o.evaluate = function() 
	{ 
		if (this.guides.length < 1) return;

		this.next_output = obj[this.guides[0]].output;
	} 		

	o.draw_icon = function(ctx) 
	{
		bounding_rect(ctx, this);
	}
}

function notgate_type (objects, o, store)
{
	o.show_output = 1;
	
	o.add_input_terminal(objects, 0, store);	
	o.add_output_terminal(objects, 0, store);		
	
	o.evaluate = function() 
	{ 
		if (this.guides.length < 2) return;

		var in1 = obj[this.guides[0]].output;
	
		this.next_output = (in1 > 0.5) ? 0 : 1;

		obj[this.guides[1]].next_output = this.next_output;
	}
	
	o.draw_icon = function(ctx) 
	{
		ctx.beginPath();	
		ctx.moveTo(get_x(this.x_pos), get_y(this.y_pos));		
		ctx.lineTo(get_x(this.x_pos), get_y(this.y_pos + this.y_size));
		ctx.lineTo(get_x(this.x_pos + this.x_size), get_y(this.y_pos + this.y_size/2));
		ctx.closePath();	
		
		ctx.fill();
		ctx.stroke();	
	}
}


function andgate_type (objects, o, store)
{
	o.show_output = 1;  
       	
       	
	o.add_input_terminal(objects, -1, store);	
	o.add_input_terminal(objects, 1, store);	
		
	o.add_output_terminal(objects, 0, store);	       	
       	
 	o.evaluate = function() 
	{ 
		if (this.guides.length < 3) return;

		var in1 = obj[this.guides[0]].output;
		var in2 = obj[this.guides[1]].output;
		
		this.next_output = (in1 > 0.5) && (in2 > 0.5) ? 1 : 0;

		obj[this.guides[2]].next_output = this.next_output;
	} 		
	
	o.draw_icon = function(ctx) 
	{
		ctx.beginPath();	
		ctx.moveTo(get_x(this.x_pos), get_y(this.y_pos));
		ctx.lineTo(get_x(this.x_pos), get_y(this.y_pos + this.y_size  ));		
		ctx.arc(get_x(this.x_pos + this.x_size/2), get_y(this.y_pos + this.y_size/2), this.x_size/2*zoom, 0.5 * Math.PI, 1.5 * Math.PI, true);

		ctx.closePath();	

		ctx.fill();
		ctx.stroke();	
	}	
}


function orgate_type (objects, o, store)
{
	o.show_output = 1;  
        	
	o.add_input_terminal(objects, -1, store);	
	o.add_input_terminal(objects, 1, store);	
		
	o.add_output_terminal(objects, 0, store);	       
     	
	o.evaluate = function() 
	{ 
		if (this.guides.length < 3) return;
	
		var in1 = obj[this.guides[0]].output;
		var in2 = obj[this.guides[1]].output;
		
		this.next_output = (in1 > 0.5) || (in2 > 0.5) ? 1 : 0;

		obj[this.guides[2]].next_output = this.next_output;		
	} 		
	
	o.draw_icon = function(ctx) 
	{
		ctx.beginPath();	
		
		ctx.arc(get_x(this.x_pos - this.x_size * 1.15), 
		        get_y(this.y_pos + this.y_size / 2), 
		        this.x_size*1.2*zoom, 
		        0.10 * Math.PI, 1.90 * Math.PI, true);
		
		ctx.arc(get_x(this.x_pos + this.x_size * 0.05), 
		        get_y(this.y_pos + this.y_size / 2 +  this.y_size * 0.6 ), 
		        this.x_size*1.1*zoom, 
		        1.45 * Math.PI, 1.80 * Math.PI, false);
		
		ctx.arc(get_x(this.x_pos + this.x_size * 0.05), 
		        get_y(this.y_pos + this.y_size / 2 -  this.y_size * 0.6 ), 
		        this.x_size*1.1*zoom, 
		        0.20 * Math.PI, 0.55 * Math.PI, false);

		ctx.closePath();	
				
		ctx.fill();
		ctx.stroke();
	}   	
}


function xorgate_type (objects, o, store)
{
	o.show_output = 1;  
	
        	
	o.add_input_terminal(objects, -1, store);	
	o.add_input_terminal(objects, 1, store);	
		
	o.add_output_terminal(objects, 0, store);	       
     	
	o.evaluate = function() 
	{ 
		if (this.guides.length < 3) return;
	
		var in1 = obj[this.guides[0]].output;
		var in2 = obj[this.guides[1]].output;
		
		this.next_output = (in1 > 0.5) != (in2 > 0.5) ? 1 : 0;

		obj[this.guides[2]].next_output = this.next_output;		
	} 		
	
	o.draw_icon = function(ctx) 
	{
		
		ctx.beginPath();	

		ctx.arc(get_x(this.x_pos - this.x_size * 1.15), 
		        get_y(this.y_pos + this.y_size / 2), 
		        this.x_size*1.2*zoom, 
		        0.10 * Math.PI, 1.90 * Math.PI, true);
		
		ctx.arc(get_x(this.x_pos + this.x_size * 0.05), 
		        get_y(this.y_pos + this.y_size / 2 +  this.y_size * 0.6 ), 
		        this.x_size*1.1*zoom, 
		        1.45 * Math.PI, 1.80 * Math.PI, false);
		
		ctx.arc(get_x(this.x_pos + this.x_size * 0.05), 
		        get_y(this.y_pos + this.y_size / 2 -  this.y_size * 0.6 ), 
		        this.x_size*1.1*zoom, 
		        0.20 * Math.PI, 0.55 * Math.PI, false);
		ctx.closePath();	
		ctx.fill();
		ctx.stroke();


		ctx.beginPath();
		
		ctx.arc(get_x(this.x_pos - this.x_size * 1.15 + 5), 
		        get_y(this.y_pos + this.y_size / 2), 
		        this.x_size*1.2*zoom, 
		        0.10 * Math.PI, 1.90 * Math.PI, true);

		ctx.stroke();		
		
		
		
	}  	
}


function mult_type (objects, o, store)
{
	o.show_analog = 1;
	o.show_name = 1;		
    	
	o.add_input_terminal(objects, -1, store);	
	o.add_input_terminal(objects, 1, store);	
		
	o.add_output_terminal(objects, 0, store);	     	
    	
	o.evaluate = function() 
	{ 
		if (this.guides.length < 3) return;

		var in1 = obj[this.guides[0]].output;
		var in2 = obj[this.guides[1]].output;
		
		this.next_output = in1 * in2;

		obj[this.guides[2]].next_output = this.next_output;		
	} 	
	
	o.draw_icon = function(ctx) 
	{
		bounding_rect(ctx, this);
	}
}

function div_type (objects, o, store)
{
	o.show_analog = 1;
	o.show_name = 1;		
    	
	o.add_input_terminal(objects, -1, store);	
	o.add_input_terminal(objects, 1, store);	
		
	o.add_output_terminal(objects, 0, store);	     	
    	
	o.evaluate = function() 
	{ 
		if (this.guides.length < 3) return;

		var in1 = obj[this.guides[0]].output;
		var in2 = obj[this.guides[1]].output;
		
		if (in2 != 0)
			this.next_output = in1 / in2;
		else
			this.next_output = 0;
		

		obj[this.guides[2]].next_output = this.next_output;		
	} 	
	
	o.draw_icon = function(ctx) 
	{
		bounding_rect(ctx, this);
	}
}

function add_type (objects, o, store)
{
	o.show_analog = 1;
	o.show_name = 1;		
    	
	o.add_input_terminal(objects, -1, store);	
	o.add_input_terminal(objects, 1, store);	
	o.add_output_terminal(objects, 0, store);	     	
	
    o.evaluate = function() 
	{ 
		if (this.guides.length < 3) return;

		var in1 = obj[this.guides[0]].output;
		var in2 = obj[this.guides[1]].output;
		
		this.next_output = in1 + in2;

		obj[this.guides[2]].next_output = this.next_output;				
	} 		
	
	o.draw_icon = function(ctx) 
	{
		bounding_rect(ctx, this);
		
	}  	
}

function sub_type (objects, o, store)
{
	o.show_analog = 1;
	o.show_name = 1;		
    	
	o.add_input_terminal(objects, -1, store);	
	o.add_input_terminal(objects, 1, store);	
	o.add_output_terminal(objects, 0, store);	     	
	
    o.evaluate = function() 
	{ 
		if (this.guides.length < 3) return;

		var in1 = obj[this.guides[0]].output;
		var in2 = obj[this.guides[1]].output;
		
		this.next_output = in1 - in2;

		obj[this.guides[2]].next_output = this.next_output;				
	} 		
	
	o.draw_icon = function(ctx) 
	{
		bounding_rect(ctx, this);
		
	}  	
}


function power_type (objects, o, store)
{
	o.show_analog = 1;
	o.show_name = 1;		
    	
	o.add_input_terminal(objects, -1, store);	
	o.add_input_terminal(objects, 1, store);	
	o.add_output_terminal(objects, 0, store);	     	
	
    o.evaluate = function() 
	{ 
		if (this.guides.length < 3) return;

		var in1 = obj[this.guides[0]].output;
		var in2 = obj[this.guides[1]].output;
		
		this.next_output = Math.pow(in1, in2);

		obj[this.guides[2]].next_output = this.next_output;				
	} 		
	
	o.draw_icon = function(ctx) 
	{
		bounding_rect(ctx, this);
		
	}  	
}

function sine_type (objects, o, store)
{
	o.show_analog = 1;
	o.show_name = 1;
	
	o.add_input_terminal(objects, 0, store);	
	o.add_output_terminal(objects, 0, store);	     	
		
		
	o.evaluate = function() 
	{ 
		if (this.guides.length < 2) return;

		var in1 = obj[this.guides[0]].output;
		
		this.next_output = Math.sin(in1);

		obj[this.guides[1]].next_output = this.next_output;		
	} 		
	
	o.draw_icon = function(ctx) 
	{
		bounding_rect(ctx, this);
	}  	
}


function cosine_type (objects, o, store)
{
	o.show_analog = 1;
	o.show_name = 1;
   	
	o.add_input_terminal(objects, 0, store);	
	o.add_output_terminal(objects, 0, store);	     	
		
	o.evaluate = function() 
	{ 
		if (this.guides.length < 2) return;

		var in1 = obj[this.guides[0]].output;
	
		this.next_output = Math.cos(in1);

		obj[this.guides[1]].next_output = this.next_output;		
	} 	
	
	o.draw_icon = function(ctx) 
	{
		bounding_rect(ctx, this);
	} 	
}


function xyscope_type (objects, o, store)
{
	o.x_size = 200;
	o.y_size = 200;
		
	o.add_input_terminal(objects, -1, store);
	o.add_input_terminal(objects, 1, store);						 	
					 
	o.draw_icon = function(ctx) 
	{ 
		bounding_rect(ctx, this);
				
		if (this.guides.length < 2) return;


		var dot_scale = 0.03;
		
		var x = obj[this.guides[0]].output;
		var y = obj[this.guides[1]].output;
		
		if (x < -1) x = -1;		
		if (x > 1) x = 1;
		
		if (y < -1) y = -1;		
		if (y > 1) y = 1;
				
		ctx.beginPath();
		
		var old_fill = ctx.fillStyle;
		var old_stroke = ctx.strokeStyle;
		
		ctx.strokeStyle = "rgb(0,0,0)";		
		ctx.fillStyle = "rgb(0, 0, 0)";

		ctx.arc(get_x(this.x_pos + this.x_size/2  +  x * this.x_size/2.5), 
				get_y(this.y_pos + this.y_size/2  +  y * this.y_size/2.5), 
				(this.x_size/2)*dot_scale*zoom, 0, Math.PI*2, true);
		
		ctx.fill();
		ctx.stroke();
	
		ctx.strokeStyle = old_stroke; 
		ctx.fillStyle = old_fill;
	} 		
}


function guide_type (objects, o, store)
{
	o.x_size = guide_size;
	o.y_size = guide_size;
		
	o.evaluate = function() 
	{ 
		if (this.source >= 0)
			this.next_output = obj[this.source].output;		// Mirror input guide value
	} 	
	
	o.draw_icon = function(ctx) 
	{	
		var old_fill = ctx.fillStyle;
		
		if (o.output > 0.5)
	    	ctx.fillStyle = "rgb(20, 20, 190)";
	    else
		    ctx.fillStyle = "rgb(190, 20, 20)";
	     	     
  		//ctx.fillRect (get_x(this.x_pos), get_y(this.y_pos), this.x_size*zoom, this.y_size*zoom);	
		
		bounding_rect(ctx, this);
		
		ctx.fillStyle = old_fill;

 		
	}
}



function block_type (objects, o, store)
{
	o.x_size = 30;
	o.y_size = 30;

	
	
	o.draw_icon = function(ctx) 
	{
		var old_fill = ctx.fillStyle;

		ctx.fillStyle = "rgb(60, 60, 60)";

		bounding_rect(ctx, this);			
		
		ctx.fillStyle = old_fill;
	}
}




function vbar_type (objects, o, store)
{
	o.x_size = 10;
	o.y_size = 100;
	
	
	o.draw_icon = function(ctx) 
	{
		var old_fill = ctx.fillStyle;

		ctx.fillStyle = "rgb(60, 60, 60)";

		bounding_rect(ctx, this);			
		
		ctx.fillStyle = old_fill;
	}
}



function hbar_type (objects, o, store)
{
	o.x_size = 100;
	o.y_size = 10;
	
	
	o.draw_icon = function(ctx) 
	{
		var old_fill = ctx.fillStyle;

		ctx.fillStyle = "rgb(60, 60, 60)";

		bounding_rect(ctx, this);			
		
		ctx.fillStyle = old_fill;
	}
}
















function find_object(x, y)
{
	// convert to world cords
	x = get_world_x(x);
	y = get_world_y(y);

	for (var i in obj)
	{
		if (x > obj[i].x_pos &&
			y > obj[i].y_pos &&
			x < obj[i].x_pos + obj[i].x_size &&
			y < obj[i].y_pos + obj[i].y_size )
			return(i);
	}

	return (-1);
}


function unhook_object(i)
{
	// unhook objects linked to this object
	for (var j in obj)
		if (obj[j].source == i)
		{
			obj[j].source = -1;
		
			backend_unhookobject(j, obj[j].id);
		}
			
			
	// unhook main source
	obj[i].source = -1;
		
	backend_unhookobject(i, obj[i].id);
		
	

	for (var j in obj[i].guides)
	{
		unhook_guide(obj[i].guides[j]);
		
		obj[obj[i].guides[j]].source=-1;
		
		backend_unhookobject(obj[i].guides[j], obj[obj[i].guides[j]].id);
		
	}
}


function unhook_guide(i)
{	
	for (var j in obj)
		if (obj[j].source == i)	
		{	
			obj[j].source = -1;
			backend_unhookobject(j, obj[j].id);
		}			
			
	obj[i].source = -1;
}


function delete_object(i)
{
 	unhook_object(i);

	for (var j in obj[i].guides)
		delete_object(obj[i].guides[j]);

	
	backend_deleteobject(i, obj[i].id);

	
	delete obj[i];
	
	
	
	
//	draw_objects();
}


function object_connect(o1, o2)
{	
	obj[o2].source = o1;
	

	backend_hookobject(o1, obj[o2].id, obj[o1].id)
	
}


function object_toggle(o)
{
	if (o.output > 0.5) 
		o.output = 0;
	else
		o.output = 1;
}

/***
	End of object methods 
***/



/***
	Logic Engine 
***/

/* Solve the entire system */
function solve_system( objects )
{
	for (var j = 0; j < 10; j++)
	{
		// Compute next outputs
		for (var i in objects)
		{
			objects[i].evaluate();	
		}	

		// Update all outputs
		for (var i in objects)
		{
			objects[i].output = objects[i].next_output;
		}
	}
}

/***
	End of logic engine
***/










