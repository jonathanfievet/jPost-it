<?php

if ($_POST["action"] == "create") {
	$content = $_POST["content"];
	$color = $_POST["color"];
	$top = $_POST['top'];
	$left = $_POST['left'];

	/**
	* Save the Data in your DataBase.
	* Post-it id should be in AI so $idPost should have that value.
	* I take a random number to show you.
	*/
	$id = rand(2, 9999);

}
elseif ($_POST["action"] == "update") {
	$id = $_POST["id"];
	$content = $_POST["content"];
	$color = $_POST["color"];
	$width = $_POST["width"];
	$top = $_POST['top'];
	$left = $_POST['left'];

	/**
	* Save new Datas in your DataBase.
	*/

}
else {
	$id = $_POST["id"];

	/**
	* Delete in your DataBase.
	*/	
}

echo $id;

?>
