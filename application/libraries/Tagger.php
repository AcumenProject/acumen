<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tagger{

    protected $CI;
    protected $tags;

    function __construct(){
        // Light spam prevention
        // - Check to see is hidden "honey pot" comment field was filled in
        // - Check if the HTTP_REFERER is from this server
        if (!empty($_REQUEST['human'])){
            exit;
        }
        $this->CI =& get_instance();
        $this->CI->load->database();
    }

    /*public function hasTags($asset_name){
        $hasTags = FALSE;
        if (self::$db->query_count("SELECT count(asset_name) as c FROM tags_assets WHERE asset_name = '".$asset_name."'") > 0){
            $hasTags = TRUE;
        }
        return self::$db->query_count("SELECT count(asset_name) as c FROM tags_assets WHERE asset_name = '".$asset_name."'");
    }*/

    public function processTags($tags){
        $this->tags = $tags;
        $this->splitTags();
        $this->approveTags();
    }

    public function approveTags(){
        // Tags returned as an array split into two categories (keys)
        // $tag['approved'] = Array of approved words
        // $tag['banned'] = Array of banned words
        $this->CI->load->library('banned_words');
        $this->tags = $this->CI->banned_words->censor($this->tags);
    }

    public function splitTags(){
        if (is_string($this->tags)){
            $t = preg_split("/[\r\n,]+/", $this->tags, -1, PREG_SPLIT_NO_EMPTY); //explode(',', $this->tags);
            for ($i = 0; $i < count($t); $i++){
                $tags[$i] = trim($t[$i]);
            }
            $this->tags = $tags;
        }
    }

    public function addTags($tags, $asset_name){
        $query = $this->CI->db->query("SELECT count(id) as count FROM asset WHERE name = ?", array($asset_name));
        $asset = $query->row();

        if ($asset->count > 0){
            $this->processTags($tags);
            //Insert approved tags into database with status of 0 (unconfirmed/moderated)
            if (!empty($this->tags['approved'])){
                $this->insertTags($this->tags['approved'], $asset_name, 0);
            }
            //Insert banned tags into database with status of -2 (banned)
            //The banned word script may not always get it right
            if (!empty($this->tags['banned'])){
                $this->insertTags($this->tags['banned'], $asset_name, -2);
            }
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Insert Tags into database
     */

    public function insertTags($tags, $asset_name, $status){
        foreach($tags as $tag){
            // Check if this tag already exists in the database
            $query = "SELECT id FROM tags WHERE value = ?";
            $result = $this->CI->db->query($query, array($tag));
            $match = $result->row_array();
            // If no match found, its a new tag - add tag and associate it with the given asset
            if (empty($match['id'])){
                //self::$db->query("INSERT INTO tags (value) VALUES ($tag)");
                $this->CI->db->insert('tags', array('value' => $tag));
                //self::$db->query("INSERT INTO tags_assets (tag_id, asset_name, status) VALUES (".mysql_insert_id().", $asset_name, $status)");
                $this->CI->db->insert('tags_assets', array('tag_id' => $this->CI->db->insert_id(), 'asset_name' => $asset_name, 'status' => $status));

            }
            else{
                //If a match is found, make sure the tag isn't already associated with the given asset
                $query = "SELECT count(tag_id) as c FROM tags_assets as ta WHERE ta.tag_id = ? AND ta.asset_name = ?";
                $result = $this->CI->db->query($query, array($match['id'], $asset_name));
                $r = $result->row_array();
                if ($r['c'] == 0){
                    //self::$db->query("INSERT INTO tags_assets (tag_id, asset_name, status) VALUES ($match_id, $asset_name, $status)");
                    $this->CI->db->insert('tags_assets', array('tag_id' => $match['id'], 'asset_name' => $asset_name, 'status' => $status));
                }
            }
        }
    }

    public function getTagsByAsset($asset_name){
        $tags = array();
        $query = "SELECT t.value as value, cs.value as status FROM tags as t"
            ." LEFT JOIN tags_assets as ta ON ta.tag_id = t.id"
            ." LEFT JOIN crowd_status as cs ON cs.id = ta.status"
            ." WHERE ta.asset_name = ? AND ta.status >= ?";
        $result = $this->CI->db->query($query, array($asset_name, 0));
        if ($result->num_rows() > 0){
            foreach ($result->result_array() as $t){
                array_push($tags, $t);
            }
        }
        return $tags;
    }

}

/*class TaggerAdmin extends Tagger{
    public $start = 0;
    public $limit = 20;

    function __construct(){
        parent::__construct();
    }

    public function getTagsByName($tag){

    }

    public function getTagsByCollection($repoLoc){

    }

    public function getTagsByStatus($status){
        return $this->getTags("WHERE ta.status = $status");
    }

    public function getTags($where = ''){
        $query = "SELECT"
            ." f0.title as title,"
            ." f0.file_name as file_name,"
            ." f1.title as parent_title,"
            ." GROUP_CONCAT(DISTINCT a.thumb_path, a.name, '_2048.jpg') as thumb,"
            ." GROUP_CONCAT(t.value, '=>', t.id, ':>' ,cs.value SEPARATOR '|') as tags"
            ." FROM tags as t"
            ." JOIN tags_assets as ta ON t.id = ta.tag_id"
            ." JOIN crowd_status as cs ON ta.status = cs.id"
            ." JOIN asset as a ON ta.asset_name = a.name"
            ." JOIN file as f0 ON a.file_id = f0.id"
            ." JOIN file as f1 ON f0.parent_id = f1.id"
            ." $where"
            ." GROUP BY a.name"
            ." LIMIT ". $this->start . ", " . $this->limit;

        $tagged_items = parent::$db->query_results($query);
        foreach ($tagged_items as &$tagged){
            $tags = array();
            foreach (explode('|', $tagged['tags']) as $tags_raw){
                list($value, $id_status) = explode('=>', $tags_raw);
                list($id, $status) = explode(':>', $id_status);
                $tags[] = array('value' => $value, 'id' => $id, 'status' => $status);
            }

            $tagged['tags'] = $tags;
            //$tagged['tag']['id'] = $tags_ids[1];
            $tagged['link'] = USER_PATH . rootFilename($tagged['file_name']);
            $tagged['parent_link'] = USER_PATH . substr($tagged['link'], 0, strrpos($tagged['link'], '_'));
        }
        unset($tagged);
        return $tagged_items;
    }

    /**
     * Update Tag Status
     *
     * Status:
     *  1 = approved
     *  0 = unverified/unmoderated
     *  -1 = rejected (as appropriate tag for asset)
     *  -2 = banned (determined by the lib/BannedWords.php class)
     *
    public function updateTagStatus($tag_id, $status){
        self::$db->query("UPDATE tags SET status=$status WHERE tag_id=$tag_id");
    }

    // Remove tag from database
    public function removeTags($tag_id, $asset_name){
        // Check if tag_id is associated with more than one asset
        $result = self::$db->query_results("SELECT count(tag_id) as c FROM tags_assets WHERE tag_id = $tag_id");
        if ($result[0]['c'] <= 1){
            // If only associated with one (or less) assets, remove tag
            self::$db->query("DELETE FROM tags WHERE id = $tag_id");
        }
        // Remove tag's association from the given asset
        self::$db->query("DELETE FROM tags_assets WHERE tag_id = $tag_id AND asset_name = $asset_name");
    }

}*/