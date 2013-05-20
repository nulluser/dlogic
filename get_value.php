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
  
  

  if (get_value("name") == "counter")
  {
	$count = get_value("counter");
  	$count = $count + 1;
  	set_value("counter", $count);
	echo $count;
  } else
  	echo "ERROR Command: " + get_value($command);
 

?>