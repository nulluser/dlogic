<?

function add_log($data)
{

 // return;

  $data = date("Y-m-d H:i:s") . " - " . $data . "\r\n";

  file_put_contents  ("/tmp/logic_log.txt" , $data , FILE_APPEND);
}

?>