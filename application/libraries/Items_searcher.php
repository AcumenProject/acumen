<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once('Searcher.php');

Class Items_searcher extends Searcher{

    public $limit = 40;
    public $split_limit = 40;
    public $loc_id = 0;
    public $title = 'Tital N/A';
    public $file_path;
    public $repo_loc;
    public $list = array();
    public $level_num = 0;
    public $level;
    public $level_labels = array();

    public $totals = array();
    public $asset_total = 0;
    public $metadata_total = 0;

    public function __construct(){
        parent::__construct();

        $this->CI->load->helper('acumen');
        // Labels are derived from the number of '_' in the repo_ids of the list (child) items and not from the current repo_id from the URL.
        // Although the repo_id u0003 has 0 '_' it's children have 1 '_' (e.g., u0003_*). Thus the label would be 'collections'.
        $this->level_labels = array(
            'collection types',
            'collections',
            'items',
            array(
                'audio' => 'tracks',
                'video' => 'clips',
                'image' => 'pages',
                'document' => 'pages'
            ),
            array(
                'audio' => 'subtracks',
                'video' => 'subclips',
                'image' => 'subpages',
                'document' => 'subpages'
            )
        );
    }

    public function init($params){
        parent::_process_params($params);
        $this->CI->load->database();
        //reset $limit if parent constructor redefined the limit from the API call
        if ($this->limit !== $this->split_limit) $this->split_limit = $this->limit;
        
       

        if (isset($params['item'])){
            if (is_numeric($params['item'])){
                $this->loc_id = $params['item'];
                $this->repo_loc = $this->get_repo_loc($params['item']);
            }
            else {
                $this->repo_loc = $params['item'];
                $this->loc_id = $this->get_loc_id($params['item']);
            }
        }

        if ($this->loc_id !== FALSE && $this->repo_loc !== FALSE){
            $this->level_num = $this->get_level_num($this->repo_loc);
            return TRUE;
        }
        return FALSE;
    }

    //TODO: Merge get_repo_loc() and get_loc_id() into one method.
    /**
     * @param $id
     * @return bool|string
     *
     * Get repo_loc (i.e., repository id) from the give database $id
     */
    public function get_repo_loc($id){
        $this->CI->db->select('file_name, file_path, title')
            ->from('file')
            ->where('id', $id);
        $repo_loc = $this->CI->db->get()->row();
        if (!empty($repo_loc)){
            $this->title = $repo_loc->title;
            $this->file_path = file_to_web_path($repo_loc->file_path);
            return strip_file_ext($repo_loc->file_name);
        }
        return FALSE;
    }

    /**
     * @param $repo_loc
     * @return bool|integer
     *
     * Get the database id from the give $repo_loc (i.e., repository id)
     */
    public function get_loc_id($repo_loc){
        $this->CI->db->select('id, file_path, title')
            ->from('file')
            ->where('status_type_id', 1)
            ->like('file_name', $repo_loc, 'after')
            ->order_by('file_name', 'asc')
            ->limit(1);

        $id = $this->CI->db->get()->row();
        if (!empty($id)){
            $this->title = $id->title;
            $this->file_path = $child['file_path'] = file_to_web_path($id->file_path);
            return $id->id;
        }
        return FALSE;
    }

    public function get_list(){
        $assets = $metadata = array();
        $this->get_asset_total();

        if ($this->start < $this->asset_total){
            $assets = $this->get_assets();
            $this->split_limit -= count($assets);
        }

        if ($this->split_limit > 0){
            $this->get_metadata_total();
            if ($this->metadata_total > 0){
                $this->start = max(0, $this->start - $this->asset_total);
                $metadata = $this->get_metadata();
            }
        }

        $this->list = array_merge($assets, $metadata);
    }

    public function get_assets(){
        $assets = array();
        $q = "SELECT a.id as id, a.name as repo_loc, a.thumb_path as thumb_url, a.orig_path as asset_url, at.type as type FROM asset as a"
            ." LEFT JOIN asset_type as at ON a.asset_type_id = at.id"
            ." WHERE a.file_id = ? AND found = 1 ORDER BY name LIMIT ?, ?";
        $query = $this->CI->db->query($q, array($this->loc_id, $this->start, $this->split_limit));
        if ($query->num_rows() > 0){
            foreach ($query->result_array() as $a){
                $asset = array();
                $asset['thumb_url'] = $this->_get_thumb($a['type'], $a['repo_loc'], $a['thumb_url']);
                $asset['self'] = array('link' => $this->CI->config->base_url() . 'api/items/' . $a['repo_loc'] . '/details');
                $asset['repo_loc'] = $a['repo_loc'];
                $asset['type'] = $a['type'];
                $asset['link'] = preg_replace('/_/', '/', $a['repo_loc']) . '/' . '?page='.$this->page.'&limit='.$this->limit;
                array_push($assets, $asset);
            }
        }
        return $assets;
    }
    //TODO: There's silly redundancy here. Change to something more graceful if there is time before the database structure re-vamp.
    public function get_metadata(){
        $metadata = array();
        $q = "SELECT id, file_name as repo_loc, title FROM file WHERE parent_id = ? AND status_type_id = 1 ORDER BY file_name LIMIT ?, ?";
        $query = $this->CI->db->query($q, array($this->loc_id, $this->start, $this->split_limit));
        if ($query->num_rows() > 0){
            foreach ($query->result_array() as $m){
                $meta = array();
                $meta['title'] = $m['title'];

                if ($this->level_num > 1){
                    $ac = $this->_get_count_where('asset', 'file_id = '.$m['id'].' AND status_type_id = 1');
                    $cc = $this->_get_count_where('file', 'parent_id = '.$m['id'].' AND status_type_id = 1');

                    if ($ac == 1 && $cc == 0){
                        $sub_a = "SELECT a.name as name, a.thumb_path as thumb_path, at.type as type FROM asset as a"
                            ." LEFT JOIN asset_type as at ON a.asset_type_id = at.id"
                            ." WHERE found = 1 AND file_id = ".$m['id'];
                        $sub_assets = $this->CI->db->query($sub_a);
                        foreach ($sub_assets->result() as $asset){
                            $meta['thumb_url'] = $this->_get_thumb($asset->type, $asset->name, $asset->thumb_path);
                            $meta['repo_loc'] = $asset->name;
                            $meta['type'] = $asset->type;
                            $meta['self'] = array('link' => $this->CI->config->base_url() . 'api/items/' . $asset->name . '/details');
                            $meta['link'] = preg_replace('/_/', '/', $asset->name) . '/' . '?page='.$this->page.'&limit='.$this->limit;
                        }
                    }
                    else{
                        $meta['repo_loc'] = strip_file_ext($m['repo_loc']);
                        $meta['link'] = preg_replace('/_/', '/', $meta['repo_loc']);
                        $meta['thumb_url'] = $this->_find_thumb($m['id']);
                        $meta['self'] = array('link' => $this->CI->config->base_url() . 'api/items/' . $meta['repo_loc']);
                    }
                }
                else{
                    $meta['repo_loc'] = strip_file_ext($m['repo_loc']);
                    $meta['link'] = preg_replace('/_/', '/', $meta['repo_loc']);
                    $meta['thumb_url'] = $this->_find_thumb($m['id']);
                    $meta['self'] = array('link' => $this->CI->config->base_url() . 'api/items/' . $meta['repo_loc']);
                }
                array_push($metadata, $meta);
            }
        }
        return $metadata;
    }

    public function find_lost($repo_loc){
        if ($id = $this->get_loc_id($repo_loc)){

            $query = "SELECt f2.title as title, f2.file_name as new_loc, a.value as purl FROM file f1"
                ." LEFT JOIN file f2 ON f2.title = f1.title"
                ." LEFT JOIN authority a ON a.file_id = f2.id"
                ." LEFT JOIN authority_type at ON at.id = a.authority_type_id"
                ." WHERE f1.id = $id AND at.type = '_purl'";

            $found = $this->CI->db->query($query)->row();

            if (count($found) > 0){
                $found_link = preg_replace('/_/', '/', strip_file_ext($found->new_loc));
                return Array(
                    'title' => $found->title,
                    'link' => $found_link,
                    'purl' => $found->purl
                );
            }

            return FALSE;
        }
        return FALSE;
    }

    protected function get_asset_total(){
        $q = "SELECT count(a.id) as c, at.type as asset_type, (LENGTH(a.name) - LENGTH(REPLACE(a.name, '_', ''))) as level_num"
                ." FROM asset as a"
                ." LEFT JOIN asset_type as at ON at.id = a.asset_type_id"
                ." WHERE found = 1 AND file_id = ?"
                ." GROUP BY asset_type, level_num";
        $query = $this->CI->db->query($q, array($this->loc_id));
        foreach ($query->result() as $row){
            $level = $this->get_level($row->level_num, $row->asset_type);
            $this->totals[$level] = empty($this->totals[$level]) ? $row->c : $this->totals[$level] + $row->c;
            $this->asset_total += $row->c;
        }
    }

    protected function get_metadata_total(){
        $q = "SELECT count(f.id) as c, at.type as asset_type, (LENGTH(f.file_name) - LENGTH(REPLACE(f.file_name, '_', ''))) as level_num"
            ." FROM file as f"
            ." LEFT JOIN (SELECT file_id, asset_type_id FROM asset LIMIT 1) as a ON a.file_id = f.id"
            ." LEFT JOIN asset_type as at ON at.id = a.asset_type_id"
            ." WHERE f.parent_id = ? AND f.status_type_id=1 AND f.found = 1"
            ." GROUP BY level_num";
        $query = $this->CI->db->query($q, array($this->loc_id));
        foreach ($query->result() as $row){
            $level = $this->get_level($row->level_num, $row->asset_type);
            $this->totals[$level] = empty($this->totals[$level]) ? $row->c : $this->totals[$level] + $row->c;
            $this->metadata_total += $row->c;
        }
    }

    protected function get_level($num, $asset_type = null){
        //Fail Safe - nothing below level 2 (item) should have assets, but just in case, use 'image' level labels as backup.
        $asset_type = is_null($asset_type) ? 'image' : $asset_type;
        $level = $this->level_labels[$num];
        if (is_array($level)){
            $level = $level[$asset_type];
        }
        return $level;
    }

    /**
     * Get level number (0-4) from a repoID (repo_loc)
     * @param $repoID
     * @return int
     */
    private function get_level_num($repoID){
        return substr_count($repoID, '_');
    }

    /**
     * fund_thumb() - For some reason, when Acumen was written, the associated thumbnails were not meant to be
     * 								stored in the database. Only the path to the folder a thumbnail would potentially be in.
     * 							  So thumbnails have to be found manually for every item... ಠ_ಠ
     * @param Long/Int $file_id
     * @return string	-	the path to the associated thumbnail
     */
    protected function _find_thumb($file_id){
        $query = "SELECT a.name as name, a.thumb_path as thumb_url, at.type as type FROM asset as a"
            ." left JOIN asset_type as at ON a.asset_type_id = at.id"
            ." WHERE a.found = 1 AND a.file_id = $file_id ORDER BY a.name LIMIT 1";
        $thumb = $this->CI->db->query($query)->row();
        if (count($thumb) == 0){
            if ($child = $this->CI->db->query("SELECT id FROM file WHERE parent_id = ".$file_id." AND status_type_id = 1 ORDER BY file_name LIMIT 1")->row()){
                return $this->_find_thumb($child->id);
            }
        }
        else{
            return $this->_get_thumb($thumb->type, $thumb->name, $thumb->thumb_url);
        }
        return $this->_get_thumb();
    }

    protected function is_last_meta_child($id){
        return $this->_get_count_where('file', 'parent_id = '.$id.' AND status_type_id = 1') == 0;
    }
}