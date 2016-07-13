<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Item_model extends CI_Model{

    public $name;
    public $asset_path;
    public $type;
    public $size;
    public $last_modified;
    public $metadata;
    public $has_children;

    public function __construct(){
        parent::__construct();
        $this->load->database();
        $this->load->helper('acumen');
    }

    public function get($_item){
        //log_message('debug', print($_item));
        $item = is_numeric($_item) ? $this->getById($_item) : $this->getByName($_item);
       // log_message('debug', print_r($item));

        if ($item){
            $this->name = $item->name;
            $this->asset_path = $item->asset_path;
            $this->type = $item->type;
            $this->size = $item->size;
            $this->last_modified = $item->last_modified;
            $this->has_children = $this->has_meta_child($item->file_id);

            $metadata = $this->getMetadata($item->file_id);
            if ($metadata){
                $metadata->file_path = file_to_web_path($metadata->file_path);
                $this->metadata = $metadata;
            }
        }
    }

    protected function getByName($item){
        $this->db->select('asset.file_id as file_id, asset.name as name, asset.orig_path as asset_path, asset.file_size as size, asset.file_last_modified as last_modified, asset_type.type as type')
            ->from('asset')
            ->join('asset_type', 'asset.asset_type_id = asset_type.id', 'left')
            ->where('name', $item);
        return $this->db->get()->row();
    }

    protected function getById($item){
        $this->db->select('asset.file_id as file_id, asset.name as name, asset.orig_path as asset_path, asset.file_size as size, asset.file_last_modified as last_modified, asset_type.type as type')
            ->from('asset')
            ->join('asset_type', 'asset.asset_type_id = asset_type.id', 'left')
            ->where('id', $item);
        return $this->db->get()->row();
    }

    protected function getMetadata($file_id){
        $this->db->select('f.title as title, f.file_path as file_path, f.file_name as file_name, f.file_last_modified as last_modified, ft.type as type')
            ->from('file as f')
            ->join('file_type as ft', 'f.file_type_id = ft.id', 'left')
            ->where('f.id', $file_id)
            ->like('f.file_name', $this->name.'.', 'after');

        if ($metadata = $this->db->get()->row()){
            return strpos($metadata->file_name, $this->name.'.') !== FALSE ? $metadata : FALSE;
        }
        return FALSE;
    }

    protected function has_meta_child($id){
        $this->db->select("count(id) as c");
        $this->db->from('file');
        $this->db->where("parent_id = $id AND status_type_id = 1");
        return $this->db->get()->row()->c > 0;
    }
}