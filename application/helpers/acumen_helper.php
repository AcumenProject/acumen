<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * build includes for JS and CSS based on acumen.php config spec
 * @param Array $includes - generally will be an Array from acumen config file, but can be custom
 */
function build_inc($includes){
    $result = array();
    foreach ($includes as $key => $inc){
        if (is_array($inc)){
            foreach ($inc as $i){
               $result[] = $key . $i;
            }
        }
        else{
            $result[] = $inc;
        }
    }
    return $result;
}

function strip_file_ext($file){
	return strstr($file, '.', TRUE);
}

function file_to_web_path($path){
    return preg_replace('/\/srv\/www\/htdocs\//', 'http://acumen.lib.ua.edu/', $path);
}

function loc_has_children($id){
	$CI =& get_instance();

	$query = "SELECT IF(count(a.id) > 0 OR count(f1.id) > 0, 1, 0) as 'yes'"
						." FROM file as f0"
						." LEFT JOIN file as f1 ON f1.parent_id = f0.id"
						." LEFT JOIN asset as a ON a.file_id = f0.id"
						." WHERE f0.id = ?";
	$q = $CI->db->query($query, array($id));
	return $q->row()->yes ? TRUE : FALSE;
}

function get_parent_loc($loc){
    $parent = explode('_', $loc);
    array_pop($parent);
    return implode('_', $parent);
}

function get_level_num($repoID){
    return substr_count($repoID, '_');
}