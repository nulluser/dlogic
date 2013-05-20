<?

require_once("log.php");

function table_get( $val ) 
{
  $val = mysql_real_escape_string($val);

  if ($val == "") $val = "&nbsp";

  return($val);
}


function database_connect( ) 
{
  //add_log("Database Connect");

  $link = mysql_connect("localhost", "zuser", "zuser") or error("Unable to collect to database");

  mysql_select_db('logic', $link) or error("Unable to select database");

  return($link);
}


function database_close($link ) 
{
//  add_log("Database Close");

  mysql_close($link);
}

function database_query($query)
{
  add_log("Database Query:  {$query} ");

  $result = mysql_query($query) or die('Query failed: <div class=error_box>' . mysql_error(). '</div>');

  return($result);
}


?>