<?
  session_start();

  header('Cache-Control: no-cache');
  header('Pragma: no-cache');  
  
  require_once("database.php");
  
  function get_value($name)
  {
    if (isset($_GET[$name])) return $_GET[$name];
	if (isset($_POST[$name])) return $_POST[$name];
	if (isset($_SESSION[$name])) return $_SESSION[$name];
	
	return "";
  }		

  function set_value($name, $value)
  {
  	$_SESSION[$name] = $value;
  }		
  
  
  
  
  // zuser zuser
  function show_objects( )
  {
  	$link = database_connect() ;
  	
  	
  	$result = database_query("select * from objects");
  	
  	while($row = mysql_fetch_assoc($result))
  	{
	    echo "ID: " . $row['id'];
	    echo " Type:  " . $row['type'];
	    echo " pos:  (" . $row['x_pos'] . "," . $row['y_pos'] . ") ";
	    echo " size: (" . $row['x_size'] . "," . $row['y_size'] . ") ";
	    echo "<br>";
	    
	}
  	
  	database_close($link); 
  
  }
  
  // zuser zuser
  function list_objects( )
  {
  	$link = database_connect() ;
  	
  	
  	$result = database_query("select * from objects");
  	
  	
  	$num = mysql_num_rows($result);
  	
  	$count = 0;
  	
  	$json_data = "  { 'num' : '" .$num. "', 'object_list' : [ ";	
  	
  	if (1)	
  	while($row = mysql_fetch_assoc($result))
  	{
		$json_data .=  " { " . 
	 
	 			" 'id' : '" . $row['id'] . "' , " .
	  			" 'type' : '" . $row['type'] ."' , " .
	            " 'x_pos' : '" . $row['x_pos'] . "' , " .
	 			" 'y_pos' : '" . $row['y_pos'] . "' , " .
	            " 'x_size' : '" . $row['x_size'] . "' , " .
	            " 'y_size' : '" . $row['y_size'] ."', " .
	            " 'attached' : '" . $row['attached'] ."', " .
	            " 'dir' : '" . $row['dir'] ."', " .	            
	            " 'source' : '" . $row['source'] ."', " .	            
	            " 'term_list' : '" . $row['term_list'] ."' " .
	              
	               " } ";
	    
	    if ($count++ != $num - 1)
	    	 $json_data .= ",";
    
	}
  	
  	$json_data .= " ] }  ";
  	  	
  	
  	echo $json_data;
 	
  	
  	database_close($link); 
 }  
  

  	$command = get_value("command");
  
 	
  	//print_r($_GET);
  
  	if ($command == "show")
  	{
		show_objects();
	} else

	if ($command == "list_objects")
	{
		list_objects();	    
		
		
  } else

	if ($command == "hook_object")
	{
	    $id = get_value("id");
	    $source = get_value("source");
	    
		$link = database_connect();
  	
		$query  = "update objects set source = '{$source}' where id = '{$id}' limit 1;";

		$result = database_query($query);
  	
		database_close($link);  
				    
  } else


	if ($command == "unhook_object")
	{
	    $id = get_value("id");

		$link = database_connect();
  	
		$query  = "update objects set source = '-1' where id = '{$id}' limit 1;";

		$result = database_query($query);
  	
		database_close($link);  
			
	    
  } else


	if ($command == "object_setguides")
	{
	    $id = get_value("id");
	    $guides = get_value("guides");

		$link = database_connect();
  	
		$query  = "update objects set term_list = '{$guides}' where id = '{$id}' limit 1;";

		$result = database_query($query);
  	
		database_close($link);  
			
	    
  } else


	if ($command == "delete_object")
	{
	    $id = get_value("id");

		$link = database_connect();
  	
		$query  = "delete from objects where id = '{$id}' limit 1;";

		$result = database_query($query);
  	
		database_close($link);  
			
	    
  } else





	if ($command == "add_object")
	{
		//echo " Type:  " . get_value("type");
		//echo " pos:  (" . get_value("x_pos") . "," . get_value("y_pos") . ") ";
		//echo " size: (" . get_value("x_size") . "," . get_value("y_size") . ") ";
		//echo "<br>";
	    
	    $type = get_value("type");
	    $x_pos = get_value("x_pos");
	    $y_pos = get_value("y_pos");
	    $x_size = get_value("x_size");
	    $y_size = get_value("y_size");

	    $attached = get_value("attached");
	    $dir = get_value("dir");

	    
		$link = database_connect() ;
  	
		$query  = "insert into objects (type, x_pos, y_pos, x_size, y_size, attached, dir)  
					values    ('{$type}', '{$x_pos}', '{$y_pos}', '{$x_size}', '{$y_size}', '{$attached}', '{$dir}');";


		$result = database_query($query);
  	
		$last_id = mysql_insert_id();		

		database_close($link);  
			
		echo $last_id;
	    
  } else
  	if ($command == "move_object")
	{
		//echo " Type:  " . get_value("type");
		//echo " pos:  (" . get_value("x_pos") . "," . get_value("y_pos") . ") ";
		//echo " size: (" . get_value("x_size") . "," . get_value("y_size") . ") ";
		//echo "<br>";
	    
	    $id = get_value("id");
	    $x_pos = get_value("x_pos");
	    $y_pos = get_value("y_pos");

	    
		$link = database_connect() ;
  	
		$query  = "update objects set x_pos = " . $x_pos . ", y_pos = " . $y_pos . " where id = '" . $id . " ' ;" ;
		

		$result = database_query($query);
  	
		database_close($link);  
	    
  } else
	echo "ERROR Command: " + get_value($command);
	
	
?>